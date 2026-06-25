import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Send, Trash2, HelpCircle, Brain, Target, MessageSquare, Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateCoachResponse } from '../utils/aiEngine';

export const CoachChatView: React.FC = () => {
  const { messages, addMessage, clearMessages, tasks } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    addMessage(textToSend, 'user');
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking and replying
    setTimeout(() => {
      const responseText = generateCoachResponse(textToSend, tasks);
      addMessage(responseText, 'coach');
      setIsTyping(false);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const suggestedPrompts = [
    { text: 'I am feeling overwhelmed', label: 'Overwhelmed' },
    { text: 'Analyze my overdue items', label: 'Overdue check' },
    { text: 'Give me a quote of motivation', label: 'Get Motivation' },
    { text: 'How do I generate a schedule?', label: 'Generate Schedule' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] text-left select-none pb-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header row */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4 shrink-0">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span>AI Productivity Coach</span>
          </h2>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Active Workspace Counselor</p>
        </div>

        <button
          onClick={clearMessages}
          className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Reset Conversation</span>
        </button>
      </div>

      {/* Messages Scroll Panel */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4">
        {messages.map((msg) => {
          const isCoach = msg.sender === 'coach';
          return (
            <div 
              key={msg.id}
              className={`flex items-start gap-3 ${isCoach ? 'justify-start' : 'justify-end'}`}
            >
              {isCoach && (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Sparkles className="w-4 h-4 fill-current animate-pulse" />
                </div>
              )}
              
              <div className="space-y-1 max-w-[75%] text-left">
                <div className={`p-4 rounded-2xl text-xs font-semibold leading-relaxed ${
                  isCoach 
                    ? 'bg-white border border-slate-100 text-slate-700 shadow-xs' 
                    : 'bg-slate-900 text-white shadow-md'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 font-bold block px-2">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-3 justify-start animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-100 text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0">
              <span>Coaching Companion is thinking</span>
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested prompts row */}
      <div className="flex gap-2 overflow-x-auto py-1 shrink-0 scrollbar-none mb-3">
        {suggestedPrompts.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(p.text)}
            className="px-3.5 py-1.5 border border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40 text-[10px] font-bold text-slate-500 hover:text-blue-600 rounded-full whitespace-nowrap cursor-pointer transition-all shrink-0"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Form Submission */}
      <form onSubmit={handleSubmit} className="flex gap-2.5 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything: 'I feel lazy', 'Show me deadlines'..."
          required
          className="flex-1 px-4.5 py-3 text-xs border border-slate-200 bg-white rounded-xl focus:border-blue-500 shadow-xs font-semibold"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
