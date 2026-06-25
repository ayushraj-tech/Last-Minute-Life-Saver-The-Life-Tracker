import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Task, Goal, Habit, ScheduleItem, CoachMessage, Notification, UserProfile, SubTask, TaskPriority, TaskStatus
} from '../types';
import { generateAiMetrics, generateSmartSchedule } from '../utils/aiEngine';
import { audioEngine } from '../utils/audioEngine';

interface AppContextType {
  user: UserProfile;
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  schedule: ScheduleItem[];
  messages: CoachMessage[];
  notifications: Notification[];
  currentView: string; // 'landing' | 'auth' | 'dashboard' | 'tasks' | 'scheduler' | 'habits' | 'goals' | 'analytics' | 'focus' | 'settings' | 'coach'
  authView: 'login' | 'signup' | 'forgot' | 'otp';
  isDarkMode: boolean;
  searchQuery: string;
  isSearchOpen: boolean;
  activeTaskId: string | null;
  focusTimeLeft: number;
  focusTimerActive: boolean;
  focusSessionTime: number; // in seconds
  focusSound: 'none' | 'lofi' | 'nature' | 'rain' | 'ambient';
  undoTask: Task | null;
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  triggerConfetti: boolean;
  activeTheme: 'basic' | 'glass-light' | 'gradient-light';
  activeSimulation: 'none' | 'orbits' | 'ripples' | 'neural' | 'digitalRain' | 'waves';
  isSidebarCollapsed: boolean;
  
  // Setters & Actions
  setCurrentView: (view: string) => void;
  setAuthView: (view: 'login' | 'signup' | 'forgot' | 'otp') => void;
  setIsDarkMode: (dark: boolean) => void;
  setSearchQuery: (query: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  setActiveTaskId: (id: string | null) => void;
  setFocusTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setFocusTimerActive: (active: boolean) => void;
  setFocusSessionTime: (time: number) => void;
  setFocusSound: (sound: 'none' | 'lofi' | 'nature' | 'rain' | 'ambient') => void;
  setTriggerConfetti: (trigger: boolean) => void;
  setActiveTheme: (theme: 'basic' | 'glass-light' | 'gradient-light') => void;
  setActiveSimulation: (sim: 'none' | 'orbits' | 'ripples' | 'neural' | 'digitalRain' | 'waves') => void;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  
  // CRUD operations
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'aiPriorityScore' | 'aiUrgency' | 'aiDifficulty' | 'aiRiskLevel' | 'aiSuggestedStart' | 'aiExplanation' | 'pinned' | 'favorite'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  togglePinTask: (id: string) => void;
  toggleFavoriteTask: (id: string) => void;
  undoDelete: () => void;
  
  addGoal: (goalData: Omit<Goal, 'id' | 'createdAt' | 'completed' | 'progress'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  
  addHabit: (habitData: Omit<Habit, 'id' | 'streak' | 'maxStreak' | 'history' | 'createdAt'>) => void;
  toggleHabit: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;
  
  regenerateSchedule: () => void;
  toggleScheduleItem: (id: string) => void;
  addScheduleItem: (itemData: Omit<ScheduleItem, 'id' | 'completed'>) => void;
  deleteScheduleItem: (id: string) => void;
  updateScheduleItem: (id: string, updates: Partial<ScheduleItem>) => void;
  
  addMessage: (text: string, sender: 'user' | 'coach') => void;
  clearMessages: () => void;
  
  addNotification: (title: string, message: string, type: 'alert' | 'success' | 'info' | 'ai') => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  awardXp: (amount: number, reason: string) => void;
  loginUser: (email: string, name: string, startFresh: boolean) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Define beautiful seed data
const initialUserProfile: UserProfile = {
  name: 'Ayush Soni',
  email: 'ayushso220@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  level: 4,
  xp: 320,
  xpToNextLevel: 1000,
  badges: ['Early Bird', 'Consistency King', 'Deep Focus Champion', 'Deadline Crusher'],
  dailyStreak: 5,
};

const initialTasks: Task[] = [
  {
    id: 't-1',
    title: 'Finalize Hackathon Demo & Deck',
    description: 'Ensure our Pitch Deck is fully animated, covers core pain points, and links properly to the prototype.',
    deadline: '2026-06-25',
    priority: 'high',
    estimatedTime: 2.5,
    category: 'Work',
    subtasks: [
      { id: 'sub-1', title: 'Polish Framer Motion transitions', completed: true },
      { id: 'sub-2', title: 'Verify LocalStorage state persistence', completed: true },
      { id: 'sub-3', title: 'Record 2-min demo walkthrough video', completed: false }
    ],
    tags: ['Hackathon', 'Pitch', 'SaaS'],
    status: 'in-progress',
    notes: 'Keep slide deck minimal and highly impact-driven.',
    recurring: false,
    recurringInterval: 'none',
    createdAt: '2026-06-22T09:00:00Z',
    completedAt: null,
    pinned: true,
    favorite: true,
    ...generateAiMetrics('Finalize Hackathon Demo & Deck', 'high', 2.5, '2026-06-25', 'Work')
  },
  {
    id: 't-2',
    title: 'CS302: Complexity Theory Midterm Prep',
    description: 'Review P vs NP complexity classes, Cook-Levin theorem proofs, and solve the past three years of exams.',
    deadline: '2026-06-27',
    priority: 'high',
    estimatedTime: 6,
    category: 'Study',
    subtasks: [
      { id: 'sub-4', title: 'Re-read lecture 8 & 9 slides', completed: false },
      { id: 'sub-5', title: 'Solve 2025 midterm paper', completed: false },
      { id: 'sub-6', title: 'Summarize polynomial time reductions', completed: false }
    ],
    tags: ['Exam', 'CS302', 'Academic'],
    status: 'todo',
    notes: 'Exam is 30% of total grade. Highly critical.',
    recurring: false,
    recurringInterval: 'none',
    createdAt: '2026-06-23T10:30:00Z',
    completedAt: null,
    pinned: false,
    favorite: false,
    ...generateAiMetrics('CS302: Complexity Theory Midterm Prep', 'high', 6, '2026-06-27', 'Study')
  },
  {
    id: 't-3',
    title: 'Review Monthly Cloud Budget & Invoices',
    description: 'Run audit on AWS and Vercel container runtimes. Clean up unused staging databases and dangling images.',
    deadline: '2026-06-23', // OVERDUE
    priority: 'high',
    estimatedTime: 1.5,
    category: 'Finance',
    subtasks: [
      { id: 'sub-7', title: 'Shut down idle staging DBs', completed: true },
      { id: 'sub-8', title: 'Verify invoices on billing panel', completed: false }
    ],
    tags: ['Ops', 'Finance', 'Overdue'],
    status: 'todo',
    notes: 'AWS bill exceeded estimates by $45 this month due to staging endpoints.',
    recurring: true,
    recurringInterval: 'monthly',
    createdAt: '2026-06-15T14:20:00Z',
    completedAt: null,
    pinned: false,
    favorite: false,
    ...generateAiMetrics('Review Monthly Cloud Budget & Invoices', 'high', 1.5, '2026-06-23', 'Finance')
  },
  {
    id: 't-4',
    title: 'Write Technical Architecture Spec',
    description: 'Draft the core system diagrams and API schema endpoints for our scalable notifications engine.',
    deadline: '2026-06-24', // DUE TODAY
    priority: 'medium',
    estimatedTime: 3.5,
    category: 'Work',
    subtasks: [
      { id: 'sub-9', title: 'Draft Mermaid system diagram', completed: true },
      { id: 'sub-10', title: 'Review with Engineering Lead', completed: true },
      { id: 'sub-11', title: 'Export to Notion spec wiki', completed: true }
    ],
    tags: ['System-Design', 'Notion'],
    status: 'completed',
    notes: 'Lead approved the proposed web-sockets failover fallback.',
    recurring: false,
    recurringInterval: 'none',
    createdAt: '2026-06-20T11:00:00Z',
    completedAt: '2026-06-24T10:15:00Z',
    pinned: false,
    favorite: true,
    ...generateAiMetrics('Write Technical Architecture Spec', 'medium', 3.5, '2026-06-24', 'Work')
  },
  {
    id: 't-5',
    title: 'Renew Annual Gym & Wellness Contract',
    description: 'Upgrade to the multi-club premium package to secure the locked-in student rate for another 12 months.',
    deadline: '2026-06-29',
    priority: 'low',
    estimatedTime: 0.5,
    category: 'Personal',
    subtasks: [],
    tags: ['Wellness', 'Admin'],
    status: 'backlog',
    notes: 'Check if they offer corporate matching tier benefits.',
    recurring: false,
    recurringInterval: 'none',
    createdAt: '2026-06-24T08:00:00Z',
    completedAt: null,
    pinned: false,
    favorite: false,
    ...generateAiMetrics('Renew Annual Gym & Wellness Contract', 'low', 0.5, '2026-06-29', 'Personal')
  }
];

const initialGoals: Goal[] = [
  {
    id: 'g-1',
    title: 'Build & Ship "Last Minute Life Saver"',
    type: 'long-term',
    deadline: '2026-08-15',
    progress: 50,
    category: 'Work',
    milestones: [
      { id: 'm-1', title: 'Complete high-fidelity UX mockups', completed: true },
      { id: 'm-2', title: 'Develop persistent React Client Engine', completed: true },
      { id: 'm-3', title: 'Build Voice Assistance & Pomodoro Widget', completed: false },
      { id: 'm-4', title: 'Beta launch on Product Hunt', completed: false }
    ],
    completed: false,
    createdAt: '2026-06-15T12:00:00Z'
  },
  {
    id: 'g-2',
    title: 'Maintain Active Fitness Routine',
    type: 'short-term',
    deadline: '2026-07-15',
    progress: 75,
    category: 'Health',
    milestones: [
      { id: 'm-5', title: 'Log 15 strength workouts in a month', completed: true },
      { id: 'm-6', title: 'Achieve a 5-day cardiorespiratory streak', completed: true },
      { id: 'm-7', title: 'Complete a continuous 5km outdoor run', completed: false }
    ],
    completed: false,
    createdAt: '2026-06-10T12:00:00Z'
  }
];

const initialHabits: Habit[] = [
  {
    id: 'h-1',
    name: 'Daily Coding block',
    frequency: 'daily',
    streak: 8,
    maxStreak: 15,
    history: {
      '2026-06-23': true,
      '2026-06-22': true,
      '2026-06-21': true,
      '2026-06-20': true,
      '2026-06-19': true,
    },
    icon: 'Code',
    color: '#2563EB',
    createdAt: '2026-06-10T08:00:00Z'
  },
  {
    id: 'h-2',
    name: 'Mindful Reading (10 Pages)',
    frequency: 'daily',
    streak: 3,
    maxStreak: 10,
    history: {
      '2026-06-23': true,
      '2026-06-22': true,
      '2026-06-21': false,
      '2026-06-20': true,
    },
    icon: 'BookOpen',
    color: '#10B981',
    createdAt: '2026-06-12T08:00:00Z'
  },
  {
    id: 'h-3',
    name: 'Cardio Core Training (30 Mins)',
    frequency: 'daily',
    streak: 0,
    maxStreak: 6,
    history: {
      '2026-06-23': false,
      '2026-06-22': true,
    },
    icon: 'Dumbbell',
    color: '#F59E0B',
    createdAt: '2026-06-15T08:00:00Z'
  },
  {
    id: 'h-4',
    name: 'Pre-Focus Meditation (10 Mins)',
    frequency: 'daily',
    streak: 5,
    maxStreak: 7,
    history: {
      '2026-06-23': true,
      '2026-06-22': true,
      '2026-06-21': true,
      '2026-06-20': true,
      '2026-06-19': true,
    },
    icon: 'Brain',
    color: '#8B5CF6',
    createdAt: '2026-06-18T08:00:00Z'
  }
];

const initialMessages: CoachMessage[] = [
  {
    id: 'msg-1',
    sender: 'coach',
    text: "Hello! I am your AI Productivity Coach. I'm here to analyze your workflow, prevent procrastination loops, and help you structure high-focus sessions. Let me know what we are tackling today!",
    timestamp: '10:00 AM'
  }
];

const initialNotifications: Notification[] = [
  {
    id: 'n-1',
    title: '⚠️ Procrastination Alert',
    message: 'You have delayed "Review Monthly Cloud Budget & Invoices" three times already. Tackle this today!',
    type: 'alert',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 'n-2',
    title: '🚀 Level Up!',
    message: 'Congratulations! You reached Level 4 by crushing your "Write Technical Architecture Spec" deadline today.',
    type: 'success',
    timestamp: '4 hours ago',
    read: false
  },
  {
    id: 'n-3',
    title: '🤖 Coach Advice',
    message: 'Your morning focus sessions yield 35% faster completions. Try scheduling your midterms study blocks early!',
    type: 'ai',
    timestamp: 'Yesterday',
    read: true
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from local storage or set defaults
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('lmls_user');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('lmls_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('lmls_goals');
    return saved ? JSON.parse(saved) : initialGoals;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('lmls_habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('lmls_schedule');
    return saved ? JSON.parse(saved) : generateSmartSchedule(initialTasks);
  });

  const [messages, setMessages] = useState<CoachMessage[]>(() => {
    const saved = localStorage.getItem('lmls_messages');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('lmls_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // UI state (Do not persist to localStorage necessarily)
  const [currentView, setCurrentViewState] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    const validViews = ['landing', 'auth', 'dashboard', 'tasks', 'scheduler', 'focus', 'habits', 'goals', 'analytics', 'coach', 'settings'];
    if (hash && validViews.includes(hash)) {
      return hash;
    }
    return 'landing';
  });

  const setCurrentView = (view: string) => {
    setCurrentViewState(view);
    if (window.location.hash !== `#${view}`) {
      window.location.hash = view;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validViews = ['landing', 'auth', 'dashboard', 'tasks', 'scheduler', 'focus', 'habits', 'goals', 'analytics', 'coach', 'settings'];
      if (hash && validViews.includes(hash)) {
        if (hash !== currentView) {
          setCurrentViewState(hash);
        }
      } else if (!hash && currentView !== 'landing') {
        setCurrentViewState('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Initial sync
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && initialHash !== currentView) {
      handleHashChange();
    } else if (!initialHash && window.location.hash !== '#landing') {
      window.location.hash = currentView;
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [currentView]);

  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot' | 'otp'>('login');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Active theme and simulations loaded from local storage
  const [activeTheme, setActiveThemeState] = useState<'basic' | 'glass-light' | 'gradient-light'>(() => {
    const saved = localStorage.getItem('lmls_theme');
    if (saved === 'glass-light' || saved === 'gradient-light' || saved === 'basic') {
      return saved;
    }
    return 'basic';
  });

  const [activeSimulation, setActiveSimulationState] = useState<'none' | 'orbits' | 'ripples' | 'neural' | 'digitalRain' | 'waves'>(() => {
    const saved = localStorage.getItem('lmls_simulation');
    return (saved as 'none' | 'orbits' | 'ripples' | 'neural' | 'digitalRain' | 'waves') || 'waves';
  });

  const setActiveTheme = (theme: 'basic' | 'glass-light' | 'gradient-light') => {
    setActiveThemeState(theme);
    localStorage.setItem('lmls_theme', theme);
  };

  const setActiveSimulation = (sim: 'none' | 'orbits' | 'ripples' | 'neural' | 'digitalRain' | 'waves') => {
    setActiveSimulationState(sim);
    localStorage.setItem('lmls_simulation', sim);
  };

  const [isSidebarCollapsed, setIsSidebarCollapsedState] = useState<boolean>(() => {
    const saved = localStorage.getItem(`lmls_sidebar_collapsed_${user?.email || 'default'}`);
    return saved === 'true';
  });

  const setIsSidebarCollapsed = (collapsed: boolean) => {
    setIsSidebarCollapsedState(collapsed);
    localStorage.setItem(`lmls_sidebar_collapsed_${user?.email || 'default'}`, collapsed ? 'true' : 'false');
  };

  useEffect(() => {
    const saved = localStorage.getItem(`lmls_sidebar_collapsed_${user?.email || 'default'}`);
    setIsSidebarCollapsedState(saved === 'true');
  }, [user?.email]);

  // Focus Timer state
  const [focusSessionTime, setFocusSessionTime] = useState<number>(1500); // 25 mins default
  const [focusTimeLeft, setFocusTimeLeft] = useState<number>(1500);
  const [focusTimerActive, setFocusTimerActive] = useState<boolean>(false);
  const [focusSound, setFocusSound] = useState<'none' | 'lofi' | 'nature' | 'rain' | 'ambient'>('none');

  // Micro-interaction states
  const [undoTask, setUndoTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [triggerConfetti, setTriggerConfetti] = useState<boolean>(false);

  // Save to localStorage whenever elements change
  useEffect(() => {
    localStorage.setItem('lmls_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('lmls_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('lmls_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('lmls_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('lmls_schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('lmls_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('lmls_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Handle Focus Mode countdown ticker
  useEffect(() => {
    let interval: any = null;
    if (focusTimerActive && focusTimeLeft > 0) {
      interval = setInterval(() => {
        setFocusTimeLeft((prev) => {
          if (prev <= 1) {
            setFocusTimerActive(false);
            // Play physical chime synthesized sound
            try {
              audioEngine.playSessionEndChime();
            } catch (e) {
              console.warn('Web Audio Playback blocked or failed:', e);
            }
            // Completed session award XP!
            awardXp(120, 'Focused Pomodoro Block Completed');
            addNotification(
              '🎯 Focus Session Completed!',
              `Excellent work! You completed your ${focusSessionTime / 60}-minute deep focus block and earned 120 XP.`,
              'success'
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [focusTimerActive, focusTimeLeft]);

  // Sync ambient sound to Web Audio Engine based on focusSound selection and activity state
  useEffect(() => {
    if (focusSound !== 'none' && focusTimerActive) {
      try {
        audioEngine.setSound(focusSound);
      } catch (e) {
        console.warn('Web Audio ambient deck set failure:', e);
      }
    } else {
      try {
        audioEngine.stop();
      } catch (e) {}
    }
    return () => {
      try {
        audioEngine.stop();
      } catch (e) {}
    };
  }, [focusSound, focusTimerActive]);

  // Show dynamic self-fading toasts
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);
    return () => clearTimeout(timer);
  };

  // Gamification: Award XP and trigger level-ups
  const awardXp = (amount: number, reason: string) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newXpToNext = prev.xpToNextLevel;
      let levelUpTriggered = false;

      if (newXp >= prev.xpToNextLevel) {
        newLevel += 1;
        levelUpTriggered = true;
        // Increase target exponentially or statically
        newXpToNext = Math.round(prev.xpToNextLevel * 1.25);
        
        // Trigger Level-up effects
        setTriggerConfetti(true);
        addNotification(
          '🎉 LEVEL UP!',
          `Incredible progression! You've climbed to Level ${newLevel}. Your focus muscles are expanding!`,
          'success'
        );
        showToast(`🎉 Level Up! You reached Level ${newLevel}!`, 'success');
      } else {
        showToast(`+${amount} XP: ${reason}`, 'success');
      }

      return {
        ...prev,
        level: newLevel,
        xp: levelUpTriggered ? newXp - prev.xpToNextLevel : newXp,
        xpToNextLevel: newXpToNext,
      };
    });
  };

  // Add a Task (Includes custom priority generation automatically)
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'aiPriorityScore' | 'aiUrgency' | 'aiDifficulty' | 'aiRiskLevel' | 'aiSuggestedStart' | 'aiExplanation' | 'pinned' | 'favorite'>) => {
    const aiMetrics = generateAiMetrics(
      taskData.title,
      taskData.priority,
      taskData.estimatedTime,
      taskData.deadline,
      taskData.category
    );

    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString(),
      completedAt: null,
      pinned: false,
      favorite: false,
      ...aiMetrics
    };

    setTasks((prev) => [newTask, ...prev]);
    awardXp(40, 'Task Registered');
    addNotification('🤖 Companion Analysis', `Assessed "${newTask.title}". Generated Priority Score: ${newTask.aiPriorityScore}% [Urgency: ${newTask.aiUrgency}]`, 'ai');
    showToast(`Task "${newTask.title}" added with AI metrics!`, 'success');
  };

  // Update a Task
  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          // If title, priority, estimatedTime, deadline, or category changes, recompute AI metrics
          const shouldRecompute = 
            updates.title !== undefined ||
            updates.priority !== undefined ||
            updates.estimatedTime !== undefined ||
            updates.deadline !== undefined ||
            updates.category !== undefined;

          const baseTask = { ...t, ...updates };
          
          if (shouldRecompute) {
            const aiMetrics = generateAiMetrics(
              baseTask.title,
              baseTask.priority,
              baseTask.estimatedTime,
              baseTask.deadline,
              baseTask.category
            );
            return { ...baseTask, ...aiMetrics };
          }

          // If completed state just flipped
          if (updates.status === 'completed' && t.status !== 'completed') {
            baseTask.completedAt = new Date().toISOString();
            // Complete subtasks too
            baseTask.subtasks = t.subtasks.map(st => ({ ...st, completed: true }));
            
            // Calculate XP based on due date
            const today = new Date('2026-06-24');
            const deadline = new Date(t.deadline);
            const isLate = deadline.getTime() < today.getTime();
            
            const xpReward = isLate ? 60 : 100;
            const streakAdd = isLate ? 0 : 1;
            
            setTimeout(() => {
              awardXp(xpReward, isLate ? 'Task Completed Late' : 'Task Completed On Time');
              if (!isLate) {
                setUser(u => ({ ...u, dailyStreak: u.dailyStreak + streakAdd }));
              }
              addNotification(
                isLate ? '⏱️ Task Completed' : '🚀 Deadline Defeated!',
                `Completed "${t.title}"! Earned ${xpReward} XP.`,
                'success'
              );
            }, 100);
          } else if (updates.status !== 'completed' && t.status === 'completed') {
            baseTask.completedAt = null;
          }

          return baseTask;
        }
        return t;
      })
    );
    showToast('Task updated successfully!', 'info');
  };

  // Delete Task with Undo option
  const deleteTask = (id: string) => {
    const targetTask = tasks.find(t => t.id === id);
    if (targetTask) {
      setUndoTask(targetTask);
      setTasks(prev => prev.filter(t => t.id !== id));
      showToast(`Deleted "${targetTask.title}"`, 'warning');
      
      // Auto-clear undo state after 10 seconds
      setTimeout(() => {
        setUndoTask(null);
      }, 10000);
    }
  };

  // Restore deleted task (Undo functionality)
  const undoDelete = () => {
    if (undoTask) {
      setTasks(prev => [undoTask, ...prev]);
      showToast(`Restored "${undoTask.title}"`, 'success');
      setUndoTask(null);
    }
  };

  // Duplicate a task
  const duplicateTask = (id: string) => {
    const target = tasks.find(t => t.id === id);
    if (target) {
      const duplicated: Task = {
        ...target,
        id: `t-${Date.now()}`,
        title: `${target.title} (Copy)`,
        createdAt: new Date().toISOString(),
        completedAt: null,
        subtasks: target.subtasks.map(st => ({ ...st, id: `sub-${Date.now()}-${Math.random()}` }))
      };
      setTasks(prev => [duplicated, ...prev]);
      showToast(`Duplicated "${target.title}"`, 'success');
    }
  };

  const togglePinTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
    showToast('Task pin status updated', 'info');
  };

  const toggleFavoriteTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, favorite: !t.favorite } : t));
    showToast('Task added to favorites', 'info');
  };

  // Goals CRUD
  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'completed' | 'progress'>) => {
    const newGoal: Goal = {
      ...goalData,
      id: `g-${Date.now()}`,
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setGoals(prev => [newGoal, ...prev]);
    awardXp(50, 'New Goal Defined');
    showToast(`Goal "${newGoal.title}" created!`, 'success');
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const updatedGoal = { ...g, ...updates };
        if (updates.milestones) {
          const completedCount = updates.milestones.filter(m => m.completed).length;
          updatedGoal.progress = Math.round((completedCount / updates.milestones.length) * 100) || 0;
          updatedGoal.completed = updatedGoal.progress === 100;
          
          if (updatedGoal.completed && !g.completed) {
            setTimeout(() => {
              awardXp(200, 'Goal Fully Completed');
              addNotification('🏆 Goal Accomplished!', `Outstanding! You fully hit your goal: "${g.title}"!`, 'success');
            }, 100);
          }
        }
        return updatedGoal;
      }
      return g;
    }));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    showToast('Goal removed', 'warning');
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const updatedMilestones = goal.milestones.map(m => 
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      updateGoal(goalId, { milestones: updatedMilestones });
    }
  };

  // Habits Logic
  const addHabit = (habitData: Omit<Habit, 'id' | 'streak' | 'maxStreak' | 'history' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `h-${Date.now()}`,
      streak: 0,
      maxStreak: 0,
      history: {},
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [newHabit, ...prev]);
    awardXp(30, 'Habit Created');
    showToast(`Habit "${newHabit.name}" initialized!`, 'success');
  };

  const toggleHabit = (id: string, date: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const wasCompleted = !!h.history[date];
        const newHistory = { ...h.history, [date]: !wasCompleted };
        
        // Recalculate streak
        let currentStreak = h.streak;
        if (!wasCompleted) {
          currentStreak += 1;
          setTimeout(() => {
            awardXp(15, `Habit Streak: ${h.name}`);
          }, 100);
        } else {
          currentStreak = Math.max(0, currentStreak - 1);
        }
        
        const maxStreak = Math.max(h.maxStreak, currentStreak);
        
        return {
          ...h,
          history: newHistory,
          streak: currentStreak,
          maxStreak
        };
      }
      return h;
    }));
    showToast('Habit log updated', 'success');
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    showToast('Habit removed', 'warning');
  };

  // Smart Scheduler Logic
  const regenerateSchedule = () => {
    const newSchedule = generateSmartSchedule(tasks);
    setSchedule(newSchedule);
    awardXp(20, 'Scheduler Refreshed');
    showToast('Dynamic schedule compiled for today!', 'success');
  };

  const toggleScheduleItem = (id: string) => {
    setSchedule(prev => prev.map(item => {
      if (item.id === id) {
        const newCompleted = !item.completed;
        if (newCompleted) {
          setTimeout(() => {
            awardXp(15, 'Schedule block checked off');
          }, 100);
        }
        return { ...item, completed: newCompleted };
      }
      return item;
    }));
  };

  const addScheduleItem = (itemData: Omit<ScheduleItem, 'id' | 'completed'>) => {
    const newItem: ScheduleItem = {
      ...itemData,
      id: `sched-${Date.now()}`,
      completed: false
    };
    setSchedule(prev => {
      const updated = [...prev, newItem];
      return updated.sort((a, b) => a.startTime.localeCompare(b.startTime));
    });
    showToast(`Added custom event: ${newItem.title}`, 'success');
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
    showToast('Schedule event removed', 'warning');
  };

  const updateScheduleItem = (id: string, updates: Partial<ScheduleItem>) => {
    setSchedule(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    showToast('Schedule event updated', 'success');
  };

  // AI Assistant Chat Messages
  const addMessage = (text: string, sender: 'user' | 'coach') => {
    const newMessage: CoachMessage = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([initialMessages[0]]);
    showToast('Chat history cleared', 'info');
  };

  // Notification actions
  const addNotification = (title: string, message: string, type: 'alert' | 'success' | 'info' | 'ai') => {
    const newNotif: Notification = {
      id: `n-${Date.now()}`,
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('Notifications cleared', 'info');
  };

  const loginUser = (email: string, name: string, startFresh: boolean) => {
    const newUserProfile: UserProfile = {
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
      level: 1,
      xp: 0,
      xpToNextLevel: 1000,
      badges: ['First Step'],
      dailyStreak: 1,
    };
    setUser(newUserProfile);
    
    if (startFresh) {
      setTasks([]);
      setGoals([]);
      setHabits([]);
      setSchedule([]);
      setMessages([]);
      setNotifications([
        {
          id: 'n-welcome',
          title: 'Welcome to your Workspace!',
          message: `Hi ${name}, this is your custom, clean slate. Feel free to add tasks, build goals, and establish habits.`,
          type: 'success',
          timestamp: 'Just now',
          read: false
        }
      ]);
      showToast(`Welcome, ${name}! Fresh workspace initialized.`, 'success');
    } else {
      // Keep initial tasks but update user profile name
      setTasks(initialTasks);
      setGoals(initialGoals);
      setHabits(initialHabits);
      setSchedule(generateSmartSchedule(initialTasks));
      setMessages(initialMessages);
      setNotifications([
        {
          id: 'n-welcome-demo',
          title: 'Welcome back!',
          message: `Hi ${name}, we have loaded the standard demo seeds for you.`,
          type: 'info',
          timestamp: 'Just now',
          read: false
        }
      ]);
      showToast(`Welcome back, ${name}! Standard workspace loaded.`, 'success');
    }
    setCurrentView('dashboard');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      if (updates.name && updates.name !== prev.name) {
        updated.avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(updates.name)}`;
      }
      return updated;
    });
    showToast('Profile credentials saved successfully!', 'success');
  };

  const logout = () => {
    setCurrentView('landing');
    showToast('Logged out of session', 'info');
  };

  const resetAllData = () => {
    localStorage.removeItem('lmls_user');
    localStorage.removeItem('lmls_tasks');
    localStorage.removeItem('lmls_goals');
    localStorage.removeItem('lmls_habits');
    localStorage.removeItem('lmls_schedule');
    localStorage.removeItem('lmls_messages');
    localStorage.removeItem('lmls_notifications');
    
    setUser(initialUserProfile);
    setTasks(initialTasks);
    setGoals(initialGoals);
    setHabits(initialHabits);
    setSchedule(generateSmartSchedule(initialTasks));
    setMessages(initialMessages);
    setNotifications(initialNotifications);
    
    showToast('Database reset to initial demo seeds', 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        tasks,
        goals,
        habits,
        schedule,
        messages,
        notifications,
        currentView,
        authView,
        isDarkMode,
        searchQuery,
        isSearchOpen,
        activeTaskId,
        focusTimeLeft,
        focusTimerActive,
        focusSessionTime,
        focusSound,
        undoTask,
        toast,
        triggerConfetti,
        activeTheme,
        activeSimulation,
        isSidebarCollapsed,
        
        setCurrentView,
        setAuthView,
        setIsDarkMode,
        setSearchQuery,
        setIsSearchOpen,
        setActiveTaskId,
        setFocusTimeLeft,
        setFocusTimerActive,
        setFocusSessionTime,
        setFocusSound,
        setTriggerConfetti,
        setActiveTheme,
        setActiveSimulation,
        setIsSidebarCollapsed,
        
        addTask,
        updateTask,
        deleteTask,
        duplicateTask,
        togglePinTask,
        toggleFavoriteTask,
        undoDelete,
        
        addGoal,
        updateGoal,
        deleteGoal,
        toggleMilestone,
        
        addHabit,
        toggleHabit,
        deleteHabit,
        
        regenerateSchedule,
        toggleScheduleItem,
        addScheduleItem,
        deleteScheduleItem,
        updateScheduleItem,
        
        addMessage,
        clearMessages,
        
        addNotification,
        markNotificationAsRead,
        clearNotifications,
        
        showToast,
        awardXp,
        loginUser,
        updateUserProfile,
        logout,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
