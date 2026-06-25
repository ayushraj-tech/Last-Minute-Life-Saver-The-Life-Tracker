import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, CheckSquare, Settings, Flame, ShieldAlert, Sparkles, Brain, Code } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CommandPalette: React.FC = () => {
  const { 
    isSearchOpen, setIsSearchOpen, tasks, setCurrentView, updateTask, showToast
  } = useApp();
  
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Monitor Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const handleAction = (viewName: string) => {
    setCurrentView(viewName);
    setIsSearchOpen(false);
  };

  const handleToggleTask = (id: string, currentStatus: string) => {
    updateTask(id, { status: currentStatus === 'completed' ? 'todo' : 'completed' });
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/45 backdrop-blur-xs z-50 flex items-start justify-center pt-[15vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -10 }}
        className="bg-white rounded-xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, jump to pages, or complete items..."
            className="w-full bg-transparent border-none focus:outline-none text-slate-800 text-sm placeholder-slate-400 font-medium"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 border border-slate-200 bg-white rounded-md text-[10px] font-bold text-slate-400 shadow-xs">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {/* Quick Nav Options */}
          {query === '' && (
            <div className="mb-2">
              <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Navigation Commands</p>
              <div className="grid grid-cols-2 gap-1 px-1">
                <button
                  onClick={() => handleAction('dashboard')}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 text-xs font-semibold text-left transition-colors cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-orange-500" />
                  Dashboard Panel
                </button>
                <button
                  onClick={() => handleAction('tasks')}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 text-xs font-semibold text-left transition-colors cursor-pointer"
                >
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                  Task Manager
                </button>
                <button
                  onClick={() => handleAction('scheduler')}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 text-xs font-semibold text-left transition-colors cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  Smart Scheduler
                </button>
                <button
                  onClick={() => handleAction('focus')}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 text-xs font-semibold text-left transition-colors cursor-pointer"
                >
                  <Brain className="w-4 h-4 text-violet-500" />
                  Focus Room
                </button>
              </div>
            </div>
          )}

          {/* Filtered Tasks Result */}
          <div>
            <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {query ? 'Matching Tasks' : 'Recent Pinned Tasks'}
            </p>
            {filteredTasks.length > 0 ? (
              <div className="flex flex-col gap-0.5">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-slate-50/80 group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => handleToggleTask(task.id, task.status)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded-md focus:ring-blue-500 cursor-pointer"
                      />
                      <div>
                        <p className={`text-xs font-semibold text-slate-700 ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
                          {task.title}
                        </p>
                        <span className="inline-flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400">
                          <span className="font-bold text-slate-500">{task.category}</span>
                          <span>•</span>
                          <span>Due {task.deadline}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        task.aiPriorityScore > 80 
                          ? 'bg-red-50 text-red-600 border border-red-100' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        AI: {task.aiPriorityScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-3 py-4 text-xs font-medium text-slate-400 text-center">No tasks match your query.</p>
            )}
          </div>
        </div>
        
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
          <div className="flex gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>Ctrl + K to toggle</span>
        </div>
      </motion.div>
    </div>
  );
};
