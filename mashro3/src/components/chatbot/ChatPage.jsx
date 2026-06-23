import { ArrowLeft, Send, Bot, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import defaultAvatar from "../../assets/adham.png";

/* Suggested prompts shown in the input bar */
const suggestions = [
  "My car won't start, just a clicking sound",
  "There's white smoke from the exhaust",
  "I need a car wash nearby",
  "Brakes are squeaking — what could it be?",
];

export default function ChatPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hey! Thanks for reaching out, I'm glad to help! Describe your car problem and I'll do my best to diagnose it." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { from: "user", text: userMessage }]);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          question: userMessage,
          session_id: user?.id?.toString() || "guest"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { from: "bot", text: data.answer }]);
      } else {
        setMessages(prev => [...prev, { from: "bot", text: data.error || "Sorry, I couldn't process that. Please try again." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { from: "bot", text: "Could not connect to the chat server. Make sure both servers are running." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleSuggestion = (text) => {
    if (loading) return;
    setInput(text);
  };

  return (
    <div className="flex h-[100dvh] flex-col bg-gray-50">
      {/* ===================== Sticky top bar ===================== */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3 sm:px-5 lg:max-w-3xl">
          <button
            onClick={() => navigate("/explore")}
            aria-label="Back"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00BFA5] to-[#00897B] text-white shadow-sm sm:h-11 sm:w-11">
            <Bot size={20} />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-extrabold text-gray-900">CarCareX Assistant</p>
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-2 w-2 rounded-full bg-green-500" /> Online · AI diagnosis
            </p>
          </div>

          <span className="hidden items-center gap-1.5 rounded-full bg-[#00BFA5]/10 px-3 py-1 text-xs font-semibold text-[#00897B] sm:flex">
            <Sparkles size={13} /> Beta
          </span>
        </div>
      </header>

      {/* ===================== Scrollable messages ===================== */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-6 sm:px-5 lg:max-w-3xl">
          {messages.map((msg, i) => (
            <MessageBubble key={i} from={msg.from} text={msg.text} userImage={user?.image} />
          ))}

          {loading && (
            <div className="flex items-start gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00BFA5] to-[#00897B] text-white">
                <Bot size={16} />
              </span>
              <div className="min-w-0 max-w-[78%] rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2.5 text-sm leading-relaxed text-gray-500 italic">
                Thinking...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* ===================== Sticky bottom input ===================== */}
      <div className="sticky bottom-0 border-t border-gray-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto w-full max-w-2xl px-4 py-3 sm:px-5 lg:max-w-3xl">
          {/* Suggestion chips */}
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-x-visible sm:pb-0">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSuggestion(s)}
                disabled={loading}
                className="shrink-0 rounded-full border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-[#00BFA5]/40 hover:bg-[#00BFA5]/5 hover:text-[#00897B] disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
          >
            <input
              type="text"
              placeholder="Describe your car's problem…"
              className="min-w-0 flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm outline-none transition focus:border-[#00BFA5] focus:ring-2 focus:ring-[#00BFA5]/20 sm:py-3 disabled:opacity-50"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              type="submit"
              aria-label="Send"
              disabled={loading}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00BFA5] to-[#00897B] text-white shadow-sm transition hover:brightness-105 disabled:opacity-50 sm:h-12 sm:w-12"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ----------------------- Single message bubble ----------------------- */
function MessageBubble({ from, text, userImage }) {
  const isBot = from === "bot";

  if (isBot) {
    return (
      <div className="flex items-start gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00BFA5] to-[#00897B] text-white">
          <Bot size={16} />
        </span>
        <div className="min-w-0 max-w-[78%] break-words rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-2.5 text-sm leading-relaxed text-gray-800">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-end gap-2.5">
      <div className="min-w-0 max-w-[78%] break-words rounded-2xl rounded-tr-sm bg-gradient-to-br from-[#00BFA5] to-[#00897B] px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm">
        {text}
      </div>
      <img
        src={userImage || defaultAvatar}
        alt=""
        className="h-8 w-8 shrink-0 rounded-full object-cover"
      />
    </div>
  );
}
