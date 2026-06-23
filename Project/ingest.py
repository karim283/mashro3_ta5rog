import logging
from pathlib import Path

from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from config import (
    DATA_DIR,
    EMBEDDING_MODEL,
    VECTORSTORE_DIR,
    CHUNK_OVERLAP,
    CHUNK_SIZE,
    HUGGINGFACE_API_TOKEN,
)
from utils.pdf_loader import load_pdfs

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")


def main() -> None:
    logger.info("Starting ingestion process")

    documents = load_pdfs(DATA_DIR)
    if not documents:
        logger.error("No documents were loaded. Ensure PDFs exist in %s", DATA_DIR)
        return

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", " ", ""],
    )
    chunks = splitter.split_documents(documents)
    logger.info("Created %d document chunks", len(chunks))

    model_kwargs = {"device": "cpu"}
    if HUGGINGFACE_API_TOKEN:
        logger.info("Using Hugging Face token from environment")

    embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs=model_kwargs,
    )

    db = FAISS.from_documents(chunks, embeddings)
    db.save_local(str(VECTORSTORE_DIR))
    logger.info("Saved FAISS vector store to %s", VECTORSTORE_DIR)


if __name__ == "__main__":
    main()
