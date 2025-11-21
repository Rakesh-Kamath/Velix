import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { XMarkIcon, ChatBubbleLeftRightIcon, PaperAirplaneIcon, TrashIcon } from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";

const ChatBot = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load history from local storage
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("vexi_history");
    return savedMessages 
      ? JSON.parse(savedMessages) 
      : [{ role: "bot", content: "Hi! I'm Vexi. Looking for specific shoes or sizing help?" }];
  });

  useEffect(() => {
    localStorage.setItem("vexi_history", JSON.stringify(messages));
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const clearHistory = () => {
    const initialMsg = [{ role: "bot", content: "History cleared! How can I help?" }];
    setMessages(initialMsg);
    localStorage.removeItem("vexi_history");
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    const newHistory = [...messages, { role: "user", content: userMessage }]; // Calculate new state immediately
    
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      const { data } = await axios.post("/chat", { 
        message: userMessage,
        history: newHistory // <--- SENDING HISTORY TO BACKEND
      });
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const MarkdownComponents = {
    a: ({ node, href, children, ...props }) => {
      return (
        <a
          href={href}
          onClick={(e) => {
            e.preventDefault();
            navigate(href);
          }}
          className="text-blue-600 dark:text-blue-400 underline font-bold hover:text-blue-800 cursor-pointer"
          {...props}
        >
          {children}
        </a>
      );
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 w-80 h-96 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col mb-4 overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-black text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
               <h3 className="font-bold text-sm">Vexi Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={clearHistory} title="Clear History" className="hover:text-red-400">
                <TrashIcon className="h-4 w-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:text-gray-300">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-black text-white rounded-br-none"
                      : "bg-white dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-none"
                  }`}
                >
                  <ReactMarkdown components={MarkdownComponents}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none text-xs text-gray-500 animate-pulse">
                  Vexi is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-800">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Vexi..."
              className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black hover:bg-gray-800 text-white p-4 rounded-full shadow-xl hover:scale-105 transition-transform duration-200 flex items-center justify-center"
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <ChatBubbleLeftRightIcon className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default ChatBot;