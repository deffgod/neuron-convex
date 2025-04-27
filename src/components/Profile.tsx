'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, MapPin, Activity, Heart, 
  Target, Award, Settings, Edit3, Save, X, Camera, Lock,
  Bell, Globe, Moon, Sun, ChevronRight, CheckCircle,
  Eye, EyeOff
} from 'lucide-react';

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

// Mock user data
const mockUserData = {
  id: 'usr_123456',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 123-4567',
  avatar: 'https://picsum.photos/150/150?random=1',
  dateOfBirth: '1990-06-15',
  location: 'San Francisco, CA',
  memberSince: '2024-12-01',
  subscription: {
    plan: 'Premium',
    status: 'Active',
    nextBilling: '2025-05-01',
  },
  biometrics: {
    height: 175,
    weight: 68,
    restingHeartRate: 62,
    maxHeartRate: 187,
  },
  fitnessGoals: [
    'Improve cognitive function',
    'Increase mobility',
    'Reduce stress',
    'Enhance balance',
  ],
  preferences: {
    language: 'English',
    theme: 'dark',
    notifications: {
      email: true,
      push: true,
      workoutReminders: true,
      progressUpdates: true,
    },
    trainingDays: ['Mon', 'Wed', 'Fri'],
    preferredTime: 'morning',
  },
  stats: {
    totalWorkouts: 112,
    totalHours: 68.5,
    currentStreak: 8,
    longestStreak: 15,
    achievements: 18,
  },
};

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockUserData);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleSave = () => {
    // In a real app, this would send data to the backend
    console.log('Saving profile data:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(mockUserData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-black/70">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Profile</h1>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    className="px-4 py-2 rounded-lg font-medium text-black"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Save size={18} className="inline mr-2" />
                    Save
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-lg border"
                    style={{ borderColor: colors.surfaceLight, color: colors.textSecondary }}
                  >
                    <X size={18} className="inline mr-2" />
                    Cancel
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: colors.surface }}
                >
                  <Edit3 size={18} className="inline mr-2" />
                  Edit
                </motion.button>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex space-x-1 p-1 rounded-lg" style={{ backgroundColor: colors.surface }}>
            {['profile', 'biometrics', 'goals', 'settings'].map((tab) => (
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
          {activeTab === 'profile' && <ProfileTab key="profile" data={formData} isEditing={isEditing} setData={setFormData} />}
          {activeTab === 'biometrics' && <BiometricsTab key="biometrics" data={formData} isEditing={isEditing} setData={setFormData} />}
          {activeTab === 'goals' && <GoalsTab key="goals" data={formData} isEditing={isEditing} setData={setFormData} />}
          {activeTab === 'settings' && <SettingsTab key="settings" data={formData} setData={setFormData} onPasswordChange={() => setShowPasswordModal(true)} />}
        </AnimatePresence>
      </main>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileTab({ data, isEditing, setData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-xl" style={{ backgroundColor: colors.surface }}>
        <div className="relative">
          <img
            src={data.avatar}
            alt={data.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          {isEditing && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-0 right-0 p-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
            >
              <Camera size={16} className="text-black" />
            </motion.button>
          )}
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-white mb-1">{data.name}</h2>
          <p className="text-gray-400">{data.email}</p>
          <div className="mt-2 px-3 py-1 rounded-full text-sm inline-block"
               style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
            {data.subscription.plan} Member
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.surface }}>
        <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            icon={User}
            label="Full Name"
            value={data.name}
            isEditing={isEditing}
            onChange={(value) => setData({ ...data, name: value })}
          />
          <FormField
            icon={Mail}
            label="Email"
            value={data.email}
            isEditing={isEditing}
            onChange={(value) => setData({ ...data, email: value })}
            type="email"
          />
          <FormField
            icon={Phone}
            label="Phone"
            value={data.phone}
            isEditing={isEditing}
            onChange={(value) => setData({ ...data, phone: value })}
            type="tel"
          />
          <FormField
            icon={Calendar}
            label="Date of Birth"
            value={data.dateOfBirth}
            isEditing={isEditing}
            onChange={(value) => setData({ ...data, dateOfBirth: value })}
            type="date"
          />
          <FormField
            icon={MapPin}
            label="Location"
            value={data.location}
            isEditing={isEditing}
            onChange={(value) => setData({ ...data, location: value })}
          />
          <FormField
            icon={Calendar}
            label="Member Since"
            value={new Date(data.memberSince).toLocaleDateString()}
            isEditing={false}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { icon: Activity, label: 'Total Workouts', value: data.stats.totalWorkouts },
          { icon: Target, label: 'Total Hours', value: data.stats.totalHours },
          { icon: Award, label: 'Current Streak', value: `${data.stats.currentStreak} days` },
          { icon: CheckCircle, label: 'Longest Streak', value: `${data.stats.longestStreak} days` },
          { icon: Award, label: 'Achievements', value: data.stats.achievements },
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -4 }}
            className="p-4 rounded-xl text-center"
            style={{ backgroundColor: colors.surface }}
          >
            <stat.icon size={24} className="mx-auto mb-2" style={{ color: colors.primary }} />
            <div className="text-xl font-bold text-white">{stat.value}</div>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function BiometricsTab({ data, isEditing, setData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Biometric Data */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.surface }}>
        <h3 className="text-lg font-semibold text-white mb-4">Biometric Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            icon={User}
            label="Height (cm)"
            value={data.biometrics.height}
            isEditing={isEditing}
            onChange={(value) => setData({
              ...data,
              biometrics: { ...data.biometrics, height: Number(value) }
            })}
            type="number"
          />
          <FormField
            icon={Activity}
            label="Weight (kg)"
            value={data.biometrics.weight}
            isEditing={isEditing}
            onChange={(value) => setData({
              ...data,
              biometrics: { ...data.biometrics, weight: Number(value) }
            })}
            type="number"
          />
          <FormField
            icon={Heart}
            label="Resting Heart Rate (bpm)"
            value={data.biometrics.restingHeartRate}
            isEditing={isEditing}
            onChange={(value) => setData({
              ...data,
              biometrics: { ...data.biometrics, restingHeartRate: Number(value) }
            })}
            type="number"
          />
          <FormField
            icon={Heart}
            label="Max Heart Rate (bpm)"
            value={data.biometrics.maxHeartRate}
            isEditing={isEditing}
            onChange={(value) => setData({
              ...data,
              biometrics: { ...data.biometrics, maxHeartRate: Number(value) }
            })}
            type="number"
          />
        </div>
      </div>

      {/* Health Metrics */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.surface }}>
        <h3 className="text-lg font-semibold text-white mb-4">Health Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              label: 'BMI', 
              value: (data.biometrics.weight / Math.pow(data.biometrics.height / 100, 2)).toFixed(1),
              color: colors.primary
            },
            { 
              label: 'Body Type', 
              value: 'Athletic',
              color: colors.accent1
            },
            { 
              label: 'Fitness Level', 
              value: 'Intermediate',
              color: colors.accent3
            },
            { 
              label: 'Recovery Rate', 
              value: 'Good',
              color: colors.success
            },
          ].map((metric, index) => (
            <div key={index} className="p-4 rounded-lg text-center" style={{ backgroundColor: colors.surfaceLight }}>
              <h4 className="text-sm text-gray-400 mb-1">{metric.label}</h4>
              <div className="text-lg font-bold" style={{ color: metric.color }}>{metric.value}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function GoalsTab({ data, isEditing, setData }) {
  const allGoals = [
    'Improve cognitive function',
    'Increase mobility',
    'Reduce stress',
    'Enhance balance',
    'Build strength',
    'Improve endurance',
    'Enhance flexibility',
    'Boost energy',
    'Improve sleep',
    'Weight management',
  ];

  const toggleGoal = (goal) => {
    if (!isEditing) return;
    
    const updatedGoals = data.fitnessGoals.includes(goal)
      ? data.fitnessGoals.filter(g => g !== goal)
      : [...data.fitnessGoals, goal];
    
    setData({ ...data, fitnessGoals: updatedGoals });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Selected Goals */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.surface }}>
        <h3 className="text-lg font-semibold text-white mb-4">Selected Fitness Goals</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {data.fitnessGoals.map((goal, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-full flex items-center gap-2"
              style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
            >
              {goal}
              {isEditing && (
                <button onClick={() => toggleGoal(goal)}>
                  <X size={16} />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* All Goals */}
      {isEditing && (
        <div className="p-6 rounded-xl" style={{ backgroundColor: colors.surface }}>
          <h3 className="text-lg font-semibold text-white mb-4">Available Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allGoals
              .filter(goal => !data.fitnessGoals.includes(goal))
              .map((goal, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleGoal(goal)}
                  className="p-4 rounded-lg text-left"
                  style={{ backgroundColor: colors.surfaceLight }}
                >
                  <h4 className="text-white font-medium">{goal}</h4>
                  <p className="text-sm text-gray-400 mt-1">Click to add</p>
                </motion.button>
              ))}
          </div>
        </div>
      )}

      {/* Training Preferences */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.surface }}>
        <h3 className="text-lg font-semibold text-white mb-4">Training Preferences</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Training Days</label>
            <div className="flex flex-wrap gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!isEditing}
                  onClick={() => {
                    if (!isEditing) return;
                    const updatedDays = data.preferences.trainingDays.includes(day)
                      ? data.preferences.trainingDays.filter(d => d !== day)
                      : [...data.preferences.trainingDays, day];
                    setData({
                      ...data,
                      preferences: { ...data.preferences, trainingDays: updatedDays }
                    });
                  }}
                  className="px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: data.preferences.trainingDays.includes(day) ? colors.primary : colors.surfaceLight,
                    color: data.preferences.trainingDays.includes(day) ? 'black' : 'white',
                    opacity: !isEditing ? 0.7 : 1,
                  }}
                >
                  {day}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-2">Preferred Time</label>
            <div className="flex flex-wrap gap-2">
              {['morning', 'afternoon', 'evening'].map((time) => (
                <motion.button
                  key={time}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!isEditing}
                  onClick={() => {
                    if (!isEditing) return;
                    setData({
                      ...data,
                      preferences: { ...data.preferences, preferredTime: time }
                    });
                  }}
                  className="px-4 py-2 rounded-full capitalize"
                  style={{
                    backgroundColor: data.preferences.preferredTime === time ? colors.primary : colors.surfaceLight,
                    color: data.preferences.preferredTime === time ? 'black' : 'white',
                    opacity: !isEditing ? 0.7 : 1,
                  }}
                >
                  {time}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SettingsTab({ data, setData, onPasswordChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Account Settings */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.surface }}>
        <h3 className="text-lg font-semibold text-white mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: colors.surfaceLight }}>
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-gray-400" />
              <div>
                <h4 className="text-white font-medium">Password</h4>
                <p className="text-sm text-gray-400">Change your password</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPasswordChange}
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <ChevronRight size={20} className="text-gray-400" />
            </motion.button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: colors.surfaceLight }}>
            <div className="flex items-center gap-3">
              <Award size={20} className="text-gray-400" />
              <div>
                <h4 className="text-white font-medium">Subscription</h4>
                <p className="text-sm text-gray-400">{data.subscription.plan} Plan • {data.subscription.status}</p>
              </div>
            </div>
            <span className="text-sm" style={{ color: colors.primary }}>
              Next billing: {new Date(data.subscription.nextBilling).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.surface }}>
        <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries(data.preferences.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: colors.surfaceLight }}>
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-gray-400" />
                <div>
                  <h4 className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                  <p className="text-sm text-gray-400">Receive notifications via {key}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setData({
                    ...data,
                    preferences: {
                      ...data.preferences,
                      notifications: {
                        ...data.preferences.notifications,
                        [key]: !value,
                      },
                    },
                  });
                }}
                className={`w-12 h-6 rounded-full p-1 flex items-center ${
                  value ? 'justify-end' : 'justify-start'
                }`}
                style={{ backgroundColor: value ? colors.primary : colors.surface }}
              >
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: value ? 'black' : 'white' }} />
              </motion.button>
            </div>
          ))}
        </div>
      </div>

      {/* App Settings */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.surface }}>
        <h3 className="text-lg font-semibold text-white mb-4">App Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: colors.surfaceLight }}>
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-gray-400" />
              <div>
                <h4 className="text-white font-medium">Language</h4>
                <p className="text-sm text-gray-400">App display language</p>
              </div>
            </div>
            <select
              value={data.preferences.language}
              onChange={(e) => setData({
                ...data,
                preferences: { ...data.preferences, language: e.target.value }
              })}
              className="bg-transparent text-white border border-gray-700 rounded-lg px-3 py-1"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: colors.surfaceLight }}>
            <div className="flex items-center gap-3">
              {data.preferences.theme === 'dark' ? <Moon size={20} className="text-gray-400" /> : <Sun size={20} className="text-gray-400" />}
              <div>
                <h4 className="text-white font-medium">Theme</h4>
                <p className="text-sm text-gray-400">App appearance</p>
              </div>
            </div>
            <select
              value={data.preferences.theme}
              onChange={(e) => setData({
                ...data,
                preferences: { ...data.preferences, theme: e.target.value }
              })}
              className="bg-transparent text-white border border-gray-700 rounded-lg px-3 py-1"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-xl" style={{ backgroundColor: colors.surface }}>
        <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 rounded-lg text-left border"
          style={{ borderColor: colors.error, color: colors.error }}
        >
          <h4 className="font-medium">Delete Account</h4>
          <p className="text-sm opacity-75">Permanently delete your account and all associated data</p>
        </motion.button>
      </div>
    </motion.div>
  );
}

function FormField({ icon: Icon, label, value, isEditing, onChange, type = 'text' }) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <Icon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        {isEditing ? (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: colors.surfaceLight,
              borderColor: 'transparent',
              focusRingColor: colors.primary 
            }}
          />
        ) : (
          <div className="w-full pl-10 pr-4 py-3 rounded-lg text-white" style={{ backgroundColor: colors.surfaceLight }}>
            {value}
          </div>
        )}
      </div>
    </div>
  );
}

function PasswordChangeModal({ onClose }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send data to the backend
    console.log('Changing password:', formData);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-xl overflow-hidden"
        style={{ backgroundColor: colors.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Change Password</h2>
           <button onClick={onClose} className="text-gray-400 hover:text-white">
             <X size={24} />
           </button>
         </div>

         <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label className="block text-sm text-gray-400 mb-1">Current Password</label>
             <div className="relative">
               <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
               <input
                 type={showPassword.current ? 'text' : 'password'}
                 value={formData.currentPassword}
                 onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                 className="w-full pl-10 pr-12 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                 style={{ 
                   backgroundColor: colors.surfaceLight,
                   borderColor: 'transparent',
                   focusRingColor: colors.primary 
                 }}
                 required
               />
               <button
                 type="button"
                 onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
               >
                 {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
             </div>
           </div>

           <div>
             <label className="block text-sm text-gray-400 mb-1">New Password</label>
             <div className="relative">
               <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
               <input
                 type={showPassword.new ? 'text' : 'password'}
                 value={formData.newPassword}
                 onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                 className="w-full pl-10 pr-12 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                 style={{ 
                   backgroundColor: colors.surfaceLight,
                   borderColor: 'transparent',
                   focusRingColor: colors.primary 
                 }}
                 required
               />
               <button
                 type="button"
                 onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
               >
                 {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
             </div>
           </div>

           <div>
             <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
             <div className="relative">
               <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
               <input
                 type={showPassword.confirm ? 'text' : 'password'}
                 value={formData.confirmPassword}
                 onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                 className="w-full pl-10 pr-12 py-3 rounded-lg text-white focus:outline-none focus:ring-2"
                 style={{ 
                   backgroundColor: colors.surfaceLight,
                   borderColor: 'transparent',
                   focusRingColor: colors.primary 
                 }}
                 required
               />
               <button
                 type="button"
                 onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
               >
                 {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
             </div>
           </div>

           <div className="flex gap-3 mt-6">
             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               type="submit"
               className="flex-1 py-3 rounded-lg font-semibold text-black"
               style={{ backgroundColor: colors.primary }}
             >
               Change Password
             </motion.button>
             <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               type="button"
               onClick={onClose}
               className="flex-1 py-3 rounded-lg font-medium border"
               style={{ borderColor: colors.surfaceLight, color: colors.textSecondary }}
             >
               Cancel
             </motion.button>
           </div>
         </form>
       </div>
     </motion.div>
   </motion.div>
 );
}