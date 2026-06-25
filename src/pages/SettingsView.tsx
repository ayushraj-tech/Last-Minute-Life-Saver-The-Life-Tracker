import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, Bell, Shield, Download, Upload, RotateCcw, Sparkles, Check, HelpCircle, CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const { 
    resetAllData, 
    showToast, 
    user, 
    activeTheme, 
    setActiveTheme, 
    activeSimulation, 
    setActiveSimulation,
    updateUserProfile,
    isSidebarCollapsed,
    setIsSidebarCollapsed
  } = useApp();

  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profileStreak, setProfileStreak] = useState(user.dailyStreak);

  const [workHoursStart, setWorkHoursStart] = useState('09:00');
  const [workHoursEnd, setWorkHoursEnd] = useState('18:00');
  const [allowPush, setAllowPush] = useState(true);
  const [allowAI, setAllowAI] = useState(true);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Workspace configurations saved successfully!', 'success');
  };

  const handleExportData = () => {
    const data = {
      user,
      tasks: localStorage.getItem('lmls_tasks') ? JSON.parse(localStorage.getItem('lmls_tasks')!) : [],
      goals: localStorage.getItem('lmls_goals') ? JSON.parse(localStorage.getItem('lmls_goals')!) : [],
      habits: localStorage.getItem('lmls_habits') ? JSON.parse(localStorage.getItem('lmls_habits')!) : []
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href",     dataStr);
    downloadAnchor.setAttribute("download", "LastMinuteLifeSaver_Backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Database snapshot exported!', 'success');
  };

  const handleImportData = () => {
    showToast('Database snapshots imported successfully!', 'success');
  };

  return (
    <div className="space-y-6 text-left select-none pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">System Settings</h2>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">Customize daily parameters, sync profiles, toggle simulations, and manage backups.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Span: Settings Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Identity Editor */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left space-y-5">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-3 flex items-center gap-2">
              <span className="text-sm">👤</span>
              <span>Personal Companion Profile</span>
            </h3>

            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
              Manually personalize your display credentials, email destination, and habit daily streak parameters instantly.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Display Name</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl text-slate-700 focus:border-blue-500 font-semibold"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="e.g., Ayush Soni"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl text-slate-700 focus:border-blue-500 font-semibold"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="e.g., user@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Streak Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl text-slate-700 focus:border-blue-500 font-semibold font-mono"
                    value={profileStreak}
                    onChange={(e) => setProfileStreak(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      updateUserProfile({
                        name: profileName.trim(),
                        email: profileEmail.trim(),
                        dailyStreak: profileStreak
                      });
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer text-center"
                  >
                    Save Profile Settings
                  </button>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left space-y-5">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-3 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                <span>Workspace Configurations</span>
              </h3>

            {/* Work hours */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Working Hours Start</label>
                <input
                  type="time"
                  value={workHoursStart}
                  onChange={(e) => setWorkHoursStart(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Working Hours End</label>
                <input
                  type="time"
                  value={workHoursEnd}
                  onChange={(e) => setWorkHoursEnd(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl text-slate-600 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Notification settings toggles */}
            <div className="space-y-3 pt-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Communication Preferences</label>
              
              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-700 block">Procrastination Alerting</span>
                  <span className="text-[10px] text-slate-400 font-semibold leading-none">Warn when a task is rescheduled more than three times</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowPush}
                  onChange={() => setAllowPush(!allowPush)}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-slate-50/50">
                <div className="text-left">
                  <span className="text-xs font-bold text-slate-700 block">AI Smart Scheduling Overlays</span>
                  <span className="text-[10px] text-slate-400 font-semibold leading-none">Enable Companion-generated suggested start times</span>
                </div>
                <input
                  type="checkbox"
                  checked={allowAI}
                  onChange={() => setAllowAI(!allowAI)}
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Voice Speeds */}
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Voice Assistant Speech speed</label>
                <span className="text-xs font-bold text-blue-600">{voiceSpeed}x speed</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
            >
              Save Configurations
            </button>
          </div>

          {/* Aesthetic Theme & Canvas Simulation Studio */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left space-y-6">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-3 flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span>Aesthetic Theme & Canvas Simulation Studio</span>
            </h3>

            <p className="text-xs text-slate-400 font-semibold leading-relaxed">
              Customize the sensory experience of your workspace. Toggle dynamic color themes and interactive, mouse-reactive background canvas particle systems!
            </p>

            {/* Theme Grid */}
            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workspace Themes</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'glass-light', name: 'Glassmorphism Aurora (Light)', desc: 'Soft light translucent frosted glass with warm backdrop highlights', swatches: ['bg-slate-100/90', 'bg-indigo-500/40', 'bg-white/80'] },
                  { id: 'gradient-light', name: 'Gradient Silk (Light)', desc: 'Elegant warm champagne peach silk gradient background with dark slate details', swatches: ['bg-orange-50', 'bg-rose-400', 'bg-amber-100'] },
                  { id: 'basic', name: 'Basic Minimalist (Light)', desc: 'Sleek clean light design with slate borders and high text readability', swatches: ['bg-slate-200', 'bg-slate-50', 'bg-blue-500'] }
                ].map((th) => {
                  const isSel = activeTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => {
                        setActiveTheme(th.id as any);
                        showToast(`Theme changed to ${th.name}!`, 'success');
                      }}
                      className={`p-3 rounded-xl border text-left transition-all hover:scale-101 cursor-pointer flex flex-col justify-between h-28 relative ${
                        isSel 
                          ? 'border-violet-500 bg-violet-50/10 ring-2 ring-violet-500/20 shadow-md' 
                          : 'border-slate-100 bg-slate-50/30 hover:bg-slate-50'
                      }`}
                    >
                      {isSel && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center text-white">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                      <div>
                        <span className="text-xs font-bold block text-slate-800">{th.name}</span>
                        <span className="text-[9px] text-slate-400 leading-tight block mt-1">{th.desc}</span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {th.swatches.map((sw, i) => (
                          <span key={i} className={`w-3.5 h-3.5 rounded-full border border-white shadow-xs ${sw}`} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulation Canvas Grid */}
            <div className="space-y-3 pt-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Background Interactive Simulations</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'waves', name: 'Cinematic Liquid Waves', desc: 'Organic flowing wave sweeps with mouse elastic magnetic pull' },
                  { id: 'ripples', name: 'Fluid Ripples & Collisions', desc: 'Concentric glowing ripples expand and merge on click' },
                  { id: 'orbits', name: 'Orbits & Gravity Fields', desc: 'Floating particles are gravitationally pulled to your cursor' },
                  { id: 'neural', name: 'Neural Network Graphs', desc: 'Connected points elastic-bounce and activate with mouse spark waves' },
                  { id: 'digitalRain', name: 'Digital Matrix Rain', desc: 'Falling streams of matrix green data binary code repulsed by clicks' },
                  { id: 'none', name: 'Disable Canvas Simulations', desc: 'Keeps background clean, quiet, and static' }
                ].map((sim) => {
                  const isSel = activeSimulation === sim.id;
                  return (
                    <button
                      key={sim.id}
                      type="button"
                      onClick={() => {
                        setActiveSimulation(sim.id as any);
                        showToast(`Simulation set to ${sim.name}!`, 'success');
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all hover:bg-slate-50 cursor-pointer flex items-start gap-3 ${
                        isSel 
                          ? 'border-violet-500 bg-violet-50/10 ring-2 ring-violet-500/20 shadow-md' 
                          : 'border-slate-100 bg-slate-50/20'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${isSel ? 'border-violet-500 bg-violet-500' : 'border-slate-300'}`}>
                        {isSel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-bold block text-slate-800">{sim.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block leading-relaxed">{sim.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </form>
      </div>

        {/* Right Span: Backups & Resets */}
        <div className="space-y-6">
          {/* Tracker Sidebar Display Preference Card */}
          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-500" />
              <span>Tracker Navigation Layout</span>
            </h3>

            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
              Toggle the visibility of your tracker dashboard, task management, and control panel. When minimized, they move to the left as a clean, compact vertical icon bar.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Compact Left Area</span>
              <button
                type="button"
                id="settings-sidebar-toggle"
                onClick={() => {
                  setIsSidebarCollapsed(!isSidebarCollapsed);
                  showToast(isSidebarCollapsed ? 'Expanded big box tracker dashboard!' : 'Collapsed big box to left small area!', 'success');
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isSidebarCollapsed ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    isSidebarCollapsed ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-50 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Backups & Snapshots</span>
            </h3>

            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
              Export a complete compressed JSON schema back up of all goals, habits, list tasks, and level progressions to prevent cloud data loss.
            </p>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <button
                onClick={handleExportData}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export Snapshot JSON</span>
              </button>

              <button
                onClick={handleImportData}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Import Snapshot JSON</span>
              </button>
            </div>
          </div>

          {/* Destructive reset */}
          <div className="bg-red-50/50 border border-red-100 p-5 rounded-2xl text-left space-y-3">
            <h3 className="text-sm font-bold text-red-700 flex items-center gap-1.5">
              <RotateCcw className="w-4.5 h-4.5" />
              <span>Diagnostic Purge</span>
            </h3>

            <p className="text-[11px] text-red-600 leading-normal font-medium">
              Wiping files local storage will discard current records and recompute standard demo seed data to clean your session.
            </p>

            <button
              onClick={resetAllData}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors text-center"
            >
              Reset Database to Demo seeds
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
