FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir fastapi uvicorn openai python-dotenv langchain-community langchain-core langchain-huggingface sentence-transformers faiss-cpu pymupdf

COPY . .

ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]