import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
VECTORSTORE_DIR = BASE_DIR / "vectorstore"
EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"
LLM_MODEL = "llama-3.1-8b-instant"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 100
SEARCH_K = 4
TEMPERATURE = 0.3
MAX_TOKENS = 400

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
HUGGINGFACE_API_TOKEN = os.environ.get("HUGGINGFACE_API_TOKEN")

if not GROQ_API_KEY:
    raise EnvironmentError(
        "Missing GROQ_API_KEY in environment. Add GROQ_API_KEY to your .env file."
    )

VECTORSTORE_DIR.mkdir(parents=True, exist_ok=True)
