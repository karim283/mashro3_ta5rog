import asyncio

import app


class FakeRAGService:
    def __init__(self):
        self.calls = []

    def answer(self, question, context_history=None):
        self.calls.append((question, context_history))
        return "from rag"


def test_chat_uses_rag_when_available(monkeypatch):
    monkeypatch.setattr(app, "RAGService", FakeRAGService)
    monkeypatch.setattr(app, "rag_service", None)
    monkeypatch.setattr(app, "client", None)

    result = asyncio.run(app.chat(app.ChatRequest(question="Where is the repair shop?", session_id="abc")))

    assert result.answer == "from rag"
