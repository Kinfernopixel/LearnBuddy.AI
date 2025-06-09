import { useState } from "react";

export default function App() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");

  // This will be replaced with a real API call later!
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700">
      <h1 className="text-4xl font-bold text-white mb-6">LearnBuddy.AI</h1>
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center w-full max-w-md">
        <input
          className="w-full p-2 mb-4 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="Enter a topic (e.g., REST APIs)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Generate Learning Path
        </button>
        {result && (
          <div className="mt-6 p-4 bg-blue-50 rounded w-full text-blue-900 text-center">
            {result}
          </div>
        )}
      </div>
    </div>
  );
}
