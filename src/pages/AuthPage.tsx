import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, Mail, User, Zap, ArrowRight, Github, Chrome, Key, ArrowLeft, RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthPage: React.FC = () => {
  const { setCurrentView, showToast, authView, setAuthView, loginUser, activeTheme } = useApp();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [startFresh, setStartFresh] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill out all login credentials!', 'warning');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const generatedName = email.split('@')[0].split(/[._-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      loginUser(email, generatedName, false);
    }, 1200);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('All fields are mandatory to sign up!', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthView('otp');
      showToast('OTP code sent successfully to your inbox!', 'success');
    }, 1200);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      showToast('Please enter a valid 4-digit verification code.', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      loginUser(email, name, startFresh);
    }, 1000);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please provide your registered email address.', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthView('login');
      showToast('Password reset link dispatched!', 'info');
    }, 1000);
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

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 select-none relative overflow-hidden font-sans transition-all duration-300 ${getThemeLayoutClasses()}`}>
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-xl relative auth-card"
      >
        {/* Brand Banner */}
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/20 mb-4 cursor-pointer" onClick={() => setCurrentView('landing')}>
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight auth-title">LMLS - The life tracker</h3>
          <p className="text-xs text-slate-500 mt-1 auth-subtitle">Smarter priority block routing is here</p>
        </div>

        <AnimatePresence mode="wait">
          {/* LOGIN VIEW */}
          {authView === 'login' && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleLoginSubmit}
              className="space-y-4 text-left"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 auth-label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 font-semibold auth-input"
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider auth-label">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthView('forgot')}
                    className="text-[10px] text-blue-500 hover:text-blue-600 font-bold transition-colors cursor-pointer auth-link"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 font-semibold auth-input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 cursor-pointer select-none auth-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="relative my-6 text-center">
                <span className="absolute inset-x-0 top-2.5 h-px bg-slate-200 social-divider-line" />
                <span className="relative bg-white px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider social-divider-text">Social Access</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => loginUser('google-demo@example.com', 'Google Scholar', false)}
                  className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-xl py-2 px-3 text-xs font-semibold text-slate-600 transition-colors cursor-pointer social-btn"
                >
                  <Chrome className="w-4 h-4 text-red-500" />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => loginUser('github-demo@example.com', 'GitHub Hacker', false)}
                  className="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 rounded-xl py-2 px-3 text-xs font-semibold text-slate-600 transition-colors cursor-pointer social-btn"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </button>
              </div>

              <p className="text-center text-xs font-semibold text-slate-500 pt-6">
                New to the platform?{' '}
                <button
                  type="button"
                  onClick={() => setAuthView('signup')}
                  className="text-blue-500 hover:text-blue-600 font-bold underline cursor-pointer auth-link"
                >
                  Create free account
                </button>
              </p>
            </motion.form>
          )}

          {/* SIGNUP VIEW */}
          {authView === 'signup' && (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleSignupSubmit}
              className="space-y-4 text-left"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 auth-label">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ayush Soni"
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 font-semibold auth-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 auth-label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ayushso220@gmail.com"
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 font-semibold auth-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 auth-label">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 font-semibold auth-input"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 pb-2">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-400 cursor-pointer select-none auth-label">
                  <input
                    type="checkbox"
                    checked={startFresh}
                    onChange={(e) => setStartFresh(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span>Start with a clean workspace (no demo seeds)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Generate Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs font-semibold text-slate-500 pt-6">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setAuthView('login')}
                  className="text-blue-500 hover:text-blue-600 font-bold underline cursor-pointer auth-link"
                >
                  Sign in here
                </button>
              </p>
            </motion.form>
          )}

          {/* FORGOT PASSWORD */}
          {authView === 'forgot' && (
            <motion.form
              key="forgot"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleForgotPassword}
              className="space-y-4 text-left"
            >
              <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-500 leading-relaxed auth-toast-info">
                Provide your email address. We will verify your credential and transmit a temporary fallback passcode immediately.
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 auth-label">Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 font-semibold auth-input"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAuthView('login')}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer back-btn"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Send Code</span>}
                </button>
              </div>
            </motion.form>
          )}

          {/* OTP / ACTIVATION VIEW */}
          {authView === 'otp' && (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleOtpSubmit}
              className="space-y-4 text-left"
            >
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-600 leading-relaxed text-center auth-toast-success">
                We've dispatched a 4-digit code to **{email || 'your inbox'}**.
                <br /> Enter the digits to activate.
              </div>

              <div className="flex flex-col items-center">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 text-center auth-label">Verification Passcode</label>
                <div className="relative w-full flex justify-center">
                  <Key className="absolute left-[15%] sm:left-[22%] top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="4432"
                    required
                    className="w-full max-w-[200px] bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 text-center text-sm text-slate-800 tracking-[0.4em] font-black placeholder-slate-400 auth-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Verify & Activate Space</span>}
              </button>

              <button
                type="button"
                onClick={() => { setOtp(''); showToast('OTP code re-sent!', 'info'); }}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-600 pt-2 transition-colors cursor-pointer auth-link"
              >
                Didn't receive the email? Resend code
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
