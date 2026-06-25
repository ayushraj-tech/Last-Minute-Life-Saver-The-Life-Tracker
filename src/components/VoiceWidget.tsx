import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Play, Send, Sparkles, X, Volume2, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VoiceWidget: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { 
    addTask, setCurrentView, showToast, tasks, updateTask,
    setFocusTimerActive, setFocusSound
  } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [simulatedText, setSimulatedText] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [statusText, setStatusText] = useState('Click start or type a command');
  const [waveHeights, setWaveHeights] = useState<number[]>([10, 10, 10, 10, 10, 10, 10]);
  
  const recognitionRef = useRef<any>(null);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Stop any pending speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis failed or blocked by browser policies:', err);
      }
    }
  };

  const processCommandRef = useRef<(cmd: string) => void>(() => {});
  useEffect(() => {
    processCommandRef.current = processCommand;
  }, [processCommand]);

  useEffect(() => {
    // Check Speech Recognition support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setStatusText('Listening carefully...');
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        processCommandRef.current(text);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setStatusText('Microphone blocked. Please open in a new tab or use manual input below.');
        } else {
          setStatusText(`Voice error: ${event.error}. Try using text fallback below.`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    } else {
      setVoiceSupported(false);
      setStatusText('Native voice not supported on this browser. Try manual simulation below!');
    }

    // Abort active speech recognition session on unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (err) {
          console.warn('Error aborting speech recognition:', err);
        }
      }
    };
  }, []);

  // Animate speech waves when listening
  useEffect(() => {
    let interval: any = null;
    if (isListening) {
      interval = setInterval(() => {
        setWaveHeights(Array.from({ length: 12 }).map(() => Math.floor(Math.random() * 40) + 8));
      }, 100);
    } else {
      setWaveHeights(Array.from({ length: 12 }).map(() => 8));
    }
    return () => clearInterval(interval);
  }, [isListening]);

  const toggleListening = () => {
    if (!voiceSupported) {
      showToast('Native Speech Recognition not supported. Use text panel!', 'info');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  function processCommand(cmdText: string) {
    const text = cmdText.trim().toLowerCase();
    
    if (text.startsWith('add task') || text.startsWith('create task')) {
      const taskTitle = cmdText.replace(/^(add task|create task)/i, '').trim();
      if (taskTitle) {
        addTask({
          title: taskTitle.charAt(0).toUpperCase() + taskTitle.slice(1),
          description: 'Created via AI Voice Assistant command.',
          deadline: '2026-06-26', // Default tomorrow
          priority: 'medium',
          estimatedTime: 1.0,
          category: 'Work',
          subtasks: [],
          tags: ['Voice-Command'],
          status: 'todo',
          notes: 'Added using speech synthesis integration.',
          recurring: false,
          recurringInterval: 'none'
        });
        const reply = `Successfully added task: ${taskTitle}`;
        setStatusText(reply);
        speakText(reply);
        showToast(reply, 'success');
      } else {
        const reply = "I heard you wanted to add a task, but couldn't catch the title. Try saying: add task, prepare slide deck.";
        setStatusText(reply);
        speakText(reply);
      }
    } 
    else if (text.includes('go to schedule') || text.includes('show schedule') || text.includes('open schedule') || text.includes('planner') || text.includes('schedule') || text.includes('timetable') || text.includes('roadmap')) {
      setCurrentView('scheduler');
      const reply = "Navigated to your Smart Planner and Scheduler Deck.";
      setStatusText(reply);
      speakText(reply);
      showToast(reply, 'info');
    } 
    else if (text.includes('go to habits') || text.includes('show habits') || text.includes('habits')) {
      setCurrentView('habits');
      const reply = "Opening your Daily Habits and Streak tracker.";
      setStatusText(reply);
      speakText(reply);
      showToast(reply, 'info');
    }
    else if (text.includes('go to goals') || text.includes('show goals') || text.includes('goals') || text.includes('objectives')) {
      setCurrentView('goals');
      const reply = "Navigating to your long-term Goals and Milestones.";
      setStatusText(reply);
      speakText(reply);
      showToast(reply, 'info');
    }
    else if (text.includes('go to analytics') || text.includes('show analytics') || text.includes('analytics') || text.includes('charts')) {
      setCurrentView('analytics');
      const reply = "Opening your Performance Analytics dashboard.";
      setStatusText(reply);
      speakText(reply);
      showToast(reply, 'info');
    }
    else if (text.includes('go to settings') || text.includes('show settings') || text.includes('settings') || text.includes('preferences')) {
      setCurrentView('settings');
      const reply = "Opening your System Settings panel.";
      setStatusText(reply);
      speakText(reply);
      showToast(reply, 'info');
    }
    else if (text.includes('dashboard') || text.includes('home') || text.includes('go home')) {
      setCurrentView('dashboard');
      const reply = "Navigated to your central Dashboard.";
      setStatusText(reply);
      speakText(reply);
      showToast(reply, 'info');
    } 
    else if (text.includes('complete task') || text.includes('finish task') || text.includes('check off task')) {
      const todoTasks = tasks.filter(t => t.status !== 'completed');
      if (todoTasks.length > 0) {
        updateTask(todoTasks[0].id, { status: 'completed' });
        const reply = `Marked task: ${todoTasks[0].title}, as completed. Great job!`;
        setStatusText(reply);
        speakText(reply);
        showToast(reply, 'success');
      } else {
        const reply = 'You have no active tasks left to complete! Excellent work!';
        setStatusText(reply);
        speakText(reply);
        showToast(reply, 'info');
      }
    } 
    else if (text.includes('start focus') || text.includes('start timer') || text.includes('start session') || text.includes('resume timer') || text.includes('play focus')) {
      setCurrentView('focus');
      setFocusTimerActive(true);
      const reply = "Starting your Deep Focus session countdown. Stay locked in!";
      setStatusText(reply);
      speakText(reply);
      showToast(reply, 'success');
    }
    else if (text.includes('pause focus') || text.includes('pause timer') || text.includes('pause session') || text.includes('stop focus') || text.includes('stop timer')) {
      setFocusTimerActive(false);
      const reply = "Focus session paused.";
      setStatusText(reply);
      speakText(reply);
      showToast(reply, 'info');
    }
    else if (text.includes('play lofi') || text.includes('lofi beats') || text.includes('play music')) {
      setCurrentView('focus');
      setFocusSound('lofi');
      setFocusTimerActive(true);
      const reply = "Tuning into relaxing Lofi Beats and starting focus clock.";
      setStatusText(reply);
      speakText(reply);
      showToast(reply, 'success');
    }
    else if (text.includes('play rain') || text.includes('heavy rain') || text.includes('play water')) {
      setCurrentView('focus');
      setFocusSound('rain');
      setFocusTimerActive(true);
      const reply = "Enabling heavy rain ambience and starting focus clock.";
      setStatusText(reply);
      speakText(reply);
      showToast(reply, 'success');
    }
    else if (text.includes('play nature') || text.includes('forest wind') || text.includes('play wind')) {
      setCurrentView('focus');
      setFocusSound('nature');
      setFocusTimerActive(true);
      const reply = "Starting forest wind soundscape and focus clock.";
      setStatusText(reply);
      speakText(reply);
      showToast(reply, 'success');
    }
    else if (text.includes('play cosmic') || text.includes('space synth') || text.includes('cosmic synth')) {
      setCurrentView('focus');
      setFocusSound('ambient');
      setFocusTimerActive(true);
      const reply = "Enabling cosmic space synthesizer and starting focus clock.";
      setStatusText(reply);
      speakText(reply);
      showToast(reply, 'success');
    }
    else if (text.includes('stop music') || text.includes('silence') || text.includes('mute music')) {
      setFocusSound('none');
      const reply = "Synthesizer muted to complete silence.";
      setStatusText(reply);
      speakText(reply);
      showToast(reply, 'info');
    }
    else if (text.includes('help') || text.includes('command list') || text.includes('what can you do')) {
      const reply = "I can add tasks, complete items, control your focus timer, play relaxing ambience synthesizers, and navigate to any page. Try saying: start focus, or play lofi beats!";
      setStatusText("Try: add task..., start focus, play lofi beats, go to schedule...");
      speakText(reply);
    }
    else {
      const reply = `I heard: "${cmdText}". Try saying: add task, complete task, start focus, or help.`;
      setStatusText(`Unrecognized: "${cmdText}". Try saying 'help'`);
      speakText(reply);
    }
  }

  const handleSimulatedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedText.trim()) return;
    
    const textToProcess = simulatedText;
    setTranscript(textToProcess);
    processCommand(textToProcess);
    setSimulatedText('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-md w-full p-6 relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">AI Voice Assistant</h3>
            <p className="text-xs text-slate-500">Command your schedule instantly</p>
          </div>
        </div>

        {/* Waveforms & Microphones */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 flex flex-col items-center justify-center gap-6 mb-6">
          <div className="flex items-end justify-center gap-1 h-12 w-full px-8">
            {waveHeights.map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: h }}
                transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                className={`w-1 rounded-full ${isListening ? 'bg-blue-600' : 'bg-slate-300'}`}
              />
            ))}
          </div>

          <button
            onClick={toggleListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md border cursor-pointer transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 border-red-400 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 border-blue-500 text-white hover:scale-105'
            }`}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          <div className="text-center">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              {isListening ? 'Listening' : 'Ready'}
            </p>
            <p className="text-sm font-medium text-slate-600 px-4 line-clamp-2">
              {transcript ? `"${transcript}"` : statusText}
            </p>
          </div>
        </div>

        {/* Suggestion Guides */}
        <div className="mb-6">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Try Spoken Commands:</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => { setSimulatedText('add task Practice presentation pitch'); }}
              className="text-left p-2 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 rounded-lg text-slate-600 font-medium transition-colors cursor-pointer"
            >
              "add task Practice pitch"
            </button>
            <button
              onClick={() => { setSimulatedText('complete task'); }}
              className="text-left p-2 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 rounded-lg text-slate-600 font-medium transition-colors cursor-pointer"
            >
              "complete task"
            </button>
            <button
              onClick={() => { setSimulatedText('show schedule'); }}
              className="text-left p-2 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 rounded-lg text-slate-600 font-medium transition-colors cursor-pointer"
            >
              "show schedule"
            </button>
            <button
              onClick={() => { setSimulatedText('start focus'); }}
              className="text-left p-2 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 rounded-lg text-slate-600 font-medium transition-colors cursor-pointer"
            >
              "start focus"
            </button>
          </div>
        </div>

        {/* Simulator fall back */}
        <form onSubmit={handleSimulatedSubmit} className="flex gap-2">
          <input
            type="text"
            value={simulatedText}
            onChange={(e) => setSimulatedText(e.target.value)}
            placeholder="Type a fallback command here..."
            className="flex-1 px-3.5 py-2 border border-slate-200 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
