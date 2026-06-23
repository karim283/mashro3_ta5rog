import logging
import re
from pathlib import Path
from typing import Optional

from openai import OpenAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

from config import (
    EMBEDDING_MODEL,
    GROQ_API_KEY,
    LLM_MODEL,
    MAX_TOKENS,
    TEMPERATURE,
    VECTORSTORE_DIR,
)
from utils.prompts import prompt_template
from utils.retriever import build_retriever

logger = logging.getLogger(__name__)


class RAGService:
    def __init__(self):
        self.embeddings = self._load_embeddings()
        self.db = self._load_vectorstore(self.embeddings)
        self.retriever = build_retriever(self.db)
        self.llm = self._load_llm()

    def _load_embeddings(self) -> HuggingFaceEmbeddings:
        logger.info("Loading embeddings model: %s", EMBEDDING_MODEL)
        return HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
        )

    def _load_vectorstore(self, embeddings: HuggingFaceEmbeddings) -> FAISS:
        logger.info("Loading FAISS vectorstore from %s", VECTORSTORE_DIR)
        if not Path(VECTORSTORE_DIR).exists():
            raise FileNotFoundError(
                f"Vectorstore not found at {VECTORSTORE_DIR}. Run ingest.py first."
            )
        return FAISS.load_local(
    str(VECTORSTORE_DIR),
    embeddings,
    allow_dangerous_deserialization=True
)

    def _load_llm(self) -> OpenAI:
        if not GROQ_API_KEY:
            raise EnvironmentError("Missing GROQ_API_KEY in environment")

        logger.info("Initializing Groq OpenAI-compatible client")
        return OpenAI(
            api_key=GROQ_API_KEY,
            base_url="https://api.groq.com/openai/v1",
        )

    def _build_prompt(self, question: str, context: str, context_history: Optional[str]) -> str:
        if context_history:
            context = f"Previous conversation:\n{context_history}\n\nRetrieved context:\n{context}"
        return prompt_template.format(context=context, question=question)

    def _parse_response(self, response) -> str:
        output_text = getattr(response, "output_text", None)
        if output_text:
            return output_text.strip()

        output = getattr(response, "output", None)
        if isinstance(output, list) and output:
            first = output[0]
            if isinstance(first, dict):
                return first.get("content", {}).get("text", "").strip()
            return str(first).strip()

        choices = getattr(response, "choices", None)
        if choices and len(choices) > 0:
            choice = choices[0]
            message = getattr(choice, "message", None)
            if message and isinstance(message, dict):
                return message.get("content", {}).get("text", "").strip()

        return "I could not find that information in the documents."

    # Small social intent helpers so the assistant can chat normally for greetings
    def _is_greeting(self, q: str) -> bool:
        if not q:
            return False
        return re.search(r"\b(hello|hi|hey|good morning|good afternoon|good evening)\b", q) is not None

    def _is_howareyou(self, q: str) -> bool:
        return re.search(r"\b(how are you|how's it going|how are u)\b", q) is not None if q else False

    def _is_thanks(self, q: str) -> bool:
        return re.search(r"\b(thank|thanks|thx)\b", q) is not None if q else False

    def _is_farewell(self, q: str) -> bool:
        return re.search(r"\b(bye|goodbye|see you)\b", q) is not None if q else False

    def answer(self, question: str, context_history: Optional[str] = None) -> str:
        logger.debug("Retrieving relevant documents for question")
        q_clean = (question or "").strip().lower()
        # handle simple conversational intents locally
        if self._is_greeting(q_clean):
            return "Hello! How can I help with your car?"
        if self._is_howareyou(q_clean):
            return "I'm ready to help — tell me the symptoms."
        if self._is_thanks(q_clean):
            return "You're welcome."
        if self._is_farewell(q_clean):
            return "Goodbye."

        documents = self.retriever.get_relevant_documents(question)
        if not documents:
            return "I could not find that information in the documents."

        context = "\n\n".join(doc.page_content for doc in documents)
        prompt_text = self._build_prompt(question, context, context_history)

        response = self.llm.responses.create(
            model=LLM_MODEL,
            input=prompt_text,
            temperature=TEMPERATURE,
            max_output_tokens=MAX_TOKENS,
        )

        return self._parse_response(response)
