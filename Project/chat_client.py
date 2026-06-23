import json
import requests

try:
    import msvcrt
except ImportError:
    msvcrt = None

API_URL = "http://127.0.0.1:8000/chat"
HEALTH_URL = "http://127.0.0.1:8000/health"


def check_server():
    try:
        response = requests.get(HEALTH_URL, timeout=5)
        return response.status_code == 200
    except Exception:
        return False


def read_input(prompt: str) -> str:
    if msvcrt is None:
        return input(prompt)

    print(prompt, end="", flush=True)
    buffer = []
    while True:
        char = msvcrt.getwch()
        if char == "\r":
            print("")
            return "".join(buffer)
        if char == "\x1b":
            print("\n")
            return "ESC"
        if char in {"\b", "\x7f"}:
            if buffer:
                buffer.pop()
                print("\b \b", end="", flush=True)
            continue
        if char == "\x00" or char == "\xe0":
            msvcrt.getwch()
            continue
        buffer.append(char)
        print(char, end="", flush=True)


def chat_loop():
    print("Starting chat client. Type 'exit', 'quit', 'bye', or press ESC to stop.")
    session_id = read_input("Enter a session ID (optional, press Enter to skip): ").strip() or None

    while True:
        question = read_input("You: ")
        if question == "ESC":
            print("Exiting chat client.")
            break
        question = question.strip()
        if not question:
            continue
        if question.lower() in {"exit", "quit", "bye"}:
            print("Exiting chat client.")
            break

        payload = {"question": question}
        if session_id:
            payload["session_id"] = session_id

        try:
            response = requests.post(API_URL, json=payload, timeout=20)
            response.raise_for_status()
            data = response.json()
            answer = data.get("answer", "No answer returned.")
            print(f"Bot: {answer}\n")
        except requests.exceptions.RequestException as error:
            print(f"Request failed: {error}")
            print("Make sure the FastAPI server is running at http://127.0.0.1:8000")
            break


if __name__ == "__main__":
    if not check_server():
        print("Chat server is not reachable at http://127.0.0.1:8000")
        print(r"Start the API with: .\.venv\Scripts\python.exe -m uvicorn app:app --host 0.0.0.0 --port 8000")
    else:
        chat_loop()
