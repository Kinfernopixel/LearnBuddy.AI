import { useState } from "react";

// Helper to generate unique IDs (works in modern browsers)
const makeId = () => crypto.randomUUID?.() || Math.random().toString(36).slice(2);

export default function ChatUI() {
  // Each chat: { id, name, messages: [{role, text}] }
  const [chats, setChats] = useState([
    {
      id: makeId(),
      name: "New Chat",
      messages: []
    }
  ]);
  const [activeChatId, setActiveChatId] = useState(chats[0].id);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const activeChat = chats.find((c) => c.id === activeChatId);

  // Add a new chat session
  function addNewChat() {
    const newId = makeId();
    setChats([...chats, { id: newId, name: "New Chat", messages: [] }]);
    setActiveChatId(newId);
  }

  // Send a prompt to backend
  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);

    // Add user message to chat
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
        body: JSON.stringify({ topic: input.trim() }),
      });
      const data = await res.json();
      // Add AI response to chat
      const aiMsg = { role: "assistant", text: data.learning_path || "No response." };
      setChats(cs =>
        cs.map(chat =>
          chat.id === activeChatId
            ? { ...chat, messages: [...chat.messages, aiMsg] }
            : chat
        )
      );
    } catch (err) {
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

  // Rename active chat on first AI response
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
  // UseEffect replacement
  if (activeChat && activeChat.name === "New Chat" && activeChat.messages.length > 1) {
    updateChatNameIfNeeded();
  }

  return (
    <div className="flex h-[90vh] w-full max-w-4xl mx-auto shadow-lg rounded-xl overflow-hidden bg-white/80">
      {/* Sidebar */}
      <aside className="w-48 bg-blue-100/80 p-4 flex flex-col gap-2 border-r border-blue-200">
        <button
          className="w-full py-2 mb-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
          onClick={addNewChat}
        >
          + New Chat
        </button>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`p-2 mb-1 rounded cursor-pointer ${chat.id === activeChatId ? "bg-blue-300 font-bold" : "hover:bg-blue-200"
                }`}
              title={chat.name}
            >
              {chat.name}
            </div>
          ))}
        </div>
      </aside>
      {/* Chat area */}
      <main className="flex-1 flex flex-col h-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 p-6">
        <div className="flex-1 overflow-y-auto mb-4">
          {activeChat.messages.length === 0 && (
            <div className="text-center text-blue-400 mt-16">
              Start by typing a topic or question below!
            </div>
          )}
          {activeChat.messages.map((msg, idx) => (
            <div key={idx} className={`my-2 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-lg shadow ${msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-blue-200 text-blue-900"
                  } max-w-[70%] whitespace-pre-line`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        {/* Input */}
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 rounded border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Ask a new topic or question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </main>
    </div>
  );
}
