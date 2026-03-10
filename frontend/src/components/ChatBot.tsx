"use client";

import { useState } from "react";
import api from "../api/client";
import chatbot from "../assets/chatbot.svg";
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
interface ExamplePromptProps {
  text: string;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
}
export default function AITutorPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const askTutor = async () => {
    if (!question.trim()) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: question },
    ];
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    try {
      const res = await api.post("/AI/ai/tutor", {
        question,
      });

      setMessages([
        ...messages,
        { role: "assistant", content: res.data.answer },
      ]);
    } catch (error) {
      setMessages([
        ...messages,
        { role: "assistant", content: "AI tutor is temporarily unavailable." },
      ]);
      console.log(error);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen  flex flex-col  w-full pb-10 ">
      {/* Header */}
      <div className="   p-9 ">
        <div className="  flex items-center gap-3">
          <img src={chatbot} className=" size-10" />
          <h1 className="text-3xl font-bold  text-avocado-smoothie">Chat</h1>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center mt-16 space-y-6">
            <p className="text-gray-500">
              Grammar • Vocabulary • Kanji • Sentence explanations
            </p>

            <div className="grid md:grid-cols-2 gap-4  cursor-pointer max-w-xl mx-auto mt-8">
              <ExamplePrompt
                text="Explain grammar 〜てしまう"
                setQuestion={setQuestion}
              />

              <ExamplePrompt
                text="What does 挑戦 mean?"
                setQuestion={setQuestion}
              />

              <ExamplePrompt
                text="Explain this sentence: 昨日友達と映画を見に行きました"
                setQuestion={setQuestion}
              />

              <ExamplePrompt
                text="Explain kanji 食"
                setQuestion={setQuestion}
              />
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`  px-5 py-3 rounded-full text-sm font-serif whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-avocado-smoothie text-white "
                  : " leading-relaxed"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow border px-5 py-3 rounded-2xl text-sm animate-pulse">
              AI is thinking...
            </div>
          </div>
        )}
      </div>

      <div className="">
        <div className="w-[100vh] mx-auto p-4 flex gap-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your Japanese tutor..."
            className="flex-1  rounded-full bg-white px-4 py-5 outline-none focus:ring-2 focus:ring-avocado-smoothie"
          />

          <button
            onClick={askTutor}
            className="bg-avocado-smoothie/80 font-semibold hover:bg-avocado-smoothie text-white px-9 py-5 cursor-pointer rounded-full transition"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}

function ExamplePrompt({ text, setQuestion }: ExamplePromptProps) {
  return (
    <button
      onClick={() => setQuestion(text)}
      className="p-5 text-center font-medium text-sm cursor-pointer  rounded-full bg-avocado-smoothie/20 hover:scale-[0.9] transition"
    >
      {text}
    </button>
  );
}
