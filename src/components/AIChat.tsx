import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, AlertCircle, Globe, Database } from 'lucide-react';
import { filterXSS } from 'xss';

type MessageType = 'table' | 'text';
// ... (rest of imports and types)

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  type?: MessageType;
  data?: any[];
  isError?: boolean;
};

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I am the Intelligent Data Layer for this portfolio. I can answer questions about ALVI SYAHRIL's skills, projects, and experience — or search the internet for broader topics!\n\nTry: \"Show me all projects\" or \"What is the latest version of React?\"",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg.text }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Failed to fetch data');

      if (json.type === 'table') {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          type: 'table',
          text: `Executed SQL: ${json.sql_used}`,
          data: json.data,
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          sender: 'ai',
          type: 'text',
          text: json.answer,
        }]);
      }

    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        text: 'Error: ' + error.message,
        isError: true,
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel overflow-hidden border-[#32CD32]/30"
    >
      {/* Header */}
      <div className="bg-black p-4 border-b border-[#32CD32]/20 flex items-center space-x-3">
        <Bot className="text-[#32CD32]" />
        <div>
          <h2 className="text-xl font-bold text-[#32CD32]">Intelligent Data Layer</h2>
          <p className="text-xs text-[#32CD32]/60">Portfolio DB + General AI</p>
        </div>
      </div>

      {/* Messages */}
      <div className="p-6 h-[420px] overflow-y-auto space-y-6 flex flex-col">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {/* AI Avatar */}
            {msg.sender === 'ai' && (
              <div className={`p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0 ${msg.isError ? 'bg-red-500/20' : 'bg-electric-blue/20'}`}>
                {msg.isError
                  ? <AlertCircle className="text-red-500" size={20} />
                  : <Bot className="text-electric-blue" size={20} />}
              </div>
            )}

            {/* Bubble */}
            <div className={`max-w-[82%] rounded-2xl p-4 space-y-3 ${msg.sender === 'user'
              ? 'bg-emerald-accent/20 text-emerald-100 rounded-tr-none'
              : 'bg-dark-bg border border-gray-700 rounded-tl-none'}`}
            >
              {/* Source badge */}
              {msg.sender === 'ai' && !msg.isError && msg.id !== 'welcome' && msg.type && (
                <div className="flex items-center gap-1.5">
                  {msg.type === 'table'
                    ? <><Database size={11} className="text-amber-400" /><span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider">portfolio db</span></>
                    : <><Globe size={11} className="text-sky-400" /><span className="text-[10px] text-sky-400 font-mono uppercase tracking-wider">web search</span></>
                  }
                </div>
              )}

              {/* Text content */}
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {msg.sender === 'ai' ? filterXSS(msg.text) : msg.text}
              </p>

              {/* SQL Table Results */}
              {msg.type === 'table' && msg.data && Array.isArray(msg.data) && msg.data.length > 0 && (
                <div className="mt-3 overflow-x-auto rounded-lg border border-gray-800">
                  <table className="w-full text-left text-sm text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                      <tr>
                        {Object.keys(msg.data[0]).map(key => (
                          <th key={key} className="px-4 py-2">{key.replace(/_/g, ' ')}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {msg.data.map((row, i) => (
                        <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                          {Object.values(row).map((val: any, j) => (
                            <td key={j} className="px-4 py-2 text-gray-300">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* User avatar */}
            {msg.sender === 'user' && (
              <div className="bg-emerald-accent/20 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                <User className="text-emerald-500" size={20} />
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start gap-4"
            >
              <div className="bg-electric-blue/20 p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0">
                <Bot className="text-electric-blue" size={20} />
              </div>
              <div className="bg-dark-bg border border-gray-700 rounded-2xl p-4 rounded-tl-none flex items-center space-x-2">
                <div className="w-2 h-2 bg-electric-blue rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-electric-blue rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-electric-blue rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-dark-bg border-t border-[#32CD32]/30">
        {/* Example prompts */}
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            "Show me all skills",
            "What projects use React?",
            "What is TypeScript?",
            "Latest backend trends?"
          ].map(chip => (
            <button
              key={chip}
              onClick={() => setInput(chip)}
              className="text-xs px-3 py-1.5 rounded-full border border-[#32CD32]/20 text-[#32CD32]/70 hover:bg-[#32CD32]/10 hover:border-[#32CD32]/40 transition-all"
            >
              {chip}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about my skills, projects, or anything else..."
            className="flex-grow bg-transparent border border-[#32CD32]/30 rounded-lg px-4 py-3 focus:outline-none focus:border-[#32CD32] transition-colors text-sm"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-3 bg-[#32CD32] text-black rounded-xl hover:bg-[#a9ff1c] disabled:opacity-50 shadow-[0_0_10px_rgba(50,205,50,0.3)] transition-all"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </motion.section>
  );
}
