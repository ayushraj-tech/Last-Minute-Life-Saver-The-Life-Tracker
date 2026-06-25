import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, Brain, Clock, Volume2, VolumeX, Sparkles, CheckCircle2, ChevronRight, HelpCircle, AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FocusRoomView: React.FC = () => {
  const { 
    focusTimeLeft, setFocusTimeLeft, focusTimerActive, setFocusTimerActive,
    focusSessionTime, setFocusSessionTime, focusSound, setFocusSound,
    tasks, updateTask, showToast
  } = useApp();

  const [selectedTaskId, setSelectedTaskId] = useState<string>('none');
  const activeTasks = tasks.filter(t => t.status !== 'completed');

  // Find currently selected task to display its details
  const activeFocusTask = tasks.find(t => t.id === selectedTaskId);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setFocusTimerActive(!focusTimerActive);
  };

  const handleReset = () => {
    setFocusTimerActive(false);
    setFocusTimeLeft(focusSessionTime);
  };

  const selectSessionLength = (minutes: number) => {
    setFocusTimerActive(false);
    setFocusSessionTime(minutes * 60);
    setFocusTimeLeft(minutes * 60);
    showToast(`Timer configured to ${minutes} minutes.`, 'info');
  };

  const progressPercent = Math.round(((focusSessionTime - focusTimeLeft) / focusSessionTime) * 100);

  return (
    <div className="space-y-6 text-left select-none pb-12 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Deep Focus Room</h2>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">Activate distraction-free Pomodoro blocks to maximize mental bandwidth and earn XP multipliers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Span: Focus Room Panel */}
        <div className="lg:col-span-2 bg-slate-950 text-white p-8 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[450px]">
          {/* Ambient subtle backing glow */}
          <div className="absolute inset-0 bg-radial-gradient from-blue-600/10 to-transparent -z-10" />

          {/* Quick config options */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            {[15, 25, 50].map((mins) => (
              <button
                key={mins}
                onClick={() => selectSessionLength(mins)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  focusSessionTime === mins * 60 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mins} Min
              </button>
            ))}

            <div className="h-4 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800/80">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Custom:</span>
              <input
                type="number"
                min="1"
                max="360"
                placeholder="25"
                className="w-12 text-center text-xs font-black text-white bg-transparent border-none outline-none focus:ring-0 placeholder-slate-700 font-mono"
                value={Math.round(focusSessionTime / 60) || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0 && val <= 360) {
                    setFocusTimerActive(false);
                    setFocusSessionTime(val * 60);
                    setFocusTimeLeft(val * 60);
                  } else if (e.target.value === '') {
                    setFocusTimerActive(false);
                    setFocusSessionTime(0);
                    setFocusTimeLeft(0);
                  }
                }}
              />
              <span className="text-[10px] font-bold text-slate-500">Min</span>
            </div>
          </div>

          {/* Large Clock Display */}
          <div className="relative flex items-center justify-center h-56 w-56 mb-8">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="100"
                className="stroke-slate-900 fill-none"
                strokeWidth="6"
              />
              <circle
                cx="112"
                cy="112"
                r="100"
                className="stroke-blue-600 fill-none transition-all duration-300"
                strokeWidth="6"
                strokeDasharray="628"
                strokeDashoffset={628 - (628 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>

            {/* Countdown string */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-mono font-black tracking-widest text-slate-100">
                {formatTimer(focusTimeLeft)}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5">
                {focusTimerActive ? 'ACTIVE BLOCK' : 'PAUSED'}
              </span>
            </div>
          </div>

          {/* Play/Pause Control Row */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="p-3 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded-xl border border-slate-800 cursor-pointer transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleStartPause}
              className={`px-8 py-3.5 rounded-xl text-xs font-black tracking-widest uppercase shadow-lg transition-all hover:scale-103 cursor-pointer ${
                focusTimerActive 
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-950/20 text-slate-950' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-950/20 text-white'
              }`}
            >
              {focusTimerActive ? 'Pause Session' : 'Start Focus Session'}
            </button>
          </div>
        </div>

        {/* Right Span: Focus Target Selector & Sounds */}
        <div className="space-y-6">
          {/* Target Task Selector */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left">
            <h3 className="text-sm font-bold text-slate-800 mb-1">🎯 Select Focus Target</h3>
            <p className="text-[10px] text-slate-400 font-semibold mb-4">Connect this Pomodoro timer to an active obligation to track progress.</p>

            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold text-slate-600 border border-slate-200 bg-white rounded-xl focus:border-blue-500 cursor-pointer mb-4"
            >
              <option value="none">No specific target (General Focus)</option>
              {activeTasks.map((task) => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
            </select>

            {activeFocusTask ? (
              <div className="p-3.5 bg-blue-50/40 border border-blue-50 rounded-xl space-y-2.5">
                <span className="inline-block bg-white border border-blue-100 text-blue-600 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase">
                  {activeFocusTask.category}
                </span>
                <h4 className="text-xs font-bold text-slate-800">{activeFocusTask.title}</h4>
                <p className="text-[10px] text-slate-400 font-medium leading-normal">{activeFocusTask.description}</p>
                
                {/* Subtask Quick checks in Focus mode */}
                {activeFocusTask.subtasks.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-blue-50/50">
                    <span className="text-[9px] font-black text-slate-400 block uppercase">Subtask Steps:</span>
                    {activeFocusTask.subtasks.map((st) => (
                      <label key={st.id} className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => {
                            const updatedSubtasks = activeFocusTask.subtasks.map(s => 
                              s.id === st.id ? { ...s, completed: !s.completed } : s
                            );
                            updateTask(activeFocusTask.id, { subtasks: updatedSubtasks });
                          }}
                          className="w-3.5 h-3.5 text-blue-600"
                        />
                        <span className={st.completed ? 'line-through text-slate-400' : ''}>{st.title}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400 font-medium">
                No active target selected. General tracking runs fine, but selecting a task helps organize subtask checkpoints.
              </div>
            )}
          </div>

          {/* Ambient Music Player */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left">
            <h3 className="text-sm font-bold text-slate-800 mb-1">🎧 Ambient Audio Deck</h3>
            <p className="text-[10px] text-slate-400 font-semibold mb-4">Toggle simulated soft background white noise to seal out sensory noise.</p>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'none', label: 'Silence' },
                { id: 'lofi', label: '☕ Lofi Beats' },
                { id: 'rain', label: '🌧️ Heavy Rain' },
                { id: 'nature', label: '🍃 Forest Wind' },
                { id: 'ambient', label: '🪐 Cosmic Synth' }
              ].map((sound) => {
                const isActive = focusSound === sound.id;
                return (
                  <button
                    key={sound.id}
                    onClick={() => { setFocusSound(sound.id as any); showToast(`Synthesizer set to ${sound.label}`, 'success'); }}
                    className={`p-2.5 text-xs font-bold rounded-xl border text-left cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-blue-50 border-blue-200 text-blue-600' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {sound.label}
                  </button>
                );
              })}
            </div>

            {/* Simulated Audio Visualizer wave if sound is on and timer is running */}
            {focusSound !== 'none' && focusTimerActive && (
              <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-black uppercase">SOUND ACTIVE</span>
                <div className="flex gap-0.5 items-end h-4">
                  {[12, 16, 8, 14, 6, 12, 10].map((h, i) => (
                    <span 
                      key={i} 
                      className="w-0.5 bg-blue-600 rounded-full animate-bounce" 
                      style={{ height: `${h}px`, animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
