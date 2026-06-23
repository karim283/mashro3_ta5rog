# Production-Ready PDF RAG Chatbot Backend

This repository implements a fast, production-ready Retrieval-Augmented Generation (RAG) backend using Python, FastAPI, FAISS, HuggingFace embeddings, Groq API, and PyMuPDF.

## Project Structure

project/
├── app.py
├── ingest.py
├── rag.py
├── config.py
├── requirements.txt
├── .env.example
├── vectorstore/
├── data/
└── utils/
    ├── pdf_loader.py
    ├── retriever.py
    └── prompts.py

## Setup

1. Create a virtual environment and activate it.
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # macOS/Linux
   .venv\Scripts\activate     # Windows PowerShell
   ```

2. Install dependencies.
   ```bash
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and set your keys.
   ```bash
   copy .env.example .env
   ```

4. Place your PDF files under the `data/` directory.

## Ingest PDFs

Build the vector database once:

```bash
python ingest.py
```

This will:
- load PDFs recursively from `data/`
- extract text using PyMuPDF
- split content into 500-token chunks with 100-token overlap
- embed chunks using `BAAI/bge-small-en-v1.5`
- save a FAISS index to `vectorstore/`

## Start the FastAPI Server

```bash
uvicorn app:app --host 0.0.0.0 --port 8000
```

The API loads embeddings, the FAISS index, and the Groq client once at startup.

## Example API Request

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the main topic of the documents?"}'
```

### Example JSON Response

```json
{
  "answer": "The documents discuss the requested subject using information retrieved from the PDF context."
}
```

## Health Check

```bash
curl http://localhost:8000/health
```

## Notes

- Do not run `ingest.py` every time the API starts.
- Rebuild the vector store only when documents change.
- The chatbot answers using only the retrieved PDF context.
- If the answer is missing, the model responds with a safe fallback message.
