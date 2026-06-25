import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { CommandPalette } from './components/CommandPalette';
import { ConfettiEffect } from './components/ConfettiEffect';
import { Toast } from './components/Toast';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardView } from './pages/DashboardView';
import { TaskManagerView } from './pages/TaskManagerView';
import { SmartSchedulerView } from './pages/SmartSchedulerView';
import { FocusRoomView } from './pages/FocusRoomView';
import { HabitsView } from './pages/HabitsView';
import { GoalsView } from './pages/GoalsView';
import { AnalyticsHubView } from './pages/AnalyticsHubView';
import { CoachChatView } from './pages/CoachChatView';
import { SettingsView } from './pages/SettingsView';
import { BackgroundSimulation } from './components/BackgroundSimulation';

const AppContent: React.FC = () => {
  const { currentView, triggerConfetti, setTriggerConfetti, activeTheme } = useApp();

  // If the user is on the Landing Page or Authentication Page, render full screen without the application layouts.
  if (currentView === 'landing') {
    return <LandingPage />;
  }

  if (currentView === 'auth') {
    return <AuthPage />;
  }

  const getThemeLayoutClasses = () => {
    switch (activeTheme) {
      case 'glass-light':
        return 'bg-slate-50 text-slate-950 font-sans theme-glass-light';
      case 'gradient-light':
        return 'bg-[#faf8f5] text-slate-900 font-sans theme-gradient-light';
      case 'basic':
      default:
        return 'bg-slate-50 text-slate-800 font-sans theme-basic';
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden antialiased relative transition-all duration-300 ${getThemeLayoutClasses()}`}>
      {/* Background Interactive Simulation layer */}
      <BackgroundSimulation />

      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Core Layout area */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-transparent">
        {/* Top Header Navbar */}
        <Navbar />

        {/* Dynamic page container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-transparent">
          <div className="max-w-7xl mx-auto h-full bg-transparent">
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'tasks' && <TaskManagerView />}
            {currentView === 'scheduler' && <SmartSchedulerView />}
            {currentView === 'focus' && <FocusRoomView />}
            {currentView === 'habits' && <HabitsView />}
            {currentView === 'goals' && <GoalsView />}
            {currentView === 'analytics' && <AnalyticsHubView />}
            {currentView === 'coach' && <CoachChatView />}
            {currentView === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Global Overlays & Modals */}
      <CommandPalette />
      <ConfettiEffect active={triggerConfetti} onComplete={() => setTriggerConfetti(false)} />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
