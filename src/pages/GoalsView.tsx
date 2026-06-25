import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Target, Award, Trash2, CheckCircle2, ChevronRight, ListPlus, Sliders, Calendar, Sparkles, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Goal, Milestone } from '../types';

export const GoalsView: React.FC = () => {
  const { goals, addGoal, deleteGoal, toggleMilestone, showToast } = useApp();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'short-term' | 'long-term'>('short-term');
  const [category, setCategory] = useState('Work');
  const [deadline, setDeadline] = useState('2026-07-30');
  const [milestoneInputs, setMilestoneInputs] = useState<string[]>(['', '']);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Filter out empty milestone inputs
    const milestones = milestoneInputs
      .filter((m) => m.trim() !== '')
      .map((m, index) => ({
        id: `m-${Date.now()}-${index}`,
        title: m.trim(),
        completed: false
      }));

    addGoal({
      title: title.trim(),
      type,
      category,
      deadline,
      milestones
    });

    setTitle('');
    setDeadline('2026-07-30');
    setMilestoneInputs(['', '']);
    setIsFormOpen(false);
  };

  const handleAddMilestoneInput = () => {
    setMilestoneInputs([...milestoneInputs, '']);
  };

  const handleMilestoneInputChange = (index: number, val: string) => {
    const copy = [...milestoneInputs];
    copy[index] = val;
    setMilestoneInputs(copy);
  };

  const handleRemoveMilestoneInput = (index: number) => {
    setMilestoneInputs(milestoneInputs.filter((_, i) => i !== index));
  };

  const activeShortTerm = goals.filter(g => g.type === 'short-term' && !g.completed);
  const activeLongTerm = goals.filter(g => g.type === 'long-term' && !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  return (
    <div className="space-y-6 text-left select-none pb-12 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Milestone & Goal Planning</h2>
          <p className="text-xs text-slate-400 font-semibold mt-0.5">Divide major ambitions into micro checkpoints. Achieving goals yields massive XP awards.</p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-500/15 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Define New Goal</span>
        </button>
      </div>

      {/* Define Goal Modal Form */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 p-6 rounded-2xl shadow-md max-w-lg"
        >
          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Goal Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Ship Beta Product on Product Hunt"
                required
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:border-blue-500 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Horizon Type</label>
                <select
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-600 border border-slate-200 bg-white rounded-xl cursor-pointer"
                >
                  <option value="short-term">Short-Term (&lt; 1 Month)</option>
                  <option value="long-term">Long-Term (1-6 Months)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-600 border border-slate-200 bg-white rounded-xl cursor-pointer"
                >
                  <option value="Work">Work</option>
                  <option value="Study">Study</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Completion Date</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl text-slate-600 focus:border-blue-500"
              />
            </div>

            {/* Milestones dynamic inputs */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Milestone Checkpoints</label>
                <button
                  type="button"
                  onClick={handleAddMilestoneInput}
                  className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Step</span>
                </button>
              </div>

              <div className="space-y-2 max-h-32 overflow-y-auto">
                {milestoneInputs.map((val, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => handleMilestoneInputChange(idx, e.target.value)}
                      placeholder={`Step ${idx + 1}...`}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:border-blue-500"
                    />
                    {milestoneInputs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestoneInput(idx)}
                        className="p-1 hover:bg-red-50 text-red-500 rounded cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-50 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Assemble Goal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Grid: Long-Term & Short-Term */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Short Term block */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-emerald-500" />
            <span>Short-Term Objectives ({activeShortTerm.length})</span>
          </h3>

          {activeShortTerm.length > 0 ? (
            <div className="space-y-4">
              {activeShortTerm.map((g) => (
                <GoalItemCard key={g.id} goal={g} onDelete={deleteGoal} onCheck={toggleMilestone} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-white">
              <p className="text-xs font-semibold text-slate-400">Zero active short-term goals.</p>
              <p className="text-[10px] text-slate-400 mt-1">Short horizons help build rapid cognitive momentum.</p>
            </div>
          )}
        </div>

        {/* Long Term block */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="w-4 h-4 text-blue-500" />
            <span>Long-Term Ambitions ({activeLongTerm.length})</span>
          </h3>

          {activeLongTerm.length > 0 ? (
            <div className="space-y-4">
              {activeLongTerm.map((g) => (
                <GoalItemCard key={g.id} goal={g} onDelete={deleteGoal} onCheck={toggleMilestone} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-white">
              <p className="text-xs font-semibold text-slate-400">Zero active long-term goals.</p>
              <p className="text-[10px] text-slate-400 mt-1">Define long-range targets to layout multi-week milestones.</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed history */}
      {completedGoals.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-yellow-500" />
            <span>Accomplished Milestones ({completedGoals.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
            {completedGoals.map((g) => (
              <GoalItemCard key={g.id} goal={g} onDelete={deleteGoal} onCheck={toggleMilestone} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Internal reusable Goal item card
const GoalItemCard: React.FC<{ goal: Goal; onDelete: (id: string) => void; onCheck: (gid: string, mid: string) => void }> = ({ goal, onDelete, onCheck }) => {
  return (
    <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs hover:shadow-md transition-all text-left space-y-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="inline-block bg-slate-100 text-slate-600 font-bold text-[8px] px-2 py-0.5 rounded-full uppercase">
              {goal.category}
            </span>
            <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Due {goal.deadline}
            </span>
          </div>
          <h4 className={`text-xs font-extrabold text-slate-800 leading-snug ${goal.completed ? 'line-through text-slate-400' : ''}`}>
            {goal.title}
          </h4>
        </div>

        <button
          onClick={() => onDelete(goal.id)}
          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Progress slider representation */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
          <span>Milestones Complete</span>
          <span className="text-slate-700">{goal.progress}%</span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-300" 
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      {/* Milestones list */}
      {goal.milestones.length > 0 && (
        <div className="space-y-1.5 border-t border-slate-50 pt-3">
          {goal.milestones.map((m) => (
            <label 
              key={m.id}
              className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={m.completed}
                onChange={() => onCheck(goal.id, m.id)}
                className="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className={m.completed ? 'line-through text-slate-400' : ''}>
                {m.title}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
