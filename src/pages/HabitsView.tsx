import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Flame, Award, Trash2, CheckCircle2, Zap, Brain, Code, BookOpen, Dumbbell, Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Habit } from '../types';

export const HabitsView: React.FC = () => {
  const { habits, addHabit, toggleHabit, deleteHabit, showToast, user } = useApp();

  const [name, setName] = useState('');
  const [color, setColor] = useState('#2563EB');
  const [iconName, setIconName] = useState('Code');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const colors = [
    { value: '#2563EB', label: 'Blue' },
    { value: '#10B981', label: 'Emerald' },
    { value: '#F59E0B', label: 'Amber' },
    { value: '#8B5CF6', label: 'Purple' },
    { value: '#EF4444', label: 'Red' }
  ];

  const icons = [
    { name: 'Code', label: '💻 Coding' },
    { name: 'BookOpen', label: '📖 Reading' },
    { name: 'Dumbbell', label: '💪 Workout' },
    { name: 'Brain', label: '🧘 Meditation' }
  ];

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addHabit({
      name: name.trim(),
      frequency: 'daily',
      icon: iconName,
      color: color
    });

    setName('');
    setIsFormOpen(false);
  };

  // Generate date strings for last 21 days for heatmap simulation
  const getLastNDays = (n: number) => {
    const dates = [];
    const today = new Date('2026-06-24');
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const heatmapDays = getLastNDays(21);

  return (
    <div className="space-y-6 text-left select-none pb-12 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Habit Streaks Tracker</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Build compound consistency. Checking off habits daily advances your productivity rating.</p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-500/15 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Habit</span>
        </button>
      </div>

      {/* Add Habit Form block */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 p-5 rounded-2xl shadow-md max-w-lg"
        >
          <form onSubmit={handleCreateHabit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Habit Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 10 Minutes Hydration Break"
                required
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Icon pairing</label>
                <select
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-600 border border-slate-200 bg-white rounded-xl cursor-pointer"
                >
                  {icons.map((ic) => (
                    <option key={ic.name} value={ic.name}>{ic.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Accent Color</label>
                <div className="flex gap-2 pt-1.5">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setColor(c.value)}
                      className={`w-5.5 h-5.5 rounded-full border cursor-pointer transition-transform ${
                        color === c.value ? 'scale-120 ring-2 ring-slate-400 ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-50 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Create Habit
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Main Grid: Habits list & heatmaps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Span: Active habits deck */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left">
            <h3 className="text-sm font-bold text-slate-800 mb-1">🔥 Active Habits</h3>
            <p className="text-[10px] text-slate-400 font-semibold mb-4">Click check button to log completion for today (June 24, 2026).</p>

            <div className="space-y-3">
              {habits.map((habit) => {
                const todayStr = '2026-06-24';
                const isCompletedToday = !!habit.history[todayStr];

                return (
                  <div 
                    key={habit.id}
                    className="p-4 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 rounded-xl flex items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                        style={{ backgroundColor: habit.color }}
                      >
                        {habit.icon === 'Code' && <Code className="w-5 h-5" />}
                        {habit.icon === 'BookOpen' && <BookOpen className="w-5 h-5" />}
                        {habit.icon === 'Dumbbell' && <Dumbbell className="w-5 h-5" />}
                        {habit.icon === 'Brain' && <Brain className="w-5 h-5" />}
                      </div>

                      <div>
                        <h4 className="text-xs font-extrabold text-slate-800">{habit.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                            <Flame className="w-3.5 h-3.5 fill-current" />
                            {habit.streak}d streak
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold">Max streak: {habit.maxStreak}d</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleHabit(habit.id, todayStr)}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-xl border transition-all cursor-pointer ${
                          isCompletedToday 
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {isCompletedToday ? 'Completed Today' : 'Mark Completed'}
                      </button>

                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
                        title="Delete Habit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Span: Contribution heatmap */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left">
            <h3 className="text-sm font-bold text-slate-800 mb-1">📊 Consistency Map (Past 21 Days)</h3>
            <p className="text-[10px] text-slate-400 font-semibold mb-5">Each row is a habit. Colored blocks represent completed days.</p>

            <div className="space-y-5">
              {habits.map((habit) => (
                <div key={habit.id} className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 block truncate">{habit.name}</span>
                  
                  {/* Grid cells */}
                  <div className="flex flex-wrap gap-1.5">
                    {heatmapDays.map((day) => {
                      const completed = !!habit.history[day];
                      return (
                        <div
                          key={day}
                          className="w-4.5 h-4.5 rounded-xs transition-colors shrink-0"
                          style={{ 
                            backgroundColor: completed ? habit.color : '#F1F5F9' 
                          }}
                          title={`${day}: ${completed ? 'Completed' : 'Skipped'}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Heatmap legend */}
            <div className="flex items-center gap-3 border-t border-slate-50 pt-4 mt-5 text-[10px] text-slate-400 font-semibold">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-slate-100 rounded-xs" />
                <span>Uncompleted</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-600 rounded-xs" />
                <span>Completed</span>
              </div>
            </div>
          </div>

          {/* Smart habit suggestions card */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -z-10" />
            
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4.5 h-4.5 text-amber-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">Consistency Coaching</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed text-left">
              🔬 Studies show that executing a habit consistently for **18 days** locks in neurological pathways. Try stacking your habits: Complete meditative breathing immediately before opening your Code block to improve focus speed by 35%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
