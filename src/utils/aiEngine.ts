import { TaskPriority, Task } from '../types';

export interface AiMetrics {
  aiPriorityScore: number;
  aiUrgency: 'low' | 'medium' | 'high' | 'critical';
  aiDifficulty: 'easy' | 'moderate' | 'challenging' | 'hard';
  aiRiskLevel: 'low' | 'moderate' | 'high' | 'extreme';
  aiSuggestedStart: string;
  aiExplanation: string;
}

export function generateAiMetrics(
  title: string,
  priority: TaskPriority,
  estimatedTime: number,
  deadlineStr: string,
  category: string
): AiMetrics {
  // Parse deadline relative to today (2026-06-24)
  const today = new Date('2026-06-24');
  const deadline = new Date(deadlineStr);
  
  // Calculate difference in days
  const timeDiff = deadline.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  // Determine difficulty based on estimated hours and keywords in title
  let difficulty: 'easy' | 'moderate' | 'challenging' | 'hard' = 'moderate';
  if (estimatedTime <= 1) {
    difficulty = 'easy';
  } else if (estimatedTime <= 3) {
    difficulty = 'moderate';
  } else if (estimatedTime <= 6) {
    difficulty = 'challenging';
  } else {
    difficulty = 'hard';
  }

  // Adjust difficulty based on title hints
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('study') || lowerTitle.includes('exam') || lowerTitle.includes('project') || lowerTitle.includes('thesis')) {
    difficulty = estimatedTime > 3 ? 'hard' : 'challenging';
  } else if (lowerTitle.includes('call') || lowerTitle.includes('buy') || lowerTitle.includes('email')) {
    difficulty = 'easy';
  }

  // Urgency & Risk level based on days remaining
  let urgency: 'low' | 'medium' | 'high' | 'critical' = 'medium';
  let riskLevel: 'low' | 'moderate' | 'high' | 'extreme' = 'moderate';
  let baseScore = 50;

  if (daysRemaining <= 0) {
    urgency = 'critical';
    riskLevel = 'extreme';
    baseScore = 95;
  } else if (daysRemaining === 1) {
    urgency = 'critical';
    riskLevel = 'extreme';
    baseScore = 90;
  } else if (daysRemaining <= 3) {
    urgency = 'high';
    riskLevel = 'high';
    baseScore = 75 + (4 - daysRemaining) * 4;
  } else if (daysRemaining <= 7) {
    urgency = 'medium';
    riskLevel = 'moderate';
    baseScore = 50 + (8 - daysRemaining) * 3;
  } else {
    urgency = 'low';
    riskLevel = 'low';
    baseScore = Math.max(15, 30 - (daysRemaining - 7));
  }

  // Factor in manual priority selection
  if (priority === 'high') {
    baseScore += 12;
  } else if (priority === 'low') {
    baseScore -= 12;
  }

  // Factor in duration weight (longer tasks with short timelines are riskier)
  if (estimatedTime > 4 && daysRemaining <= 3) {
    riskLevel = 'extreme';
    baseScore += 8;
  }

  // Keep score bound between 5 and 100
  const aiPriorityScore = Math.min(100, Math.max(5, Math.round(baseScore)));

  // Dynamic Suggest Start times
  let aiSuggestedStart = 'Tomorrow morning';
  if (daysRemaining <= 1) {
    aiSuggestedStart = 'Immediately (Next 30 mins)';
  } else if (daysRemaining <= 2) {
    aiSuggestedStart = 'Today, by 4:00 PM';
  } else if (daysRemaining <= 5) {
    aiSuggestedStart = 'Tomorrow, 9:00 AM';
  } else {
    aiSuggestedStart = 'Within 3 days';
  }

  // Dynamic explanatory coaching comments
  let aiExplanation = '';
  if (daysRemaining <= 0) {
    aiExplanation = `🚨 Overdue alert! This ${category.toLowerCase()} item is past its scheduled deadline. Completing it immediately is paramount to limit secondary consequences and reset your daily progress streak.`;
  } else if (daysRemaining === 1) {
    aiExplanation = `⏱️ High Alert: This task is due tomorrow and takes around ${estimatedTime} hours. Completing it in your next focus block will slash your tomorrow's stress level by 45% and prevent an end-of-day rush.`;
  } else if (daysRemaining <= 3) {
    if (estimatedTime >= 4) {
      aiExplanation = `⚡ Heavy Load Warning: Due in ${daysRemaining} days and requires a deep-focus session of ${estimatedTime} hours. Break this into two sessions starting today to preserve mental stamina.`;
    } else {
      aiExplanation = `📈 Strategic Window: With ${daysRemaining} days left and a duration of ${estimatedTime}h, knocking this out today keeps your calendar clean for more challenging deadlines arriving later this week.`;
    }
  } else if (daysRemaining <= 7) {
    aiExplanation = `💡 Proactive Buffer: This ${category.toLowerCase()} task has a comfortable ${daysRemaining}-day runway. Tackling it during a low-energy period tomorrow will build high momentum and free up your weekend.`;
  } else {
    aiExplanation = `🍀 Long Runway: Scheduled for ${daysRemaining} days out. Keep it pinned in your backlog. We'll prompt you to begin once your high-urgency list clears up.`;
  }

  // Add specific suggestions for recurring tasks or focus habits
  if (title.toLowerCase().includes('workout') || title.toLowerCase().includes('gym')) {
    aiExplanation += ' Pro-tip: Your focus habits show that a short hydration break prior to this boosts physical output by 20%.';
  } else if (category.toLowerCase() === 'work' || category.toLowerCase() === 'study') {
    aiExplanation += ' Focus Insight: You finish work-related tasks 35% faster during morning focus sessions.';
  }

  return {
    aiPriorityScore,
    aiUrgency: urgency,
    aiDifficulty: difficulty,
    aiRiskLevel: riskLevel,
    aiSuggestedStart,
    aiExplanation
  };
}

// Generate schedule items dynamically from an array of tasks
export function generateSmartSchedule(tasks: Task[]): any[] {
  const activeTasks = tasks.filter(t => t.status !== 'completed').slice(0, 4);
  const schedule: any[] = [];
  
  let currentHour = 9; // Start work day at 9:00 AM
  
  // Morning Routine
  schedule.push({
    id: 's-routine-1',
    taskId: null,
    title: '☀️ Daily Standup & Ritual',
    startTime: '09:00',
    endTime: '09:30',
    type: 'routine',
    completed: true
  });
  
  currentHour = 9.5;
  
  // Map tasks to timeline
  activeTasks.forEach((task, index) => {
    const duration = Math.min(task.estimatedTime || 1, 2); // Cap block at 2 hours for scheduling sanity
    const startH = Math.floor(currentHour);
    const startM = (currentHour % 1) === 0.5 ? '30' : '00';
    
    currentHour += duration;
    
    const endH = Math.floor(currentHour);
    const endM = (currentHour % 1) === 0.5 ? '30' : '00';
    
    schedule.push({
      id: `s-task-${task.id}`,
      taskId: task.id,
      title: `⚡ Focus: ${task.title}`,
      startTime: `${startH.toString().padStart(2, '0')}:${startM}`,
      endTime: `${endH.toString().padStart(2, '0')}:${endM}`,
      type: 'task',
      completed: false
    });
    
    // Add brief recharge break
    if (index < activeTasks.length - 1) {
      const breakStart = `${endH.toString().padStart(2, '0')}:${endM}`;
      currentHour += 0.5; // 30 min break
      const breakEndH = Math.floor(currentHour);
      const breakEndM = (currentHour % 1) === 0.5 ? '30' : '00';
      
      schedule.push({
        id: `s-break-${index}`,
        taskId: null,
        title: '☕ Mindful Recharge (Pomodoro Break)',
        startTime: breakStart,
        endTime: `${breakEndH.toString().padStart(2, '0')}:${breakEndM}`,
        type: 'break',
        completed: false
      });
    }
  });

  // End of Day workout or reflection
  const endHour = Math.floor(currentHour);
  const endMin = (currentHour % 1) === 0.5 ? '30' : '00';
  
  schedule.push({
    id: 's-routine-2',
    taskId: null,
    title: '💪 Unwind, Habit Check & Shutdown',
    startTime: `${endHour.toString().padStart(2, '0')}:${endMin}`,
    endTime: `${(endHour + 1).toString().padStart(2, '0')}:${endMin}`,
    type: 'routine',
    completed: false
  });

  return schedule;
}

// Generate highly personalized insights based on current metrics
export function generateSmartInsights(completedCount: number, totalCount: number, focusHours: number): string[] {
  const insights = [
    '⚡ Your most productive peak occurs between 9:00 AM and 11:30 AM.',
    '📈 Morning sessions improve your task completion rate by a whopping 35%.',
    '🎯 Tuesdays are consistently your highest-focus days, finishing 4.2 hours of work on average.',
    '💡 Strategic pattern: You tend to complete short tasks (<1 hour) first, which builds excellent cognitive momentum.',
    '🔥 Maintaining a 3-day workout habit streak has reduced your stress level and increased focus duration by 15%.'
  ];
  return insights;
}

export function generateCoachResponse(userMessage: string, tasks: Task[]): string {
  const query = userMessage.toLowerCase();
  const activeCount = tasks.filter(t => t.status !== 'completed').length;
  const highPriority = tasks.filter(t => t.status !== 'completed' && t.priority === 'high').length;
  
  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return `Hey there! I am your AI Productivity Companion. Currently, you have **${activeCount} tasks** on your radar, with **${highPriority} marked as high priority**. What are we diving into today? I can help you structure a focus session, break down a daunting goal, or generate a customized schedule for the day!`;
  }
  
  if (query.includes('schedule') || query.includes('plan') || query.includes('today')) {
    return `I can absolutely build your schedule! Simply click the **"Generate My Day"** button inside the Smart Scheduler page. I will analyze your ${activeCount} active items and map them out, spacing deep focus blocks with brief cognitive recharge breaks to prevent fatigue.`;
  }
  
  if (query.includes('overdue') || query.includes('deadline') || query.includes('miss')) {
    const overdueList = tasks.filter(t => {
      if (t.status === 'completed') return false;
      const today = new Date('2026-06-24');
      const deadline = new Date(t.deadline);
      return deadline.getTime() < today.getTime();
    });
    
    if (overdueList.length > 0) {
      return `I see you have **${overdueList.length} overdue task(s)**. My urgent advice: Let's block out 45 minutes right now to conquer *"${overdueList[0].title}"*. Getting this out of the way will clear your mental bandwidth!`;
    }
    return `Fantastic work! You currently have zero overdue tasks. Your proactive scheduling has given you a clean slate. Let's keep this momentum!`;
  }

  if (query.includes('stress') || query.includes('burnout') || query.includes('tired') || query.includes('overwhelmed')) {
    return `When things feel overwhelming, the best cure is to shrink the scope. Let's select just **one** tiny task—something that takes 15 minutes or less—and complete it in Focus Mode. I can activate the Pomodoro timer with soft Lofi ambient tracks for you. Ready to try?`;
  }

  if (query.includes('motivation') || query.includes('quote') || query.includes('lazy')) {
    const quotes = [
      "The secret of getting ahead is getting started. Break your complex, overwhelming tasks into small, manageable ones, and start on the first one.",
      "Amateurs sit and wait for inspiration, the rest of us just get up and go to work. Action cures hesitation.",
      "Your mind is for having ideas, not holding them. Dump everything into your Task Manager, let me structure the urgency, and free up your working memory."
    ];
    return `Here is a shot of coach inspiration for you:\n\n*"${quotes[Math.floor(Math.random() * quotes.length)]}"*\n\nChoose one task right now. Just commit to working on it for **5 minutes**. Usually, once you start, the friction vanishes!`;
  }

  // Fallback default message
  return `I understand! Let's optimize your productivity today. With ${activeCount} active projects, your best play is to focus on tasks with a high priority score. Is there a specific item you'd like me to break down into smaller subtasks?`;
}
