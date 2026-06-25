import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, List, Grid, Kanban, SlidersHorizontal, Calendar, Clock, AlertTriangle, Sparkles, Pin, Star, Trash2, Edit2, Copy, Check, CheckCircle2, ChevronRight, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task, TaskPriority, TaskStatus, SubTask } from '../types';

export const TaskManagerView: React.FC = () => {
  const { 
    tasks, addTask, updateTask, deleteTask, duplicateTask, togglePinTask, toggleFavoriteTask, showToast
  } = useApp();

  // Search & Filtering
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid' | 'kanban'>('list');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-06-25');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedTime, setEstimatedTime] = useState(1.5);
  const [category, setCategory] = useState('Work');
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<{ title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<'daily' | 'weekly' | 'monthly' | 'none'>('none');

  // Get unique categories for filtering
  const categories = ['All', ...Array.from(new Set(tasks.map(t => t.category)))];

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setDeadline('2026-06-25');
    setPriority('medium');
    setEstimatedTime(1.5);
    setCategory('Work');
    setNotes('');
    setTags([]);
    setSubtasks([]);
    setRecurring(false);
    setRecurringInterval('none');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setDeadline(task.deadline);
    setPriority(task.priority);
    setEstimatedTime(task.estimatedTime);
    setCategory(task.category);
    setNotes(task.notes);
    setTags(task.tags);
    setSubtasks(task.subtasks.map(s => ({ title: s.title, completed: s.completed })));
    setRecurring(task.recurring);
    setRecurringInterval(task.recurringInterval);
    setIsModalOpen(true);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, i) => i !== indexToRemove));
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setSubtasks([...subtasks, { title: newSubtaskTitle.trim(), completed: false }]);
      setNewSubtaskTitle('');
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Task title is required!', 'warning');
      return;
    }

    const taskData = {
      title,
      description,
      deadline,
      priority,
      estimatedTime,
      category,
      notes,
      tags,
      subtasks: subtasks.map((s, idx) => ({ id: `sub-${Date.now()}-${idx}`, title: s.title, completed: s.completed })),
      recurring,
      recurringInterval: recurring ? recurringInterval : 'none',
      status: (editingTask ? editingTask.status : 'todo') as TaskStatus,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsModalOpen(false);
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                          task.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || task.priority === selectedPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const pinnedTasks = filteredTasks.filter(t => t.pinned && t.status !== 'completed');
  const unpinnedTasks = filteredTasks.filter(t => !t.pinned && t.status !== 'completed');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-6 text-left select-none animate-fade-in pb-16">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Task Manager Workspace</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Define your deliverables, track subtasks, and analyze priority score overlays.</p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-500/15 flex items-center gap-2 cursor-pointer transition-all hover:scale-103"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* Search & Filters block */}
      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter tasks by text..."
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl py-2 pl-10 pr-4 text-xs font-semibold placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category drop */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-bold text-slate-600 border border-slate-200 bg-white rounded-xl focus:border-blue-500 cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
            ))}
          </select>

          {/* Priority drop */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 text-xs font-bold text-slate-600 border border-slate-200 bg-white rounded-xl focus:border-blue-500 cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="high">High Only</option>
            <option value="medium">Medium Only</option>
            <option value="low">Low Only</option>
          </select>

          {/* Layout switches */}
          <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50/50 shrink-0 ml-auto md:ml-0">
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${layoutMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${layoutMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${layoutMode === 'kanban' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* TASK LIST OR GRID MODE */}
      {(layoutMode === 'list' || layoutMode === 'grid') && (
        <div className="space-y-6">
          {/* Pinned Tasks if any */}
          {pinnedTasks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5 text-blue-500" />
                <span>Pinned Objectives ({pinnedTasks.length})</span>
              </h4>
              <div className={layoutMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'}>
                {pinnedTasks.map(t => (
                  <TaskItemCard key={t.id} task={t} onEdit={handleOpenEditModal} layout={layoutMode} />
                ))}
              </div>
            </div>
          )}

          {/* Active backlogs & Todos */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>Active deliverables ({unpinnedTasks.length})</span>
            </h4>
            {unpinnedTasks.length > 0 ? (
              <div className={layoutMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'}>
                {unpinnedTasks.map(t => (
                  <TaskItemCard key={t.id} task={t} onEdit={handleOpenEditModal} layout={layoutMode} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-white">
                <p className="text-xs font-semibold text-slate-400">No active deliverables found.</p>
                <p className="text-[10px] text-slate-400 mt-1">Refine your filter settings or create a task above.</p>
              </div>
            )}
          </div>

          {/* Completed History section */}
          {completedTasks.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Archived Completed History ({completedTasks.length})</span>
              </h4>
              <div className={layoutMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3 opacity-75'}>
                {completedTasks.map(t => (
                  <TaskItemCard key={t.id} task={t} onEdit={handleOpenEditModal} layout={layoutMode} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* KANBAN BOARD VIEW */}
      {layoutMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start pt-2">
          {/* Backlog Column */}
          <KanbanColumn 
            title="Backlog" 
            status="backlog" 
            tasks={filteredTasks.filter(t => t.status === 'backlog')} 
            onEdit={handleOpenEditModal} 
          />
          {/* Todo Column */}
          <KanbanColumn 
            title="To-Do" 
            status="todo" 
            tasks={filteredTasks.filter(t => t.status === 'todo')} 
            onEdit={handleOpenEditModal} 
          />
          {/* In-Progress Column */}
          <KanbanColumn 
            title="In-Progress" 
            status="in-progress" 
            tasks={filteredTasks.filter(t => t.status === 'in-progress')} 
            onEdit={handleOpenEditModal} 
          />
          {/* Completed Column */}
          <KanbanColumn 
            title="Completed" 
            status="completed" 
            tasks={filteredTasks.filter(t => t.status === 'completed')} 
            onEdit={handleOpenEditModal} 
          />
        </div>
      )}

      {/* TASK MODAL (ADD / EDIT) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto text-left"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6 flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{editingTask ? 'Edit Task Details' : 'Create Custom Deliverable'}</h3>
                  <p className="text-xs text-slate-500">Inputs are automatically analyzed by our AI companion priority framework</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Task Title */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Task Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Prepare Operating Systems lab notes"
                      required
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold text-slate-600 border border-slate-200 bg-white rounded-xl cursor-pointer"
                    >
                      <option value="Work">Work</option>
                      <option value="Study">Study</option>
                      <option value="Personal">Personal</option>
                      <option value="Finance">Finance</option>
                      <option value="Health">Health</option>
                    </select>
                  </div>

                  {/* Manual Priority */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Manual Priority Tag</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p)}
                          className={`py-1.5 text-xs font-bold rounded-xl border text-center cursor-pointer capitalize transition-all ${
                            priority === p 
                              ? 'bg-blue-50 border-blue-200 text-blue-600' 
                              : 'border-slate-200 hover:border-slate-300 text-slate-500'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Deadline Date */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Final Deadline Date</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl text-slate-600 focus:border-blue-500"
                    />
                  </div>

                  {/* Estimated Completion slider */}
                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Workload Duration (Est.)</label>
                      <span className="text-xs font-bold text-blue-600">{estimatedTime} hours</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={estimatedTime}
                      onChange={(e) => setEstimatedTime(parseFloat(e.target.value))}
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Task Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide granular steps, materials link, or objective summary..."
                    rows={3}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 font-medium"
                  />
                </div>

                {/* Subtask management */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Subtask Checklist</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      placeholder="e.g. Research proofs index"
                      className="flex-1 px-3.5 py-1.5 text-xs border border-slate-200 rounded-xl focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubtask}
                      className="px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                    >
                      Add Subtask
                    </button>
                  </div>
                  
                  {subtasks.length > 0 && (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto border border-slate-100 rounded-xl p-2.5 bg-slate-50/50">
                      {subtasks.map((st, i) => (
                        <div key={i} className="flex items-center justify-between text-xs font-semibold text-slate-600">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={st.completed}
                              onChange={() => {
                                const copy = [...subtasks];
                                copy[i].completed = !copy[i].completed;
                                setSubtasks(copy);
                              }}
                              className="w-4 h-4 rounded text-blue-600"
                            />
                            <span className={st.completed ? 'line-through text-slate-400' : ''}>{st.title}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubtask(i)}
                            className="text-red-500 hover:text-red-600 text-[10px] font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags input */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tags (Press Enter)</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="e.g. Exam, CS302 (Enter)"
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 mb-2"
                  />
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag, idx) => (
                        <span 
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full"
                        >
                          <span>{tag}</span>
                          <button type="button" onClick={() => handleRemoveTag(idx)} className="hover:text-red-500 font-bold cursor-pointer">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recurring panel */}
                <div className="border border-slate-100 bg-slate-50/50 p-3 rounded-xl flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-xs font-bold text-slate-700 block">Recurring Task</span>
                    <span className="text-[10px] text-slate-400 font-semibold leading-none">Auto-generate next interval copy when completed</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={recurring}
                      onChange={() => setRecurring(!recurring)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    {recurring && (
                      <select
                        value={recurringInterval}
                        onChange={(e: any) => setRecurringInterval(e.target.value)}
                        className="px-2 py-1 border border-slate-200 bg-white rounded-lg text-xs font-bold text-slate-600 cursor-pointer"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    )}
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
                  >
                    {editingTask ? 'Save Changes' : 'Create Obligation'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Internal reusable Card Component
const TaskItemCard: React.FC<{ task: Task; onEdit: (task: Task) => void; layout: 'list' | 'grid' }> = ({ task, onEdit, layout }) => {
  const { updateTask, deleteTask, duplicateTask, togglePinTask, toggleFavoriteTask } = useApp();
  const [showOptions, setShowOptions] = useState(false);

  const subtasksCompleted = task.subtasks.filter(s => s.completed).length;
  const subtasksPercent = task.subtasks.length > 0 ? Math.round((subtasksCompleted / task.subtasks.length) * 100) : 0;

  const isCompleted = task.status === 'completed';

  return (
    <div 
      className={`bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all relative ${
        layout === 'list' ? 'sm:flex-row sm:items-center gap-4' : 'space-y-4 h-fit'
      }`}
    >
      <div className="flex items-start gap-3 flex-1 text-left">
        {/* Toggle Box */}
        <button
          onClick={() => updateTask(task.id, { status: isCompleted ? 'todo' : 'completed' })}
          className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer transition-all shrink-0 ${
            isCompleted 
              ? 'bg-emerald-500 border-emerald-500 text-white' 
              : 'border-slate-300 hover:border-blue-500 hover:bg-blue-50'
          }`}
        >
          {isCompleted ? <Check className="w-3.5 h-3.5" /> : <span className="text-transparent">○</span>}
        </button>

        <div className="space-y-1 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-block bg-slate-100 border border-slate-200 text-slate-600 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase">
              {task.category}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
              task.priority === 'high' ? 'bg-red-50 text-red-600' :
              task.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
            }`}>
              {task.priority} priority
            </span>
            {task.recurring && (
              <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
                Recurring {task.recurringInterval}
              </span>
            )}
          </div>

          <h4 className={`text-sm font-bold text-slate-800 leading-tight ${isCompleted ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h4>
          <p className="text-xs text-slate-400 line-clamp-1">{task.description}</p>
          
          {/* Subtasks Progress */}
          {task.subtasks.length > 0 && (
            <div className="flex items-center gap-2 pt-1">
              <div className="w-20 bg-slate-100 h-1 rounded-full overflow-hidden shrink-0">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${subtasksPercent}%` }} />
              </div>
              <span className="text-[10px] text-slate-400 font-bold">{subtasksCompleted}/{task.subtasks.length} steps</span>
            </div>
          )}
        </div>
      </div>

      <div className={`flex items-center justify-between gap-4 border-t border-slate-50 pt-3.5 sm:pt-0 sm:border-t-0 shrink-0 ${layout === 'list' ? '' : 'w-full'}`}>
        {/* Priority score */}
        <div className="flex gap-4 items-center">
          <div className="text-left">
            <span className="text-[9px] text-slate-400 font-bold block leading-none">AI SCORE</span>
            <span className="text-sm font-black text-slate-800">{task.aiPriorityScore}%</span>
          </div>
          <div className="text-left">
            <span className="text-[9px] text-slate-400 font-bold block leading-none">WORKLOAD</span>
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5" />
              {task.estimatedTime}h
            </span>
          </div>
        </div>

        {/* Dynamic Action menu */}
        <div className="flex gap-1">
          <button
            onClick={() => togglePinTask(task.id)}
            className={`p-1.5 rounded-lg border cursor-pointer hover:bg-slate-50 ${task.pinned ? 'text-blue-600 border-blue-100 bg-blue-50/50' : 'text-slate-400 border-slate-100'}`}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 border border-slate-100 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => duplicateTask(task.id)}
            className="p-1.5 border border-slate-100 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-700 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="p-1.5 border border-slate-100 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Kanban Column component
const KanbanColumn: React.FC<{ title: string; status: TaskStatus; tasks: Task[]; onEdit: (task: Task) => void }> = ({ title, status, tasks, onEdit }) => {
  const { updateTask } = useApp();

  return (
    <div className="bg-slate-100/50 rounded-2xl p-4 border border-slate-100 text-left min-h-[500px] flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">{title}</h4>
        <span className="bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500 rounded-full shadow-xs">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="bg-white border border-slate-100 rounded-xl p-3 shadow-xs space-y-3 group"
          >
            <div>
              <span className="inline-block bg-slate-100 text-slate-500 font-bold text-[8px] px-1.5 py-0.5 rounded-full mb-1">
                {task.category}
              </span>
              <h5 className="text-xs font-bold text-slate-800 leading-normal line-clamp-2">{task.title}</h5>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
              <span>AI Score: {task.aiPriorityScore}%</span>
              <span>{task.estimatedTime}h</span>
            </div>

            {/* Quick action buttons on hover inside Kanban cards */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-50">
              <select
                value={task.status}
                onChange={(e) => updateTask(task.id, { status: e.target.value as any })}
                className="text-[9px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-lg cursor-pointer"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To-Do</option>
                <option value="in-progress">In-Progress</option>
                <option value="completed">Completed</option>
              </select>

              <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(task)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-28 border border-dashed border-slate-200 rounded-xl text-[10px] text-slate-400 font-bold">
            Drop items here
          </div>
        )}
      </div>
    </div>
  );
};
