export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD or ISO
  priority: TaskPriority;
  estimatedTime: number; // in hours
  category: string;
  subtasks: SubTask[];
  tags: string[];
  status: TaskStatus;
  notes: string;
  recurring: boolean;
  recurringInterval: 'daily' | 'weekly' | 'monthly' | 'none';
  createdAt: string;
  completedAt: string | null;
  pinned: boolean;
  favorite: boolean;
  
  // AI Engine Metrics
  aiPriorityScore: number; // 0-100
  aiUrgency: 'low' | 'medium' | 'high' | 'critical';
  aiDifficulty: 'easy' | 'moderate' | 'challenging' | 'hard';
  aiRiskLevel: 'low' | 'moderate' | 'high' | 'extreme';
  aiSuggestedStart: string;
  aiExplanation: string;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  type: 'short-term' | 'long-term';
  deadline: string;
  progress: number; // 0 - 100
  category: string;
  milestones: Milestone[];
  completed: boolean;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  maxStreak: number;
  history: Record<string, boolean>; // 'YYYY-MM-DD' -> true/false
  icon: string; // Lucide icon name
  color: string; // Tailwind hex or class color
  createdAt: string;
}

export interface ScheduleItem {
  id: string;
  taskId: string | null;
  title: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  type: 'task' | 'routine' | 'break' | 'focus';
  completed: boolean;
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'success' | 'info' | 'ai';
  timestamp: string;
  read: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  badges: string[];
  dailyStreak: number;
}
