import logging
import os
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env"), override=False)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="CarCareX Chatbot")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to Groq API
GROQ_API_KEY = os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY")
def get_client():
    if not GROQ_API_KEY:
        logger.warning("GROQ_API_KEY is not set. Chatbot requests will return HTTP 503 until it is configured.")
        return None
    return OpenAI(
        api_key=GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1",
    )

client = get_client()

# This is the car expert system prompt
SYSTEM_PROMPT = """You are CarCareX Assistant, an expert automotive diagnostic assistant 
for vehicle owners in Alexandria, Egypt. Your job is to help users identify potential 
problems with their vehicles based on symptoms they describe.

When a user describes a symptom:
1. Ask clarifying questions if needed (what sound, when it happens, which part of the car)
2. Provide 2-3 possible causes ranked by likelihood
3. Tell them if it is safe to drive or not
4. Recommend whether they need urgent repair or can wait
5. Suggest what type of specialist they need (mechanic, electrician, etc.)

Keep responses clear, friendly and practical. You serve Egyptian car owners so be 
aware of common cars in Egypt like Kia, Hyundai, Toyota, Nissan, Chevrolet, MG, BYD.
CRITICAL LANGUAGE RULE: You MUST respond in the EXACT same language the user writes in. If the user writes in English, respond ONLY in English. If the user writes in Arabic, respond ONLY in Arabic. Never mix languages. Never respond in Arabic if the user wrote in English."""

conversation_history = {}

class ChatRequest(BaseModel):
    question: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "CarCareX chatbot is ready."}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.question or not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    if client is None:
        raise HTTPException(
            status_code=503,
            detail="Chatbot is not configured. Set the GROQ_API_KEY environment variable.",
        )

    try:
        # Build message history for this session
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Add previous conversation if session exists
        if request.session_id and request.session_id in conversation_history:
            messages.extend(conversation_history[request.session_id])

        # Add the new user message
        messages.append({"role": "user", "content": request.question})

        # Send to Groq
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.3,
            max_tokens=500,
        )

        answer = response.choices[0].message.content

        # Save conversation history
        if request.session_id:
            if request.session_id not in conversation_history:
                conversation_history[request.session_id] = []
            conversation_history[request.session_id].append(
                {"role": "user", "content": request.question}
            )
            conversation_history[request.session_id].append(
                {"role": "assistant", "content": answer}
            )
            # Keep only last 10 messages to save memory
            conversation_history[request.session_id] = \
                conversation_history[request.session_id][-10:]

        return ChatResponse(answer=answer)

    except Exception as e:
        logger.error("Chatbot error: %s", str(e))
        raise HTTPException(status_code=500, detail="Chatbot error: " + str(e))