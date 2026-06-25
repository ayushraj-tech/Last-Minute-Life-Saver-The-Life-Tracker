import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Calendar, Clock, CheckCircle, ChevronRight, Play, RefreshCw, Moon, Coffee, UserCheck, Trash2, Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SmartSchedulerView: React.FC = () => {
  const { schedule, regenerateSchedule, toggleScheduleItem, addScheduleItem, deleteScheduleItem, tasks, showToast } = useApp();

  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventStart, setNewEventStart] = useState('09:00');
  const [newEventEnd, setNewEventEnd] = useState('10:00');
  const [newEventType, setNewEventType] = useState<'task' | 'routine' | 'break' | 'focus'>('task');

  const incompleteCount = schedule.filter(s => !s.completed).length;

  const handleCustomEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) {
      showToast('Please provide a title for the schedule block.', 'warning');
      return;
    }
    
    addScheduleItem({
      taskId: null,
      title: newEventTitle.trim(),
      startTime: newEventStart,
      endTime: newEventEnd,
      type: newEventType
    });
    
    setNewEventTitle('');
  };

  return (
    <div className="space-y-6 text-left select-none pb-12 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Smart Scheduler Deck</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Let our AI core map your active objectives into a step-by-step balanced daily timetable.</p>
        </div>

        <button
          onClick={regenerateSchedule}
          className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-500/15 flex items-center gap-2 cursor-pointer transition-all hover:scale-103"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Generate My Day</span>
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Span: Daily Timeline */}
        <div className="lg:col-span-2 bg-white border border-slate-100 p-5 rounded-2xl shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">Today's Timeline Roadmap</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Focus items interspersed with healthy cognitive timeouts.</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              {incompleteCount} items remaining
            </span>
          </div>

          {/* Vertical Timeline */}
          {schedule.length > 0 ? (
            <div className="relative border-l border-slate-100 ml-4 pl-6 space-y-6 pt-2">
              {schedule.map((item) => {
                const isTask = item.type === 'task';
                const isBreak = item.type === 'break';
                const isRoutine = item.type === 'routine';

                return (
                  <div key={item.id} className="relative group">
                    {/* Circle dot marker on line */}
                    <div className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full border-4 bg-white flex items-center justify-center transition-all ${
                      item.completed 
                        ? 'border-emerald-500 bg-emerald-500 text-white' 
                        : isBreak 
                        ? 'border-amber-400 bg-amber-50' 
                        : 'border-blue-600 bg-blue-50'
                    }`} />

                    <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                      item.completed 
                        ? 'bg-slate-50/50 border-slate-100 opacity-60' 
                        : isBreak 
                        ? 'bg-amber-50/20 border-amber-50' 
                        : 'bg-white border-slate-100 shadow-xs hover:shadow-md'
                    }`}>
                      <div className="flex items-start gap-3 text-left">
                        <div className="mt-0.5 shrink-0">
                          {isBreak && <Coffee className="w-4 h-4 text-amber-500" />}
                          {isRoutine && <UserCheck className="w-4 h-4 text-indigo-500" />}
                          {isTask && <Clock className="w-4 h-4 text-blue-500 animate-pulse" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-800">{item.startTime} – {item.endTime}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                              isBreak ? 'bg-amber-100 text-amber-700' :
                              isRoutine ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50/80 text-blue-600'
                            }`}>
                              {item.type}
                            </span>
                          </div>
                          <h4 className={`text-xs font-extrabold text-slate-800 mt-1 ${item.completed ? 'line-through text-slate-400' : ''}`}>
                            {item.title}
                          </h4>
                        </div>
                      </div>

                      {/* Control buttons row */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleScheduleItem(item.id)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border ${
                            item.completed 
                              ? 'bg-emerald-50 border-emerald-100 text-emerald-600' 
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {item.completed ? 'Checked Off' : 'Mark Completed'}
                        </button>
                        
                        <button
                          onClick={() => deleteScheduleItem(item.id)}
                          className="p-1.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-all"
                          title="Delete from schedule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xs font-semibold text-slate-400">Your timetable is currently blank.</p>
              <p className="text-[10px] text-slate-400 mt-1">Tap the "Generate My Day" button above to let AI plan your sequence.</p>
            </div>
          )}
        </div>

        {/* Right Span: Manual Event Tuner & AI Companion Guidelines */}
        <div className="space-y-6">
          {/* Manual Event Tuner */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">⏱️ Manual Event Tuner</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Manually insert a customized timeline block to keep your agenda exact.</p>
            </div>

            <form onSubmit={handleCustomEventSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Block Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Biology Lab Session"
                  className="w-full px-3 py-2 text-xs font-bold text-slate-600 border border-slate-200 bg-white rounded-xl focus:border-blue-500"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-3 py-2 text-xs font-bold text-slate-600 border border-slate-200 bg-white rounded-xl focus:border-blue-500 font-mono"
                    value={newEventStart}
                    onChange={(e) => setNewEventStart(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-3 py-2 text-xs font-bold text-slate-600 border border-slate-200 bg-white rounded-xl focus:border-blue-500 font-mono"
                    value={newEventEnd}
                    onChange={(e) => setNewEventEnd(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Block Type</label>
                  <select
                    className="w-full px-3 py-2 text-xs font-bold text-slate-600 border border-slate-200 bg-white rounded-xl focus:border-blue-500"
                    value={newEventType}
                    onChange={(e) => setNewEventType(e.target.value as any)}
                  >
                    <option value="task">Task 📝</option>
                    <option value="routine">Routine 🔄</option>
                    <option value="break">Break ☕</option>
                    <option value="focus">Focus 🧠</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer hover:scale-103"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Event</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Guidelines */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10" />
            
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4.5 h-4.5 text-amber-400" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-300">Companion Planning Rules</h3>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <p className="leading-relaxed">
                Our scheduler operates on a proprietary **3-to-1 work rest ratio**:
              </p>

              <div className="space-y-3">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-800 text-left">
                  <span className="font-bold text-blue-400 block mb-1">⏰ Peak Focus Houring</span>
                  <span className="text-[11px] text-slate-400 leading-normal block">We cluster high-priority academic/work items early in your schedule when your cognitive processing rate is 35% higher.</span>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-800 text-left">
                  <span className="font-bold text-amber-400 block mb-1">☕ Systematic Buffering</span>
                  <span className="text-[11px] text-slate-400 leading-normal block">Between deep focus blocks, we insert 30-minute Mindful Recharge sessions to prevent adrenal exhaustion.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
