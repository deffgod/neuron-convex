'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Activity, Calendar, Brain, Target, TrendingUp, 
  BarChart2, Clock, Zap, Heart, Dumbbell, ChevronRight,
  Download, Share2, Filter, CheckCircle, Star, Trophy
} from 'lucide-react';
import * as Recharts from 'recharts';
const { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} = Recharts;

// Core colors
const colors = {
  primary: '#B7F501',
  background: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceLight: '#2A2A2A',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  accent1: '#00D1FF',
  accent2: '#FF00E5',
  accent3: '#FF9500',
  success: '#00C853',
  error: '#FF5252',
};

// Mock data for progress tracking
const mockData = {
  weeklyProgress: [
    { week: 'Week 1', neural: 65, physical: 70, overall: 68 },
    { week: 'Week 2', neural: 72, physical: 75, overall: 74 },
    { week: 'Week 3', neural: 78, physical: 82, overall: 80 },
    { week: 'Week 4', neural: 85, physical: 88, overall: 87 },
  ],
  dailyActivity: [
    { day: 'Mon', minutes: 45, type: 'Neural', rating: 4.5 },
    { day: 'Tue', minutes: 0, type: '', rating: 0 },
    { day: 'Wed', minutes: 30, type: 'Physical', rating: 4.0 },
    { day: 'Thu', minutes: 20, type: 'Recovery', rating: 4.2 },
    { day: 'Fri', minutes: 40, type: 'Combined', rating: 4.8 },
    { day: 'Sat', minutes: 35, type: 'Neural', rating: 4.6 },
    { day: 'Sun', minutes: 0, type: '', rating: 0 },
  ],
  categoryBreakdown: [
    { name: 'Neural Training', value: 35, color: colors.primary },
    { name: 'Physical Training', value: 40, color: colors.accent1 },
    { name: 'Recovery', value: 15, color: colors.accent2 },
    { name: 'Combined', value: 10, color: colors.accent3 },
  ],
  achievements: [
    { id: 1, name: 'Early Bird', description: '10 morning workouts completed', icon: '🌅', progress: 100, unlocked: true, date: '2025-04-20' },
    { id: 2, name: 'Consistency King', description: '7-day streak achieved', icon: '👑', progress: 100, unlocked: true, date: '2025-04-22' },
    { id: 3, name: 'Neural Master', description: 'Complete 20 neural training sessions', icon: '🧠', progress: 75, unlocked: false },
    { id: 4, name: 'Balance Pro', description: 'Score 90+ in balance tests', icon: '⚖️', progress: 85, unlocked: false },
    { id: 5, name: 'Perfect Week', description: 'Complete all scheduled workouts', icon: '🏆', progress: 60, unlocked: false },
  ],
  streakData: {
    current: 7,
    longest: 12,
    totalDays: 32,
    monthlyCompletion: 85,
  },
  performanceMetrics: {
    balance: { current: 85, previous: 72, target: 90 },
    coordination: { current: 78, previous: 65, target: 85 },
    reaction: { current: 82, previous: 70, target: 88 },
    memory: { current: 88, previous: 75, target: 92 },
    focus: { current: 90, previous: 80, target: 95 },
  },
};

export default function ProgressTracking() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-black/70">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Progress</h1>
              <p className="text-sm text-gray-400">Track your neurofitness journey</p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.surface }}
              >
                <Share2 size={20} className="text-gray-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.surface }}
              >
                <Download size={20} className="text-gray-400" />
              </motion.button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex space-x-1 p-1 rounded-lg" style={{ backgroundColor: colors.surface }}>
            {['overview', 'achievements', 'analytics'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium capitalize`}
                style={{
                  backgroundColor: activeTab === tab ? colors.surfaceLight : 'transparent',
                  color: activeTab === tab ? colors.textPrimary : colors.textSecondary,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && <OverviewTab key="overview" data={mockData} />}
          {activeTab === 'achievements' && <AchievementsTab key="achievements" achievements={mockData.achievements} />}
          {activeTab === 'analytics' && <AnalyticsTab key="analytics" data={mockData} />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function OverviewTab({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Streak and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={Activity}
          title="Current Streak"
          value={`${data.streakData.current} days`}
          color={colors.success}
          trend={`Longest: ${data.streakData.longest} days`}
        />
        <StatCard
          icon={Calendar}
          title="This Month"
          value={`${data.streakData.monthlyCompletion}%`}
          color={colors.primary}
          trend="completion rate"
        />
        <StatCard
          icon={Clock}
          title="Total Time"
          value="24.5h"
          color={colors.accent1}
          trend="this month"
        />
        <StatCard
          icon={Trophy}
          title="Achievements"
          value={`${data.achievements.filter(a => a.unlocked).length}/${data.achievements.length}`}
          color={colors.accent3}
          trend="unlocked"
        />
      </div>

      {/* Weekly Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl"
        style={{ backgroundColor: colors.surface }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Weekly Progress</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.weeklyProgress}>
              <defs>
                <linearGradient id="neuralGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors.primary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="physicalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.accent1} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={colors.accent1} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="week" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{ backgroundColor: colors.surfaceLight, border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: colors.textPrimary }}
              />
              <Area type="monotone" dataKey="neural" stroke={colors.primary} fillOpacity={1} fill="url(#neuralGradient)" />
              <Area type="monotone" dataKey="physical" stroke={colors.accent1} fillOpacity={1} fill="url(#physicalGradient)" />
              <Line type="monotone" dataKey="overall" stroke={colors.textPrimary} strokeWidth={2} dot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          {[
            { label: 'Neural', color: colors.primary },
            { label: 'Physical', color: colors.accent1 },
            { label: 'Overall', color: colors.textPrimary },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl"
        style={{ backgroundColor: colors.surface }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Daily Activity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.dailyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{ backgroundColor: colors.surfaceLight, border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: colors.textPrimary }}
              />
              <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                {data.dailyActivity.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.type === 'Neural' ? colors.primary :
                      entry.type === 'Physical' ? colors.accent1 :
                      entry.type === 'Recovery' ? colors.accent2 :
                      entry.type === 'Combined' ? colors.accent3 :
                      colors.surfaceLight
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AchievementsTab({ achievements }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Achievement Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 rounded-xl text-center"
          style={{ backgroundColor: colors.surface }}
        >
          <Trophy size={24} className="mx-auto mb-2" style={{ color: colors.primary }} />
          <div className="text-2xl font-bold text-white">
            {achievements.filter(a => a.unlocked).length}
          </div>
          <p className="text-sm text-gray-400">Unlocked</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 rounded-xl text-center"
          style={{ backgroundColor: colors.surface }}
        >
          <Target size={24} className="mx-auto mb-2" style={{ color: colors.accent1 }} />
          <div className="text-2xl font-bold text-white">
            {achievements.length - achievements.filter(a => a.unlocked).length}
          </div>
          <p className="text-sm text-gray-400">In Progress</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 rounded-xl text-center"
          style={{ backgroundColor: colors.surface }}
        >
          <Star size={24} className="mx-auto mb-2" style={{ color: colors.accent3 }} />
          <div className="text-2xl font-bold text-white">85%</div>
          <p className="text-sm text-gray-400">Completion</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -4 }}
          className="p-4 rounded-xl text-center"
          style={{ backgroundColor: colors.surface }}
        >
          <Zap size={24} className="mx-auto mb-2" style={{ color: colors.accent2 }} />
          <div className="text-2xl font-bold text-white">2</div>
          <p className="text-sm text-gray-400">Recent</p>
        </motion.div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </motion.div>
  );
}

function AchievementCard({ achievement }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`p-6 rounded-xl ${achievement.unlocked ? '' : 'opacity-75'}`}
      style={{ backgroundColor: colors.surface }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{achievement.icon}</div>
        {achievement.unlocked && (
          <CheckCircle size={24} style={{ color: colors.success }} />
        )}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{achievement.name}</h3>
      <p className="text-sm text-gray-400 mb-4">{achievement.description}</p>
      
      {!achievement.unlocked && (
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">Progress</span>
            <span className="text-white">{achievement.progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.surfaceLight }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: colors.primary }}
              initial={{ width: 0 }}
              animate={{ width: `${achievement.progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      )}
      
      {achievement.unlocked && achievement.date && (
        <div className="text-sm" style={{ color: colors.primary }}>
          Unlocked on {new Date(achievement.date).toLocaleDateString()}
        </div>
      )}
    </motion.div>
  );
}

function AnalyticsTab({ data }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-xl"
          style={{ backgroundColor: colors.surface }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Training Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: colors.surfaceLight, border: 'none', borderRadius: '8px' }}
                  itemStyle={{ color: colors.textPrimary }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-xl"
          style={{ backgroundColor: colors.surface }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            {Object.entries(data.performanceMetrics).map(([key, metrics]) => (
              <div key={key}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-400 capitalize">{key}</span>
                  <span className="text-sm font-medium text-white">{metrics.current}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.surfaceLight }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: colors.primary }}
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics.current}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-500">
                    Previous: {metrics.previous}%
                  </span>
                  <span className="text-gray-500">
                    Target: {metrics.target}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Consistency Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl"
        style={{ backgroundColor: colors.surface }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Consistency Calendar</h3>
        <ConsistencyCalendar />
      </motion.div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-xl"
        style={{ backgroundColor: colors.surface }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Progress Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm text-gray-400 mb-2">Top Improvements</h4>
            <div className="space-y-2">
              {[
                { name: 'Balance', improvement: '+15%', icon: Activity },
                { name: 'Memory', improvement: '+13%', icon: Brain },
                { name: 'Reaction Time', improvement: '+12%', icon: Zap },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: colors.surfaceLight }}>
                  <div className="flex items-center gap-2">
                    <item.icon size={16} style={{ color: colors.primary }} />
                    <span className="text-white">{item.name}</span>
                  </div>
                  <span className="text-green-400">{item.improvement}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm text-gray-400 mb-2">Recent Milestones</h4>
            <div className="space-y-2">
              {[
                { title: '50 Workouts', date: '2025-04-20' },
                { title: '100 Hours', date: '2025-04-18' },
                { title: 'Level Up', date: '2025-04-15' },
              ].map((milestone, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: colors.surfaceLight }}>
                  <span className="text-white">{milestone.title}</span>
                  <span className="text-sm text-gray-400">{milestone.date}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm text-gray-400 mb-2">Next Goals</h4>
            <div className="space-y-2">
              {[
                { goal: 'Complete Week 8', progress: 75 },
                { goal: 'Reaction Time 90+', progress: 85 },
                { goal: '30-Day Streak', progress: 60 },
              ].map((goal, index) => (
                <div key={index} className="p-3 rounded-lg" style={{ backgroundColor: colors.surfaceLight }}>
                  <div className="flex justify-between mb-1">
                    <span className="text-white">{goal.goal}</span>
                    <span className="text-sm text-gray-400">{goal.progress}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full" style={{ backgroundColor: colors.background }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: colors.primary }}
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({ icon: Icon, title, value, color, trend }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-4 rounded-xl"
      style={{ backgroundColor: colors.surface }}
    >
      <div className="flex items-center justify-between mb-3">
        <Icon size={24} style={{ color }} />
        {trend && (
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-white text-2xl font-bold mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </motion.div>
  );
}

function ConsistencyCalendar() {
  // Simplified calendar view for demo
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const activities = [
    { date: '2025-04-01', completed: true, type: 'neural' },
    { date: '2025-04-02', completed: true, type: 'physical' },
    { date: '2025-04-03', completed: false },
    // ... Add more dates
  ];
  
  // Generate calendar for current month
  const generateCalendar = () => {
    const calendar = [];
    const currentDate = new Date(2025, 3, 1); // April 2025
    const daysInMonth = new Date(2025, 4, 0).getDate();
    
    // Get first day of month
    const firstDayOfMonth = currentDate.getDay();
    
    // Add empty cells for days before first of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendar.push(null);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `2025-04-${day.toString().padStart(2, '0')}`;
      const activity = activities.find(a => a.date === dateStr);
      calendar.push({
        day,
        completed: activity?.completed || false,
        type: activity?.type || null,
      });
    }
    
    return calendar;
  };
  
  const calendar = generateCalendar();
  
  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendar.map((item, index) => (
          <div
            key={index}
            className={`aspect-square flex items-center justify-center rounded-md text-sm ${
              item ? (item.completed ? 
                item.type === 'neural' ? 'bg-primary text-black' : 
                item.type === 'physical' ? 'bg-accent1 text-black' : 
                'bg-surfaceLight text-white' : 
                'bg-surfaceLight text-gray-500') : 
              ''
            }`}
            style={item && item.completed ? (
              item.type === 'neural' ? { backgroundColor: colors.primary, color: 'black' } :
              item.type === 'physical' ? { backgroundColor: colors.accent1, color: 'black' } :
              { backgroundColor: colors.surfaceLight, color: 'white' }
            ) : { backgroundColor: colors.surfaceLight }}
          >
            {item?.day}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.primary }} />
          <span className="text-xs text-gray-400">Neural</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors.accent1 }} />
          <span className="text-xs text-gray-400">Physical</span>
        </div>
      </div>
    </div>
  );
}