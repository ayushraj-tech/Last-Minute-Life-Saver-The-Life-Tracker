import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, CheckSquare, Clock, Flame, Award, ChevronRight, Play, ArrowUpRight, Check, Plus, AlertCircle, FileText, Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { generateAiMetrics } from '../utils/aiEngine';

export const DashboardView: React.FC = () => {
  const { 
    tasks, habits, user, addTask, updateTask, setCurrentView, addMessage, setIsSearchOpen
  } = useApp();

  const firstName = user?.name ? user.name.split(' ')[0] : 'User';

  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState('Work');

  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const completionRate = Math.round((completedTasks.length / (tasks.length || 1)) * 100);

  // Highest AI prioritized items
  const highPriorityItems = [...activeTasks]
    .sort((a, b) => b.aiPriorityScore - a.aiPriorityScore)
    .slice(0, 3);

  // Focus hours mock data for recharts
  const weeklyFocusData = [
    { name: 'Mon', hours: 2.5, completed: 2 },
    { name: 'Tue', hours: 4.8, completed: 5 },
    { name: 'Wed', hours: 3.2, completed: 3 },
    { name: 'Thu', hours: 4.0, completed: 4 },
    { name: 'Fri', hours: 1.5, completed: 1 },
    { name: 'Sat', hours: 0.5, completed: 0 },
    { name: 'Sun', hours: 1.2, completed: 1 },
  ];

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    
    addTask({
      title: quickTitle,
      description: 'Quick task added from Dashboard Feed.',
      deadline: '2026-06-25', // default tomorrow
      priority: 'medium',
      estimatedTime: 1,
      category: quickCategory,
      subtasks: [],
      tags: ['Quick-Add'],
      status: 'todo',
      notes: '',
      recurring: false,
      recurringInterval: 'none'
    });
    setQuickTitle('');
  };

  return (
    <div className="space-y-6 text-left select-none pb-12 animate-fade-in">
      {/* Dynamic Welcome Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back, {user.name.split(' ')[0]}</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Let's defeat procrastination. You have {activeTasks.length} pending obligations today.</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentView('focus')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Go Focus Mode</span>
          </button>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="px-4 py-2 border border-slate-200 bg-white text-slate-600 text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span>Omni Search</span>
            <kbd className="text-[9px] font-mono px-1.5 py-0.5 border border-slate-200 bg-slate-50 rounded-md">⌘K</kbd>
          </button>
        </div>
      </div>

      {/* Main Grid: Floating Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Span: Analytics and Prioritized Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs hover:shadow-md transition-all">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Completion Rate</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-800">{completionRate}%</span>
                <span className="text-[10px] font-bold text-emerald-500">+{tasks.length > 0 ? completedTasks.length : 0} items</span>
              </div>
              <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${completionRate}%` }} />
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs hover:shadow-md transition-all">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Focus Time</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-800">4.2h</span>
                <span className="text-[10px] font-bold text-blue-500">Today</span>
              </div>
              <p className="text-[9px] text-slate-400 font-bold mt-1.5">Weekly total: 17.5 hours</p>
            </div>

            <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs hover:shadow-md transition-all">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Habit Streak</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-orange-500">{user.dailyStreak} Days</span>
                <Flame className="w-4 h-4 text-orange-500 fill-current" />
              </div>
              <p className="text-[9px] text-slate-400 font-bold mt-1.5">High consistency rating</p>
            </div>

            <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs hover:shadow-md transition-all">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Level Progress</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-purple-600">Lvl {user.level}</span>
                <span className="text-[10px] font-bold text-purple-400">Hero</span>
              </div>
              <p className="text-[9px] text-slate-400 font-bold mt-1.5">{user.xpToNextLevel - user.xp} XP to Level {user.level + 1}</p>
            </div>
          </div>

          {/* Recharts Focus Trends */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Productivity Index & Focus Distribution</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Focus hours completed daily relative to tasks checked off.</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                Weekly Stats
              </span>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyFocusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#0F172A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHours)" name="Focus Hours" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Highest Priority Obligation Deck */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">⚡ AI Prioritized Task Deck</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Items needing attention, ranked dynamically by our AI Priority Engine.</p>
              </div>
              <button 
                onClick={() => setCurrentView('tasks')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Manage all</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {highPriorityItems.length > 0 ? (
              <div className="space-y-2.5">
                {highPriorityItems.map((task) => (
                  <div 
                    key={task.id}
                    className="border border-slate-100 p-3.5 rounded-xl bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => updateTask(task.id, { status: 'completed' })}
                        className="mt-0.5 w-5 h-5 rounded-full border border-slate-300 hover:border-blue-500 hover:bg-blue-50 flex items-center justify-center cursor-pointer transition-all shrink-0"
                      >
                        <Check className="w-3 h-3 text-transparent hover:text-blue-600" />
                      </button>
                      <div>
                        <span className="inline-flex items-center gap-1 bg-white border border-slate-200 text-slate-600 font-bold text-[9px] px-2 py-0.5 rounded-full mb-1">
                          {task.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800">{task.title}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Due: {task.deadline}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="block text-xs font-black text-slate-700">{task.aiPriorityScore}%</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-red-500">{task.aiUrgency} RISK</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                <p className="text-xs font-semibold text-slate-400">All high priority tasks completed!</p>
                <p className="text-[10px] text-slate-400 mt-1">Select "Tasks" to create or backlog other goals.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Span: AI Coach Insights & Quick Add */}
        <div className="space-y-6">
          {/* Smart AI Coach Suggestions Panel */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10" />
            
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">Smart Insights</h3>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300">
              <p className="leading-relaxed">
                🤖 "Hey, {firstName}. I ran our weekly analysis. Tuesday remains your highest productive bracket, clocking **4.8 focus hours** on average."
              </p>
              <div className="p-3 bg-slate-800/60 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>OVERDUE ACTION NEEDED</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Your monthly invoice review was due on June 23rd. Procrastination risk rating is **Extreme**. Completing this now returns 60 XP and safeguards your streak!
                </p>
              </div>
              <button 
                onClick={() => setCurrentView('coach')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Open Assistant Coach</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick-Add task box */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Quick Add Task</h3>
            <p className="text-[10px] text-slate-400 font-semibold mb-4">Add simple notes to your focus pipeline instantly.</p>

            <form onSubmit={handleQuickAdd} className="space-y-3">
              <div>
                <input
                  type="text"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="e.g. Draft landing page specs"
                  required
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-100"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={quickCategory}
                  onChange={(e) => setQuickCategory(e.target.value)}
                  className="px-2 py-1.5 text-[11px] font-bold text-slate-600 border border-slate-200 bg-white rounded-xl focus:border-blue-500 cursor-pointer"
                >
                  <option value="Work">Work</option>
                  <option value="Study">Study</option>
                  <option value="Personal">Personal</option>
                  <option value="Finance">Finance</option>
                  <option value="Health">Health</option>
                </select>

                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert Task</span>
                </button>
              </div>
            </form>
          </div>

          {/* Miniature Habit Checker Tracker widget */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">Habit Streaks</h3>
              <button 
                onClick={() => setCurrentView('habits')}
                className="text-[10px] font-bold text-blue-600 cursor-pointer"
              >
                Check off
              </button>
            </div>
            
            <div className="space-y-2">
              {habits.slice(0, 3).map((h) => (
                <div key={h.id} className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: h.color }}
                    />
                    <span className="text-slate-600 text-[11px]">{h.name}</span>
                  </div>
                  <span className="text-[10px] text-amber-500 font-bold">{h.streak}d streak</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
