import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, Brain, Clock, ShieldAlert, Sparkles, ChevronRight, CheckCircle2, Star, Award, ChevronDown, Play, HelpCircle, Flame, Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BackgroundSimulation } from '../components/BackgroundSimulation';

export const LandingPage: React.FC = () => {
  const { 
    setCurrentView, 
    activeTheme, 
    setActiveTheme, 
    activeSimulation, 
    setActiveSimulation,
    showToast,
    loginUser
  } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: '35%', label: 'Average Focus Boost' },
    { value: '0%', label: 'Missed Deadlines Logged' },
    { value: '4.9/5', label: 'Student & Founder Rating' },
    { value: '4.2h', label: 'Time Saved Weekly' },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI Priority Score',
      desc: 'Computes multi-weighted urgency and risk multipliers for each assignment so you always target what matters first.',
      badge: 'Analytical'
    },
    {
      icon: Clock,
      title: 'Generate My Day',
      desc: 'Slices overwhelming workloads into step-by-step timetables, interleaving mindful cognitive breaks to prevent burnout.',
      badge: 'Core Engine'
    },
    {
      icon: ShieldAlert,
      title: 'Risk Guard Monitoring',
      desc: 'Detects active procrastination loops, reminding you contextually when a task has been delayed or rescheduled too often.',
      badge: 'Protective'
    }
  ];

  const faqs = [
    {
      q: 'How does the AI Priority Engine calculate scores?',
      a: 'The engine parses multiple parameters: days left until the final deadline, estimated task workload in hours, custom priority weights, and historic categories completion speed, creating an exact 0-100% Risk Urgency Index.'
    },
    {
      q: 'Can I use this for both school and professional work?',
      a: 'Absolutely! You can easily segment tasks under tags like Work, Study, Finance, and Personal. The smart scheduler will customize its breaks and suggestions based on work hours.'
    },
    {
      q: 'Is there a offline persistence mode?',
      a: 'Yes, Last Minute Life Saver is offline-first. Every task, schedule block, habit tracker log, and custom goal is securely synchronized locally using your browser\'s LocalStorage.'
    }
  ];

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const getThemeLayoutClasses = () => {
    switch (activeTheme) {
      case 'glass-dark':
        return 'bg-slate-950 text-slate-100 theme-glass-dark';
      case 'glass-light':
        return 'bg-slate-50 text-slate-950 theme-glass-light';
      case 'gradient-dark':
        return 'bg-slate-950 text-slate-100 theme-gradient-dark';
      case 'gradient-light':
        return 'bg-[#faf8f5] text-slate-900 theme-gradient-light';
      case 'basic':
      default:
        return 'bg-slate-50 text-slate-800 theme-basic';
    }
  };

  const getThemeAccentClasses = () => {
    switch (activeTheme) {
      case 'glass-dark':
        return {
          btn: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20',
          btnSec: 'border border-slate-700 bg-slate-900/40 text-slate-200 hover:bg-slate-800/60',
          badgeBg: 'bg-indigo-950/40 border border-indigo-500/30 text-indigo-300',
          text: 'text-indigo-400 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent',
          logoBg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
          textNormal: 'text-white',
          linkNormal: 'text-slate-300 hover:text-white',
        };
      case 'glass-light':
        return {
          btn: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-500/15',
          btnSec: 'border border-slate-200 bg-white/70 text-slate-700 hover:bg-slate-50',
          badgeBg: 'bg-indigo-50 border border-indigo-100 text-indigo-600',
          text: 'text-indigo-600 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent',
          logoBg: 'bg-gradient-to-r from-indigo-600 to-violet-600',
          textNormal: 'text-slate-950',
          linkNormal: 'text-slate-600 hover:text-slate-900',
        };
      case 'gradient-dark':
        return {
          btn: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20',
          btnSec: 'border border-slate-700 bg-purple-950/20 text-slate-200 hover:bg-purple-900/30',
          badgeBg: 'bg-purple-950/50 border border-purple-500/30 text-purple-300',
          text: 'text-purple-400 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent',
          logoBg: 'bg-gradient-to-r from-purple-600 to-pink-600',
          textNormal: 'text-white',
          linkNormal: 'text-slate-300 hover:text-white',
        };
      case 'gradient-light':
        return {
          btn: 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg shadow-rose-500/20',
          btnSec: 'border border-slate-200 bg-white/70 text-slate-700 hover:bg-slate-50',
          badgeBg: 'bg-rose-50 border border-rose-100 text-rose-600',
          text: 'text-rose-600 bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent',
          logoBg: 'bg-gradient-to-r from-rose-500 to-orange-500',
          textNormal: 'text-slate-950',
          linkNormal: 'text-slate-600 hover:text-slate-900',
        };
      case 'basic':
      default:
        return {
          btn: 'bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10',
          btnSec: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
          badgeBg: 'bg-slate-100 border border-slate-200 text-slate-700',
          text: 'text-slate-900',
          logoBg: 'bg-slate-900',
          textNormal: 'text-slate-900',
          linkNormal: 'text-slate-600 hover:text-slate-900',
        };
    }
  };

  const accent = getThemeAccentClasses();

  return (
    <div className={`min-h-screen font-sans select-none overflow-x-hidden relative transition-all duration-300 ${getThemeLayoutClasses()}`}>
      {/* Background Interactive Simulation layer */}
      <BackgroundSimulation />
      {/* Top Banner */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 text-center font-semibold flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Hackathon Special Edition: Fully Functional Client-Side State persistence enabled!</span>
      </div>

      {/* Floating Header */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg ${accent.logoBg} flex items-center justify-center text-white shadow-md`}>
            <Zap className="w-4.5 h-4.5 fill-current" />
          </div>
          <span className={`font-extrabold ${accent.textNormal} tracking-tight text-lg`}>
            LMLS - <span className={activeTheme === 'basic' ? 'text-slate-900' : accent.text}>The life tracker</span>
          </span>
        </div>

        <nav className={`hidden md:flex items-center gap-8 text-sm font-semibold ${accent.linkNormal}`}>
          <a href="#features" className="transition-colors">Features</a>
          <a href="#playground" className="transition-colors">Playground</a>
          <a href="#faq" className="transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => { setCurrentView('auth'); }}
            className={`px-4 py-2 text-sm font-bold ${accent.linkNormal} rounded-xl transition-all cursor-pointer`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setCurrentView('auth'); }}
            className={`px-5 py-2.5 ${accent.btn} text-xs font-bold rounded-xl shadow-md transition-all hover:scale-103 cursor-pointer`}
          >
            Get Started Free
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero-section" className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-left">
          <div className={`inline-flex items-center gap-2 px-3 py-1 ${accent.badgeBg} text-[10px] font-bold uppercase tracking-wider rounded-full hero-badge`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Never miss another deadline</span>
          </div>
          
          <h2 className={`text-5xl lg:text-6xl font-black ${accent.textNormal} tracking-tight leading-[1.05] hero-title`}>
            Beat Burnout. <br />
            <span className={activeTheme === 'basic' ? 'text-slate-900' : `${accent.text} hero-title-accent`}>Crush Deadlines.</span>
          </h2>
          
          <p className="text-base text-slate-500 leading-relaxed max-w-lg hero-description">
            Say goodbye to passive notifications you snooze and ignore. Our companion actively parses your workload, plans your days, monitors procrastination habits, and blocks out distraction-free focus sessions.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              id="hero-get-started-cta"
              onClick={() => { setCurrentView('auth'); }}
              className={`px-6 py-3.5 text-xs font-bold rounded-xl flex items-center gap-2 transition-all hover:scale-102 cursor-pointer`}
            >
              <span>Get Started Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              id="hero-launch-demo-cta"
              onClick={() => {
                loginUser('demo@example.com', 'Demo User', false);
              }}
              className={`px-6 py-3.5 ${accent.btnSec} text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer hero-cta-sec`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Live Demo</span>
            </button>
          </div>

          {/* Social Proof */}
          <div className="pt-6 border-t border-slate-200/80 flex items-center gap-3 hero-social-proof-container">
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80" className="w-8 h-8 rounded-full border-2 border-white" alt="Avatar" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80" className="w-8 h-8 rounded-full border-2 border-white" alt="Avatar" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" className="w-8 h-8 rounded-full border-2 border-white" alt="Avatar" />
            </div>
            <div className="text-left">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-[11px] text-slate-500 font-bold hero-social-proof">Empowering 12,000+ high-performers worldwide</p>
            </div>
          </div>
        </div>

        {/* Hero Product Illustration */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-3xl" />
          <div className="border border-slate-200/70 bg-white shadow-2xl rounded-2xl p-5 overflow-hidden relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Companion Workspace</span>
            </div>

            {/* Simulated mini dashboard */}
            <div className="space-y-4 text-left">
              <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between shadow-md">
                <div>
                  <h4 className="text-xs font-extrabold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    AI Prioritization Engine
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-xs">Tackling your presentation deck reduces tomorrow's workload score by 45%.</p>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-black text-emerald-400">92%</span>
                  <span className="text-[9px] text-slate-400 font-bold">Risk Index</span>
                </div>
              </div>

              <div className="border border-slate-100 p-3 rounded-xl flex items-center gap-3 bg-slate-50/50">
                <Clock className="w-4.5 h-4.5 text-blue-500 shrink-0" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-700">Next Focus Blocks Scheduled</span>
                    <span className="text-[10px] text-blue-500 font-bold bg-blue-50 px-2 py-0.5 rounded-full">9:30 AM</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-blue-500 h-full w-4/5 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-100 p-3.5 rounded-xl bg-white shadow-xs">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">XP Level Tracker</span>
                  <span className="text-sm font-bold text-slate-800">Level 4 Scholar</span>
                  <div className="w-full bg-slate-100 h-1 rounded-full mt-2">
                    <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full w-3/4 rounded-full" />
                  </div>
                </div>
                <div className="border border-slate-100 p-3.5 rounded-xl bg-white shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Current Habit Streak</span>
                    <span className="text-sm font-bold text-orange-500">8 Days</span>
                  </div>
                  <Flame className="w-7 h-7 text-orange-500 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Board */}
      <section className="bg-white border-y border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <span className="block text-4xl font-extrabold text-slate-900 tracking-tight">{stat.value}</span>
              <span className="text-xs text-slate-500 font-bold mt-1.5 block">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest block">HOW WE WORK</span>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Active Assistance Built In</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Unlike standard to-do list apps that wait silently for you to fail, our AI Companion actively steps in to structure focus sessions, organize milestones, and block out procrastinating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i} 
                className="bg-white border border-slate-100 hover:border-blue-100 p-8 rounded-2xl text-left hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between feature-card"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/40 rounded-bl-3xl -z-10 translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform feature-card-bg-pattern" />
                
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit feature-card-icon-container">
                    <Icon className="w-6 h-6 feature-card-icon" />
                  </div>
                  <div>
                    <span className="inline-block text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mb-1 feature-card-badge">
                      {feat.badge}
                    </span>
                    <h4 className="text-lg font-bold text-slate-800 feature-card-title">{feat.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed feature-card-desc">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PLAYGROUND & THEME STUDIO */}
      <section id="playground" className="bg-slate-950 text-white py-24 select-none relative overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="max-w-xl mx-auto mb-12 space-y-3">
            <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest block flex items-center justify-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Interactive Simulation Studio
            </span>
            <h3 className="text-3xl font-black text-white tracking-tight">Aesthetic Workspace Playground</h3>
            <p className="text-xs text-slate-400">
              Select any visual theme or mouse-reactive simulation below to preview the interactive physics in real-time. Click anywhere on the screen to trigger visual particle shockwaves!
            </p>
          </div>

          {/* Interactive Playground Control Center */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-center">
            {/* Left side: Controls */}
            <div className="lg:col-span-5 space-y-6 text-left">
              {/* Theme selection block */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">1. Select Visual Theme</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'glass-light', name: 'Glassmorphism Aurora (Light)', desc: 'Soft frosted light panels with bright warm glass backdrops', dot: 'bg-blue-400' },
                    { id: 'gradient-light', name: 'Gradient Silk (Light)', desc: 'Delicate champagne peach silk gradient', dot: 'bg-amber-400' },
                    { id: 'basic', name: 'Basic Minimalist (Light)', desc: 'Sleek borders & clean slate minimal gray style', dot: 'bg-slate-400' }
                  ].map((th) => {
                    const isSel = activeTheme === th.id;
                    return (
                      <button
                        key={th.id}
                        onClick={() => {
                          setActiveTheme(th.id as any);
                          showToast(`Workspace theme swapped to ${th.name}!`, 'success');
                        }}
                        className={`p-3 rounded-xl border text-left transition-all hover:scale-101 cursor-pointer flex items-center gap-3 relative overflow-hidden ${
                          isSel 
                            ? 'border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/20' 
                            : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 text-slate-300'
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full shrink-0 ${th.dot} ${isSel ? 'animate-ping' : ''}`} />
                        <div>
                          <span className="text-xs font-bold block text-white">{th.name}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">{th.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Simulation selection block */}
              <div className="space-y-3">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">2. Select Background Simulation Pattern</span>
                <div className="space-y-2">
                  {[
                    { id: 'ripples', name: 'Fluid Ripples & Click Collisions', desc: 'Concentric wave ripples expand outward from your click coordinate.' },
                    { id: 'orbits', name: 'Orbits & Gravity Fields', desc: 'Tiny cosmic dust particles cluster and swarm around your cursor.' },
                    { id: 'neural', name: 'Neural Network Graphs', desc: 'Elastic interconnected node webs repel and ignite on click.' },
                    { id: 'digitalRain', name: 'Digital Matrix Rain', desc: 'Falling columns of binary digits slide downwards and react to hover.' }
                  ].map((sim) => {
                    const isSel = activeSimulation === sim.id;
                    return (
                      <button
                        key={sim.id}
                        onClick={() => {
                          setActiveSimulation(sim.id as any);
                          showToast(`Simulations pattern set to ${sim.name}!`, 'success');
                        }}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                          isSel 
                            ? 'border-blue-500 bg-blue-950/40 ring-2 ring-blue-500/20 shadow-lg' 
                            : 'border-slate-800 bg-slate-900/30 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${isSel ? 'border-blue-500 bg-blue-500' : 'border-slate-700'}`}>
                          {isSel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-bold block text-white">{sim.name}</span>
                          <span className="text-[10px] text-slate-400 leading-normal block mt-0.5">{sim.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right side: Interactive Mockup rendering demonstrating selected theme in high fidelity */}
            <div className="lg:col-span-7 relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-lg opacity-25 animate-pulse" />
              
              {/* Dynamic Theme Demo Mockup Box */}
              <div className={`border rounded-2xl p-6 relative overflow-hidden transition-all duration-500 mockup-card ${
                activeTheme === 'glass-light' ? 'bg-gradient-to-br from-[#f3f4f6] via-[#e5e7eb] to-[#f9fafb] border-slate-200 text-slate-950 shadow-xl' :
                activeTheme === 'gradient-light' ? 'bg-gradient-to-br from-[#fdfbf7] via-[#fff1f2] to-[#fff7ed] border-amber-200 text-slate-900 shadow-xl' :
                'bg-white border-slate-200 text-slate-800 shadow-xl'
              }`}>
                {/* Simulated Menu Header */}
                <div className="flex items-center justify-between border-b pb-3 mb-4 border-current/10">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400 shrink-0" />
                    <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400 shrink-0" />
                  </div>
                  <span className="text-[9px] font-black tracking-widest uppercase opacity-60">
                    Live Workspace Mockup ({activeTheme.toUpperCase()})
                  </span>
                </div>

                {/* Simulated Content Dashboard */}
                <div className="space-y-4 text-left">
                  <div className="p-4 rounded-xl bg-current/5 border border-current/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        Interactive Shockwave Test
                      </h4>
                      <p className="text-[10px] opacity-75 mt-1">
                        Clicking this simulated button triggers particle spark bursts on the background simulation!
                      </p>
                    </div>
                    
                    {/* Simulated interactive click triggers */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast("Spark burst simulated behind mockup!", "success");
                      }}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-transform hover:scale-105 cursor-pointer shadow-md"
                    >
                      Trigger Shockwave
                    </button>
                  </div>

                  {/* Dynamic checklist mimicking task views */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase opacity-60">Active Goals & Milestones</span>
                    {[
                      { title: 'Polish custom Framer Motion page routes', completed: true },
                      { title: 'Test responsive canvas ResizeObservers', completed: false }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-current/5 border border-current/5">
                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                          item.completed ? 'bg-blue-600 border-blue-600 text-white border-blue-600' : 'border-current/30'
                        }`}>
                          {item.completed && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={`text-[11px] font-semibold ${item.completed ? 'line-through opacity-50' : ''}`}>
                          {item.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Level Progression Indicator */}
                  <div className="p-3.5 rounded-xl bg-current/5 border border-current/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] block opacity-60">Active Gamified Rank</span>
                      <span className="text-xs font-bold block mt-0.5">Level 4 Deadline Crusher</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold block text-blue-500">820 / 1000 XP</span>
                      <div className="w-24 bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-4/5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-24">
        <div className="text-center mb-16 space-y-3">
          <HelpCircle className="w-8 h-8 text-blue-600 mx-auto" />
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h3>
          <p className="text-xs text-slate-500">Need answers regarding our AI core operations? We got you covered.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div key={index} className="border border-slate-200 bg-white rounded-xl overflow-hidden transition-all faq-container">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-slate-800 hover:text-slate-900 font-bold text-sm cursor-pointer faq-trigger"
                >
                  <span className="faq-question">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 faq-chevron ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs text-slate-500 leading-relaxed border-t border-slate-50 faq-content">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400 font-semibold">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              L
            </div>
            <span className="text-slate-800 font-bold uppercase tracking-wider">last minute life saver  the life tracker © 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Developer Portal</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
