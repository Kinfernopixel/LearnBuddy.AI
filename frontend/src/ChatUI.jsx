import { useState } from "react";
import logo from "./assets/learnbuddy.png";

function Bulletify({ text }) {
  // Split by numbered list (matches "1." at line start), fallback to newline if no matches
  const items = text.match(/(\d+\.\s[\s\S]+?)(?=\d+\.\s|$)/g) || text.split('\n');
  // Fallback: if just one item, don't bullet
  if (!items || items.length < 2) return <span>{text}</span>;
  return (
    <ul className="list-disc list-inside">
      {items.map((item, i) => (
        <li key={i} className="mb-1">{item.replace(/^\d+\.\s*/, '')}</li>
      ))}
    </ul>
  );
}
const makeId = () => crypto.randomUUID?.() || Math.random().toString(36).slice(2);

export default function ChatUI() {
  const [chats, setChats] = useState([
    { id: makeId(), name: "New Chat", messages: [] }
  ]);
  const [activeChatId, setActiveChatId] = useState(chats[0].id);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const activeChat = chats.find((c) => c.id === activeChatId);

  function addNewChat() {
    const newId = makeId();
    setChats([...chats, { id: newId, name: "New Chat", messages: [] }]);
    setActiveChatId(newId);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);

    // Add user message
    const userMsg = { role: "user", text: input.trim() };
    const updatedChats = chats.map(chat =>
      chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, userMsg] }
        : chat
    );
    setChats(updatedChats);
    setInput("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: userMsg.text }),
      });
      const data = await res.json();
      const aiMsg = { role: "assistant", text: data.learning_path || "No response." };
      setChats(cs =>
        cs.map(chat =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, aiMsg] }
            : chat
        )
      );
    } catch {
      setChats(cs =>
        cs.map(chat =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, { role: "assistant", text: "Error from AI." }] }
            : chat
        )
      );
    }
    setLoading(false);
  }

  function updateChatNameIfNeeded() {
    if (activeChat && activeChat.name === "New Chat" && activeChat.messages.length > 1) {
      const firstUserMsg = activeChat.messages[0]?.text || "Chat";
      setChats(cs =>
        cs.map(chat =>
          chat.id === activeChatId
            ? { ...chat, name: firstUserMsg.slice(0, 24) }
            : chat
        )
      );
    }
  }
  if (activeChat && activeChat.name === "New Chat" && activeChat.messages.length > 1) {
    updateChatNameIfNeeded();
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      {/* Sidebar */}
      <aside className="w-60 border-r border-blue-200 flex flex-col items-center py-8 px-4 bg-white/80">
        <div className="flex flex-col items-center gap-2 mb-6">
          <img
            src={logo}
            alt="LearningTutor.AI logo"
            className="w-16 h-16 mb-2 drop-shadow-lg rounded-xl border-2 border-blue-700 bg-white object-contain"
            style={{
              maxWidth: "100%",
              maxHeight: "64px",
              width: "auto",
              height: "auto",
              aspectRatio: "1 / 1"
            }}
          />
          <span className="font-bold text-lg text-blue-900">LearningTutor.AI</span>
        </div>
        <button
          className="w-full mb-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={addNewChat}
        >
          + New Chat
        </button>
        <div className="flex-1 w-full overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`w-full px-2 py-2 mb-2 rounded cursor-pointer text-left truncate ${
                chat.id === activeChatId ? "bg-blue-200 font-bold" : "hover:bg-blue-100"
              }`}
              title={chat.name}
            >
              {chat.name}
            </div>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center">
        {/* Prompt in center */}
        <div className="flex flex-col items-center w-full max-w-xl px-4">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-12 text-center">
            How can I help, bud?
          </h1>

          <form
            onSubmit={handleSend}
            className="w-full flex items-center gap-2 bg-[#23262b] rounded-2xl shadow-xl px-6 py-4"
          >
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 text-lg"
              placeholder="Ask anything"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className="ml-2 rounded-full p-2 bg-blue-500 text-white hover:bg-blue-600 transition w-12 h-12 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="loader w-5 h-5 border-t-2 border-white rounded-full animate-spin"></span>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </form>

          {/* (Optional) chat display below */}
          <div className="w-full mt-8">
            {activeChat.messages.map((msg, idx) => (
                <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}
                >
                    <div
                    className={`rounded-xl px-4 py-2 max-w-[75%] ${
                        msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                    >
                    {msg.role === "assistant"
                        ? <Bulletify text={msg.text} />
                        : msg.text}
                    </div>
                </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
