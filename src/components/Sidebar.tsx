import React from 'react';
import { 
  Flame, LayoutDashboard, CheckSquare, Calendar, Target, Award, Brain, BarChart3, MessageSquare, Settings, LogOut, ArrowRight, Zap, Sparkles, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, user, logout, isSidebarCollapsed, setIsSidebarCollapsed } = useApp();

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
    { id: 'tasks', name: 'Task Manager', icon: CheckSquare, color: 'text-emerald-500' },
    { id: 'scheduler', name: 'Smart Scheduler', icon: Calendar, color: 'text-amber-500' },
    { id: 'focus', name: 'Focus Room', icon: Brain, color: 'text-violet-500' },
    { id: 'habits', name: 'Habits Check', icon: Flame, color: 'text-orange-500' },
    { id: 'goals', name: 'Goals & Progress', icon: Target, color: 'text-red-500' },
    { id: 'analytics', name: 'Analytics Hub', icon: BarChart3, color: 'text-indigo-500' },
    { id: 'coach', name: 'AI Coach Chat', icon: MessageSquare, color: 'text-teal-500' },
    { id: 'settings', name: 'Settings panel', nameDisplay: 'Settings', icon: Settings, color: 'text-slate-400' },
  ];

  const xpPercentage = Math.round((user.xp / user.xpToNextLevel) * 100);

  if (isSidebarCollapsed) {
    return (
      <aside id="sidebar-tracker-compact" className="w-16 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 shrink-0 select-none items-center py-4 justify-between transition-all duration-300">
        {/* Top brand icon + adjustment button */}
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Logo Icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-900/40 relative overflow-hidden group" title="LMLS Tracker">
            <Zap className="w-5 h-5 text-white animate-pulse" />
          </div>

          {/* Adjustment Toggle Button */}
          <button
            id="sidebar-expand-btn"
            onClick={() => setIsSidebarCollapsed(false)}
            title="Expand Tracker & Controls (Adjustment)"
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer border border-slate-700 shadow-sm"
          >
            <PanelLeftOpen className="w-4 h-4 text-blue-400" />
          </button>
          
          <div className="w-10 border-b border-slate-800 my-1" />

          {/* Compact User Progression Level display */}
          <div className="flex flex-col items-center gap-1.5" title={`${user.name} - Level ${user.level} (Streak: ${user.dailyStreak}d)`}>
            <span className="w-8 h-8 rounded-full overflow-hidden border border-blue-500/30 flex items-center justify-center bg-slate-950/40 text-[10px] font-black text-blue-400">
              L{user.level}
            </span>
            <div className="flex items-center gap-0.5 text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1 py-0.5 rounded-md">
              <Flame className="w-2.5 h-2.5 fill-current" />
              <span>{user.dailyStreak}d</span>
            </div>
          </div>
          
          <div className="w-10 border-b border-slate-800 my-1" />
        </div>

        {/* Compact navigation links */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1.5 w-full flex flex-col items-center no-scrollbar">
          {menuItems.map((item) => {
            const isActive = currentView === item.id;
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => setCurrentView(item.id)}
                title={item.nameDisplay || item.name}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer relative ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/10' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                }`}
              >
                <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.color}`} />
                {isActive && (
                  <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-3 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Compact Footer */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="w-8 h-8 rounded-full bg-slate-800/30 flex items-center justify-center text-blue-400" title="Active Coaching Online">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <button
            id="sidebar-signout-compact"
            onClick={logout}
            title="Sign Out"
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </aside>
    );
  }

  // Regular Expanded View
  return (
    <aside id="sidebar-tracker-expanded" className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen border-r border-slate-800 shrink-0 select-none transition-all duration-300">
      {/* Brand Logo & Adjustment Toggle Button */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-900/40 relative overflow-hidden group">
            <Zap className="w-5 h-5 text-white animate-pulse" />
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              LMLS
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/20 font-bold uppercase">Tracker</span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-500 tracking-wider">PREMIUM COMPANION</p>
          </div>
        </div>

        {/* Adjustment Toggle Button */}
        <button
          id="sidebar-collapse-btn"
          onClick={() => setIsSidebarCollapsed(true)}
          title="Minimize Tracker & Controls (Adjustment)"
          className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-850 hover:text-white text-slate-400 border border-slate-800/80 transition-all cursor-pointer flex items-center justify-center hover:scale-105"
        >
          <PanelLeftClose className="w-4 h-4 text-blue-400" />
        </button>
      </div>

      {/* User Progression Hub */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center text-[10px] font-black">
              L{user.level}
            </span>
            <span className="text-xs font-bold text-slate-200 truncate max-w-[100px]">{user.name}</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>{user.dailyStreak}d streak</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-500 font-bold">
            <span>XP progress</span>
            <span>{user.xp} / {user.xpToNextLevel} XP</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>

        {/* Badges ticker */}
        <div className="mt-3 flex gap-1 overflow-x-auto no-scrollbar py-0.5">
          {user.badges.slice(0, 2).map((badge) => (
            <span 
              key={badge}
              className="inline-flex items-center gap-1 text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700/50 px-2 py-0.5 rounded-full whitespace-nowrap"
            >
              <Award className="w-2.5 h-2.5 text-yellow-400 shrink-0" />
              {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              id={`sidebar-item-expanded-${item.id}`}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/10' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.color}`} />
                <span>{item.nameDisplay || item.name}</span>
              </div>
              {isActive && (
                <ArrowRight className="w-3.5 h-3.5 text-white/70" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800 flex flex-col gap-3">
        <div className="flex items-center gap-2 px-2 text-[10px] font-semibold text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Active Coaching Online</span>
        </div>
        <button
          id="sidebar-logout"
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-xl transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Sign Out</span>
        </button>
        <div className="text-[9px] text-slate-600 font-extrabold uppercase text-center tracking-wider pt-2 border-t border-slate-800/40">
          last minute life saver  the life tracker © 2026
        </div>
      </div>
    </aside>
  );
};
