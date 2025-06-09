import { useState } from "react";

export default function App() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    setResult("Loading...");
    try {
      const res = await fetch("http://127.0.0.1:5000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setResult(data.learning_path);
    } catch (error) {
      setResult("Error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-800 via-blue-900 to-gray-900">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center shadow-lg">
          <span className="text-5xl">📚</span>
        </div>
        <h1 className="text-5xl font-extrabold text-white drop-shadow mb-2 text-center">
          LearnBuddy.<span className="text-blue-300">AI</span>
        </h1>
        <p className="text-lg text-blue-100 text-center max-w-xl">
          Your AI-powered learning companion. <br />
          Get a personalized study plan and quiz for <span className="font-bold text-blue-200">any topic!</span>
        </p>
      </div>

      {/* Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-lg flex flex-col items-center">
        <input
          className="w-full p-3 mb-4 rounded-xl border border-blue-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          type="text"
          placeholder="Enter a topic (e.g., REST APIs)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:scale-105 transition text-lg"
        >
          🚀 Generate Learning Path
        </button>
        {result && (
          <div className="mt-6 bg-blue-50/80 rounded-xl p-4 w-full text-blue-900 shadow-inner animate-fade-in">
            {result}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-blue-200 opacity-60 text-center">
        Built with <span className="text-blue-400 font-bold">React + Tailwind CSS</span> | © {new Date().getFullYear()} LearnBuddy.AI
      </footer>
    </div>
  );
}
