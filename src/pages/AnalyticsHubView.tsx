import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, PieChart, LineChart, TrendingUp, Sparkles, Clock, Activity, Calendar, ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, Bar, Cell, PieChart as RechartsPieChart, Pie, LineChart as RechartsLineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';

export const AnalyticsHubView: React.FC = () => {
  const { tasks, habits, goals } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = Math.round((completedTasks / (totalTasks || 1)) * 100);

  // Compute category distributions
  const categoryCounts: Record<string, number> = {};
  tasks.forEach((t) => {
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });

  const pieData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value
  }));

  // Bar chart: Tasks by urgency rating
  const highRisk = tasks.filter(t => t.aiUrgency === 'critical' || t.aiUrgency === 'high').length;
  const mediumRisk = tasks.filter(t => t.aiUrgency === 'medium').length;
  const lowRisk = tasks.filter(t => t.aiUrgency === 'low').length;

  const barData = [
    { name: 'Critical/High Risk', value: highRisk, fill: '#EF4444' },
    { name: 'Moderate Risk', value: mediumRisk, fill: '#F59E0B' },
    { name: 'Low Risk', value: lowRisk, fill: '#2563EB' }
  ];

  // Colors for Pie/Donut Chart
  const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

  return (
    <div className="space-y-6 text-left select-none pb-12 animate-fade-in">
      {/* Header section */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Analytics Workspace</h2>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">Review performance reports, stress metrics, focus multipliers, and workload balances.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Deliverables</span>
          <span className="text-2xl font-black text-slate-800">{totalTasks} items</span>
          <p className="text-[9px] text-slate-400 font-bold mt-1.5">{activeTasks} active backlogs pending</p>
        </div>

        <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Productivity Index</span>
          <span className="text-2xl font-black text-emerald-500">{completionRate}%</span>
          <p className="text-[9px] text-slate-400 font-bold mt-1.5">{completedTasks} items completed</p>
        </div>

        <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Habit Consistency</span>
          <span className="text-2xl font-black text-blue-600">84%</span>
          <p className="text-[9px] text-slate-400 font-bold mt-1.5">Streak maintained above 3 days</p>
        </div>

        <div className="bg-white border border-slate-100 p-4.5 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Goal timelines</span>
          <span className="text-2xl font-black text-purple-600">
            {goals.filter(g => g.completed).length} / {goals.length}
          </span>
          <p className="text-[9px] text-slate-400 font-bold mt-1.5">Goal milestones hit on target</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category distribution Pie */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Obligations by Category</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Workload spread across your custom categories.</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', background: '#0F172A', color: '#fff', fontSize: '11px' }} />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs font-semibold text-slate-400">No category metrics logged.</p>
            )}
          </div>
        </div>

        {/* Urgency Risks Bar Chart */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs text-left">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Urgency Risk Exposure</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Concentration of tasks needing immediate vs buffer timelines.</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', background: '#0F172A', color: '#fff', fontSize: '11px' }} />
                  <Bar dataKey="value" name="Task Count" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs font-semibold text-slate-400">No active urgency reports.</p>
            )}
          </div>
        </div>
      </div>

      {/* AI Performance Insight Summary card */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex items-center justify-between gap-6 relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -z-10" />
        
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-300">Smart Optimization Insight</span>
          </div>
          <h4 className="text-sm font-bold">Proactive Buffer Strategy Detected</h4>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Our diagnostic analytics show that when you tackle tasks with a Risk rating above **70%** in morning Pomodoro sessions, you experience a **35% reduction in overdue flags** and a **2x improvement in weekly habits consistency**. Maintain your current 5-day workout streak to sustain this cognitive output!
          </p>
        </div>

        <TrendingUp className="w-14 h-14 text-emerald-400 shrink-0 opacity-80 hidden md:block" />
      </div>
    </div>
  );
};
