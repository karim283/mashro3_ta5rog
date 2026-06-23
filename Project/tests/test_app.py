import importlib
import os
import sys
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


class ChatbotConfigTests(unittest.TestCase):
    def setUp(self):
        self.original_key = os.environ.get("GROQ_API_KEY")
        os.environ.pop("GROQ_API_KEY", None)

    def tearDown(self):
        if self.original_key is None:
            os.environ.pop("GROQ_API_KEY", None)
        else:
            os.environ["GROQ_API_KEY"] = self.original_key

    def test_missing_groq_key_returns_503(self):
        import app

        importlib.reload(app)
        client = TestClient(app.app)

        response = client.post("/chat", json={"question": "My car won't start"})

        self.assertEqual(response.status_code, 503)
        self.assertIn("GROQ_API_KEY", response.text)


if __name__ == "__main__":
    unittest.main()
