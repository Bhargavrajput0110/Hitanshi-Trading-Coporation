import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Sparkles, RefreshCw, AlertCircle, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const DEFAULT_CHIPS = [
  'What standards do your pipes conform to?',
  'What is SDR and high-pressure ratings?',
  'Do you supply goods outside Maharashtra?',
  'How to submit a bulk RFQ quote?'
];

// Elegant regex parser for rendering markdown bold text and bullets nicely
function TextFormatter({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 font-sans leading-relaxed text-xs md:text-sm">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        // Check if line is a bullet item
        const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ');
        if (isBullet) {
          trimmed = trimmed.replace(/^[\*\-\•]\s+/, '');
        }

        // Inline formatting for **bold** text
        const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
        const content = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx} className="font-bold text-[#8b7355]">{part.slice(2, -2)}</strong>;
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex gap-1.5 pl-2 items-start mt-0.5">
              <span className="text-[#8b7355] text-xs mt-1 select-none">•</span>
              <p className="flex-1 text-white/90">{content}</p>
            </div>
          );
        }

        return trimmed === '' ? (
          <div key={idx} className="h-1.5" />
        ) : (
          <p key={idx} className="text-white/85">{content}</p>
        );
      })}
    </div>
  );
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hello! I am **Hita**, your interactive AI Procurement & High-Performance Pipeline Assistant.\n\nWhether you are verifying IS standards compliance patterns, requesting specific SDR ratios, checking logistics to neighbouring states, or drafting bulk product estimations, feel free to ask!"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of discussion
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorStatus(null);
    const userMessage = textToSend.trim();
    setInputValue('');
    
    // Optimistic addition
    const updatedMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        { role: 'model', content: data.text || "I apologize, I didn't catch that. Could you please rephrase?" }
      ]);
    } catch (err: any) {
      console.error("AI Assistant Error:", err);
      // Give fallback message if server-side key setup is missing or offline
      setErrorStatus(err.message || "Connection timed out. Check if server configuration is online.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'model',
        content: "Draft reset. Let me know what HDPE/PVC specifications or municipal logistics schedules I can check for you!"
      }
    ]);
    setErrorStatus(null);
  };

  return (
    <div className={`fixed z-40 font-sans ${isOpen ? 'bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6' : 'bottom-4 left-4 sm:bottom-6 sm:left-6'}`}>
      <AnimatePresence>
        {/* Toggle Button for Chat Widget */}
        {!isOpen && (
          <motion.button
            id="hita-chatbot-trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-[#121214] border border-[#8b7355]/40 text-white rounded-full p-3.5 sm:p-4 shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 relative group"
            title="Open Hita AI Assistant"
          >
            {/* Pulsing indicator light */}
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#8b7355] border-2 border-[#121214] animate-pulse" />
            <Sparkles className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-[#8b7355] group-hover:text-white transition-colors duration-200" />
            <span className="hidden sm:inline-block absolute left-16 bg-black/90 text-white text-[10px] sm:text-xs uppercase font-mono tracking-wider px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/5">
              Hita AI Assistant
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* Chat window panel */}
        {isOpen && (
          <motion.div
            id="hita-chatbot-panel"
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full sm:w-[380px] h-[450px] sm:h-[540px] bg-[#0c0c0e] border border-[#8b7355]/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header section with brand accent */}
            <div className="bg-[#121214] border-b border-[#8b7355]/25 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#8b7355]/15 flex items-center justify-center border border-[#8b7355]/40 text-secondary">
                  <Sparkles className="w-4 h-4 text-[#8b7355]" />
                </div>
                <div>
                  <h5 className="font-serif italic font-medium text-xs sm:text-sm text-[#8b7355] flex items-center gap-1.5 leading-none">
                    Hita AI Assistant
                  </h5>
                  <span className="text-[9px] text-white/50 uppercase tracking-widest font-mono">
                    Procurement Desk
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="p-1.5 hover:bg-white/5 text-white/40 hover:text-white transition-all rounded"
                  title="Reset Conversation"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/5 text-white/40 hover:text-white transition-all rounded"
                  title="Minimize"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Body */}
            <div 
              ref={chatScrollContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin select-text bg-[#08080a]"
              style={{ maxHeight: 'calc(100% - 110px)' }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-3 text-white ${
                      msg.role === 'user'
                        ? 'bg-[#8b7355]/20 border border-[#8b7355]/35 rounded-tr-none text-right'
                        : 'bg-white/[0.03] border border-white/5 rounded-tl-none'
                    }`}
                  >
                    <TextFormatter text={msg.content} />
                    <span className="block text-[8px] text-white/30 font-mono mt-1 text-right">
                      {msg.role === 'user' ? 'Client' : 'Hita Assistant'}
                    </span>
                  </div>
                </div>
              ))}

              {/* Loader */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#8b7355] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#8b7355] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#8b7355] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {/* Error indicator */}
              {errorStatus && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-200 text-[11px] flex gap-2 items-start leading-snug">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">AI Assistant Offline</p>
                    <p className="text-white/60 mt-0.5">Ready to reply. Register your <code>GEMINI_API_KEY</code> context in secrets to initialize live reasoning.</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            {messages.length === 1 && (
              <div className="px-4 pb-3 bg-[#08080a] flex flex-wrap gap-1.5 justify-start">
                {DEFAULT_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="text-[10px] bg-[#121214] border border-white/5 text-white/70 hover:border-[#8b7355]/40 hover:text-white px-2.5 py-1.5 rounded-lg text-left transition-colors duration-200 cursor-pointer max-w-full"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Message Input Controls Form */}
            <form onSubmit={handleFormSubmit} className="p-3 bg-[#121214] border-t border-[#8b7355]/20 flex gap-2 items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about ISO standards, SDRs..."
                className="flex-1 bg-[#0c0c0e] border border-white/10 rounded-lg py-2 px-3 text-xs md:text-sm text-white focus:outline-none focus:border-[#8b7355] placeholder-white/35"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-[#8b7355] hover:bg-[#a18868] text-white p-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
