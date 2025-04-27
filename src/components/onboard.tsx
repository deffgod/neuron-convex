'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Activity, Dumbbell, Calendar, Settings, ChevronRight, Play, Award, 
  User, Bell, Home, Search, Heart, BookOpen, ArrowLeft, X, CheckCircle,
  BarChart2, Timer, Target, Video, Camera, Mail, Lock, Eye, EyeOff, Clock,
  Zap, Info, Check, AlertCircle, Sunrise, Sun, Sunset, GitBranch, Package
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

// Main Application Component
export default function NeuronlineApp() {
  const [currentView, setCurrentView] = useState('landing');
  const [authStep, setAuthStep] = useState('');
  const [userData, setUserData] = useState({
    isAuthenticated: false,
    email: '',
    password: '',
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: '',
    goals: [],
    trainingDays: [],
    equipment: [],
    preferredTime: '',
    testResults: {},
    generatedPlan: null,
  });

  // Navigation items for authenticated user
  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'workouts', icon: Dumbbell, label: 'Workouts' },
    { id: 'neuro', icon: Brain, label: 'Neuro' },
    { id: 'progress', icon: Activity, label: 'Progress' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  // Handle authentication flow completion
  const completeAuthentication = () => {
    setUserData(prev => ({ ...prev, isAuthenticated: true }));
    setCurrentView('home');
  };

  // Render appropriate view based on current state
  const renderContent = () => {
    if (!userData.isAuthenticated) {
      switch (currentView) {
        case 'landing':
          return <LandingScreen onNext={() => setCurrentView('register')} />;
        case 'register':
          return <RegistrationScreen userData={userData} setUserData={setUserData} onNext={() => setCurrentView('profile')} />;
        case 'profile':
          return <ProfileCreation userData={userData} setUserData={setUserData} onNext={() => setCurrentView('goals')} onBack={() => setCurrentView('register')} />;
        case 'goals':
          return <GoalsSelection userData={userData} setUserData={setUserData} onNext={() => setCurrentView('schedule')} onBack={() => setCurrentView('profile')} />;
        case 'schedule':
          return <ScheduleSetup userData={userData} setUserData={setUserData} onNext={() => setCurrentView('equipment')} onBack={() => setCurrentView('goals')} />;
        case 'equipment':
          return <EquipmentSelection userData={userData} setUserData={setUserData} onNext={() => setCurrentView('neurotest')} onBack={() => setCurrentView('schedule')} />;
        case 'neurotest':
          return <NeurotestingModule userData={userData} setUserData={setUserData} onNext={() => setCurrentView('plan')} onBack={() => setCurrentView('equipment')} />;
        case 'plan':
          return <PlanGeneration userData={userData} setUserData={setUserData} onComplete={completeAuthentication} />;
        default:
          return <LandingScreen onNext={() => setCurrentView('register')} />;
      }
    } else {
      switch (currentView) {
        case 'home':
          return <HomeView userData={userData} setCurrentView={setCurrentView} />;
        case 'workouts':
          return <WorkoutsView userData={userData} />;
        case 'neuro':
          return <NeuroView userData={userData} setUserData={setUserData} />;
        case 'progress':
          return <ProgressView userData={userData} />;
        case 'profile':
          return <ProfileView userData={userData} />;
        case 'settings':
          return <SettingsView setUserData={setUserData} setCurrentView={setCurrentView} />;
        default:
          return <HomeView userData={userData} setCurrentView={setCurrentView} />;
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header - only for authenticated users */}
      {userData.isAuthenticated && (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between" 
                style={{ backgroundColor: colors.surface }}>
          <div className="flex items-center">
            <Brain className="h-8 w-8 mr-2" style={{ color: colors.primary }} />
            <span className="text-xl font-bold text-white">Neuronline</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentView('settings')}
          >
            <Settings size={20} className="text-gray-400" />
          </motion.button>
        </header>
      )}

      {/* Main Content */}
      <main className={userData.isAuthenticated ? "pt-16 pb-20" : ""}>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation - only for authenticated users */}
      {userData.isAuthenticated && (
        <nav className="fixed bottom-0 left-0 right-0 z-50" 
             style={{ backgroundColor: colors.surface }}>
          <div className="flex justify-around items-center py-3">
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className="flex flex-col items-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon 
                  size={24} 
                  color={currentView === item.id ? colors.primary : colors.textSecondary} 
                />
                <span 
                  className="text-xs mt-1"
                  style={{ color: currentView === item.id ? colors.primary : colors.textSecondary }}
                >
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}

// Landing Screen
function LandingScreen({ onNext }) {
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="text-center mb-12"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          animate={{ 
            y: [0, -10, 0],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Brain className="w-24 h-24 mx-auto mb-8" style={{ color: colors.primary }} />
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-4">Neuronline</h1>
        <p className="text-xl text-gray-400 mb-6">Next-Generation Neuro-Fitness</p>
        <p className="text-gray-500 max-w-md">
          Combining brain and body training into a unique approach based on neurophysiology and cognitive science
        </p>
      </motion.div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNext}
        className="px-8 py-3 rounded-full font-medium text-black flex items-center gap-2"
        style={{ backgroundColor: colors.primary }}
      >
        Get Started
        <ChevronRight size={20} />
      </motion.button>
    </motion.div>
  );
}

// Registration Screen
function RegistrationScreen({ userData, setUserData, onNext }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div 
      className="min-h-screen px-6 py-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
      <p className="text-gray-400 mb-8">Start your neurofitness journey today</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({...userData, email: e.target.value})}
              className="w-full py-3 pl-12 pr-4 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: colors.surfaceLight,
                borderColor: 'transparent',
                focusRingColor: colors.primary 
              }}
              placeholder="your@email.com"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              value={userData.password}
              onChange={(e) => setUserData({...userData, password: e.target.value})}
              className="w-full py-3 pl-12 pr-12 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: colors.surfaceLight,
                borderColor: 'transparent',
                focusRingColor: colors.primary 
              }}
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="w-full py-4 rounded-xl font-semibold text-black"
          style={{ backgroundColor: colors.primary }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
}

// Profile Creation Screen
function ProfileCreation({ userData, setUserData, onNext, onBack }) {
  return (
    <motion.div 
      className="min-h-screen px-6 py-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <motion.button 
        onClick={onBack}
        className="mb-8 flex items-center text-gray-400"
        whileHover={{ x: -4 }}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </motion.button>
      
      <h1 className="text-2xl font-bold text-white mb-2">Your Profile</h1>
      <p className="text-gray-400 mb-8">Tell us about yourself</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({...userData, name: e.target.value})}
            className="w-full py-3 px-4 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: colors.surfaceLight,
              borderColor: 'transparent',
              focusRingColor: colors.primary 
            }}
            placeholder="Your name"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Age</label>
            <input
              type="number"
              value={userData.age}
              onChange={(e) => setUserData({...userData, age: e.target.value})}
              className="w-full py-3 px-4 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: colors.surfaceLight,
                borderColor: 'transparent',
                focusRingColor: colors.primary 
              }}
              placeholder="Years"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Gender</label>
            <select
              value={userData.gender}
              onChange={(e) => setUserData({...userData, gender: e.target.value})}
              className="w-full py-3 px-4 rounded-lg text-white focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: colors.surfaceLight,
                borderColor: 'transparent',
                focusRingColor: colors.primary 
              }}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Height (cm)</label>
            <input
              type="number"
              value={userData.height}
              onChange={(e) => setUserData({...userData, height: e.target.value})}
              className="w-full py-3 px-4 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: colors.surfaceLight,
                borderColor: 'transparent',
                focusRingColor: colors.primary 
              }}
              placeholder="cm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Weight (kg)</label>
            <input
              type="number"
              value={userData.weight}
              onChange={(e) => setUserData({...userData, weight: e.target.value})}
              className="w-full py-3 px-4 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: colors.surfaceLight,
                borderColor: 'transparent',
                focusRingColor: colors.primary 
              }}
              placeholder="kg"
            />
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="w-full py-4 rounded-xl font-semibold text-black"
          style={{ backgroundColor: colors.primary }}
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );
}

// Goals Selection Screen
function GoalsSelection({ userData, setUserData, onNext, onBack }) {
  const goals = [
    { id: 'cognitive', name: 'Improve Cognitive Function', icon: Brain, description: 'Enhance brain power, memory and focus' },
    { id: 'physical', name: 'Physical Fitness', icon: Dumbbell, description: 'Build strength and endurance' },
    { id: 'balance', name: 'Balance & Coordination', icon: Activity, description: 'Improve stability and movement control' },
    { id: 'stress', name: 'Stress Reduction', icon: Heart, description: 'Relaxation and emotional balance' },
    { id: 'energy', name: 'Energy Boost', icon: Zap, description: 'Increase vitality and alertness' },
  ];

  const toggleGoal = (goalId) => {
    const updatedGoals = userData.goals.includes(goalId)
      ? userData.goals.filter(id => id !== goalId)
      : [...userData.goals, goalId];
    setUserData({ ...userData, goals: updatedGoals });
  };

  return (
    <motion.div 
      className="min-h-screen px-6 py-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <motion.button 
        onClick={onBack}
        className="mb-8 flex items-center text-gray-400"
        whileHover={{ x: -4 }}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </motion.button>
      
      <h1 className="text-2xl font-bold text-white mb-2">Your Goals</h1>
      <p className="text-gray-400 mb-8">What would you like to achieve?</p>
      
      <div className="space-y-4">
        {goals.map((goal) => (
          <motion.button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all ${
              userData.goals.includes(goal.id)
                ? 'border-2'
                : 'border border-transparent'
            }`}
            style={{ 
              backgroundColor: colors.surface,
              borderColor: userData.goals.includes(goal.id) ? colors.primary : 'transparent'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                userData.goals.includes(goal.id) ? 'opacity-100' : 'opacity-70'
              }`}
              style={{ 
                backgroundColor: userData.goals.includes(goal.id) ? `${colors.primary}20` : colors.surfaceLight,
                color: userData.goals.includes(goal.id) ? colors.primary : colors.textSecondary
              }}
            >
              <goal.icon size={24} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-white">{goal.name}</h3>
              <p className="text-sm text-gray-400">{goal.description}</p>
            </div>
            {userData.goals.includes(goal.id) && (
              <CheckCircle size={20} style={{ color: colors.primary }} />
            )}
          </motion.button>
        ))}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="w-full py-4 rounded-xl font-semibold text-black mt-8"
        style={{ 
          backgroundColor: colors.primary,
          opacity: userData.goals.length === 0 ? 0.5 : 1 
        }}
        disabled={userData.goals.length === 0}
      >
        Continue
      </motion.button>
    </motion.div>
  );
}

// Schedule Setup Screen
function ScheduleSetup({ userData, setUserData, onNext, onBack }) {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = [
    { id: 'morning', label: 'Morning (6-9am)', icon: '🌅' },
    { id: 'day', label: 'Day (10am-4pm)', icon: '☀️' },
    { id: 'evening', label: 'Evening (5-9pm)', icon: '🌙' },
  ];
  
  const toggleDay = (day) => {
    const updatedDays = userData.trainingDays.includes(day)
      ? userData.trainingDays.filter(d => d !== day)
      : [...userData.trainingDays, day];
    setUserData({ ...userData, trainingDays: updatedDays });
  };

  return (
    <motion.div 
      className="min-h-screen px-6 py-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <motion.button 
        onClick={onBack}
        className="mb-8 flex items-center text-gray-400"
        whileHover={{ x: -4 }}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </motion.button>
      
      <h1 className="text-2xl font-bold text-white mb-2">Training Schedule</h1>
      <p className="text-gray-400 mb-8">When would you like to train?</p>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Select Days</h3>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => (
            <motion.button
              key={day}
              onClick={() => toggleDay(day)}
              className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium`}
              style={{ 
                backgroundColor: userData.trainingDays.includes(day) ? colors.primary : colors.surface,
                color: userData.trainingDays.includes(day) ? '#000' : colors.textPrimary
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {day}
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white mb-4">Preferred Time</h3>
        <div className="space-y-3">
          {timeSlots.map((slot) => (
            <motion.button
              key={slot.id}
              onClick={() => setUserData({...userData, preferredTime: slot.id})}
              className={`w-full p-4 rounded-xl flex items-center gap-3 ${
                userData.preferredTime === slot.id ? 'border-2' : 'border border-transparent'
              }`}
              style={{ 
                backgroundColor: colors.surface,
                borderColor: userData.preferredTime === slot.id ? colors.primary : 'transparent'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-2xl">{slot.icon}</span>
              <span className="text-white font-medium">{slot.label}</span>
              {userData.preferredTime === slot.id && (
                <CheckCircle size={20} style={{ color: colors.primary }} className="ml-auto" />
              )}
            </motion.button>
          ))}
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="w-full py-4 rounded-xl font-semibold text-black"
        style={{ 
          backgroundColor: colors.primary,
          opacity: userData.trainingDays.length === 0 || !userData.preferredTime ? 0.5 : 1 
        }}
        disabled={userData.trainingDays.length === 0 || !userData.preferredTime}
      >
        Continue
      </motion.button>
    </motion.div>
  );
}

// Equipment Selection Screen
function EquipmentSelection({ userData, setUserData, onNext, onBack }) {
  const equipment = [
    { id: 'none', name: 'No Equipment', icon: User },
    { id: 'dumbbells', name: 'Dumbbells', icon: Dumbbell },
    { id: 'resistance', name: 'Resistance Bands', icon: Activity },
    { id: 'yoga', name: 'Yoga Mat', icon: Heart },
  ];

  const toggleEquipment = (equipmentId) => {
    const updatedEquipment = userData.equipment.includes(equipmentId)
      ? userData.equipment.filter(id => id !== equipmentId)
      : [...userData.equipment, equipmentId];
    setUserData({ ...userData, equipment: updatedEquipment });
  };

  return (
    <motion.div 
      className="min-h-screen px-6 py-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <motion.button 
        onClick={onBack}
        className="mb-8 flex items-center text-gray-400"
        whileHover={{ x: -4 }}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </motion.button>
      
      <h1 className="text-2xl font-bold text-white mb-2">Available Equipment</h1>
      <p className="text-gray-400 mb-8">Select what you have access to</p>
      
      <div className="grid grid-cols-2 gap-4">
        {equipment.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => toggleEquipment(item.id)}
            className={`p-6 rounded-xl flex flex-col items-center gap-3 ${
              userData.equipment.includes(item.id) ? 'border-2' : 'border border-transparent'
            }`}
            style={{ 
              backgroundColor: colors.surface,
              borderColor: userData.equipment.includes(item.id) ? colors.primary : 'transparent'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className={`w-12 h-12 rounded-full flex items-center justify-center`}
              style={{ 
                backgroundColor: userData.equipment.includes(item.id) ? `${colors.primary}20` : colors.surfaceLight,
                color: userData.equipment.includes(item.id) ? colors.primary : colors.textSecondary
              }}
            >
              <item.icon size={24} />
            </div>
            <span className={`text-sm font-medium ${
              userData.equipment.includes(item.id) ? 'text-white' : 'text-gray-400'
            }`}>
              {item.name}
            </span>
          </motion.button>
        ))}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="w-full py-4 rounded-xl font-semibold text-black mt-8"
        style={{ backgroundColor: colors.primary }}
      >
        Continue
      </motion.button>
    </motion.div>
  );
}

// Neurotesting Module
function NeurotestingModule({ userData, setUserData, onNext, onBack }) {
  const [activeTest, setActiveTest] = useState(null);
  const [testPhase, setTestPhase] = useState('overview');
  const [testScore, setTestScore] = useState(0);
  
  const tests = [
    {
      id: 'memory',
      name: 'Memory Test',
      description: 'Test your visual memory and pattern recognition',
      icon: Brain,
      color: colors.accent2,
      duration: '2 min',
    },
    {
      id: 'reaction',
      name: 'Reaction Time',
      description: 'Measure your speed and accuracy',
      icon: Zap,
      color: colors.accent3,
      duration: '1 min',
    },
    {
      id: 'focus',
      name: 'Focus Test',
      description: 'Assess your concentration ability',
      icon: Target,
      color: colors.accent1,
      duration: '3 min',
    },
  ];

  const startTest = (test) => {
    setActiveTest(test);
    setTestPhase('active');
    setTestScore(0);
  };

  const completeTest = (score) => {
    setUserData(prev => ({
      ...prev,
      testResults: {
        ...prev.testResults,
        [activeTest.id]: score,
      }
    }));
    setActiveTest(null);
    setTestPhase('overview');
  };

  const allTestsCompleted = Object.keys(userData.testResults).length === tests.length;

  // Simplified test component for demo
  const TestComponent = ({ test, onComplete }) => {
    useEffect(() => {
      // Simulate test completion after 3 seconds
      const timer = setTimeout(() => {
        const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
        onComplete(score);
      }, 3000);
      
      return () => clearTimeout(timer);
    }, []);

    return (
      <motion.div 
        className="flex flex-col items-center justify-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <test.icon size={64} color={test.color} />
        </motion.div>
        <p className="text-white mt-4">Conducting {test.name}...</p>
      </motion.div>
    );
  };

  if (testPhase === 'overview') {
    return (
      <motion.div 
        className="min-h-screen px-6 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.button 
          onClick={onBack}
          className="mb-8 flex items-center text-gray-400"
          whileHover={{ x: -4 }}
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </motion.button>
        
        <h1 className="text-2xl font-bold text-white mb-2">Neurotesting</h1>
        <p className="text-gray-400 mb-8">
          Complete these tests to assess your cognitive abilities
        </p>
        
        <div className="space-y-4">
          {tests.map((test) => (
            <motion.button
              key={test.id}
              onClick={() => startTest(test)}
              disabled={!!userData.testResults[test.id]}
              className={`w-full p-4 rounded-xl flex items-center gap-4 ${
                userData.testResults[test.id] ? 'opacity-75' : ''
              }`}
              style={{ backgroundColor: colors.surface }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${test.color}20` }}
              >
                <test.icon size={24} style={{ color: test.color }} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-white">{test.name}</h3>
                <p className="text-sm text-gray-400">{test.description}</p>
              </div>
              <div>
                {userData.testResults[test.id] ? (
                  <div className="flex items-center gap-2">
                    <Check size={20} className="text-green-500" />
                    <span className="text-white">{userData.testResults[test.id]}%</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">{test.duration}</span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
        
        {allTestsCompleted && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="w-full py-4 rounded-xl font-semibold text-black mt-8"
            style={{ backgroundColor: colors.primary }}
          >
            View Results
          </motion.button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen px-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {activeTest && <TestComponent test={activeTest} onComplete={completeTest} />}
    </motion.div>
  );
}

// Plan Generation Screen
function PlanGeneration({ userData, setUserData, onComplete }) {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          // Generate sample plan
          const plan = {
            name: 'Personalized Neurofitness Program',
            duration: 8,
            sessionsPerWeek: 3,
            workoutDuration: 30,
            level: 'Intermediate',
          };
          setUserData(prev => ({ ...prev, generatedPlan: plan }));
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="mb-8"
      >
        <Brain size={64} color={colors.primary} />
      </motion.div>
      
      <h1 className="text-2xl font-bold text-white mb-4">Creating Your Plan</h1>
      <p className="text-gray-400 mb-8 text-center">
        Our AI is personalizing your neurofitness program
      </p>
      
      <div className="w-64 h-2 rounded-full overflow-hidden mb-4" style={{ backgroundColor: colors.surface }}>
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: colors.primary }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      
      <span className="text-white font-medium">{progress}%</span>
    </motion.div>
  );
}

// Home View for authenticated users
function HomeView({ userData, setCurrentView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 py-8"
    >
      <h1 className="text-2xl font-bold text-white mb-2">Welcome back, {userData.name}!</h1>
      <p className="text-gray-400 mb-8">Your neurofitness journey continues.</p>
      
      {/* Today's workout card */}
      <motion.div 
        className="p-6 rounded-xl mb-6"
        style={{ backgroundColor: colors.surface }}
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="text-white font-semibold mb-2">Today's Workout</h3>
        <p className="text-gray-400 mb-4">Neural Activation - Beginner Level</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-3 rounded-lg font-medium text-black flex items-center justify-center gap-2"
          style={{ backgroundColor: colors.primary }}
        >
          <Play size={20} />
          Start Workout
        </motion.button>
      </motion.div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div 
          className="p-4 rounded-xl text-center"
          style={{ backgroundColor: colors.surface }}
          whileHover={{ scale: 1.02 }}
        >
          <Activity size={24} className="mx-auto mb-2" style={{ color: colors.primary }} />
          <p className="text-white font-semibold">8</p>
          <p className="text-sm text-gray-400">Day Streak</p>
        </motion.div>
        
        <motion.div 
          className="p-4 rounded-xl text-center"
          style={{ backgroundColor: colors.surface }}
          whileHover={{ scale: 1.02 }}
        >
          <Award size={24} className="mx-auto mb-2" style={{ color: colors.primary }} />
          <p className="text-white font-semibold">75%</p>
          <p className="text-sm text-gray-400">Progress</p>
        </motion.div>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { id: 'neuro', label: 'Neurotest', icon: Brain, color: colors.accent1 },
          { id: 'workouts', label: 'Workouts', icon: Dumbbell, color: colors.primary },
          { id: 'progress', label: 'Progress', icon: Activity, color: colors.accent2 },
          { id: 'profile', label: 'Profile', icon: User, color: colors.textSecondary },
        ].map((card) => (
          <motion.button
            key={card.id}
            onClick={() => setCurrentView(card.id)}
            className="p-6 rounded-xl flex flex-col items-center justify-center"
            style={{ backgroundColor: colors.surface }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <card.icon size={32} color={card.color} className="mb-3" />
            <span className="text-white font-medium">{card.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

// Workouts View
function WorkoutsView({ userData }) {
  const workouts = [
    { id: 1, title: 'Neural Activation', duration: '20 min', difficulty: 'Beginner', scheduled: 'Today' },
    { id: 2, title: 'Balance Training', duration: '15 min', difficulty: 'Intermediate', scheduled: 'Tomorrow' },
    { id: 3, title: 'Cognitive Strength', duration: '30 min', difficulty: 'Advanced', scheduled: 'Friday' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 py-8"
    >
      <h1 className="text-2xl font-bold text-white mb-8">Workouts</h1>
      
      <div className="space-y-4">
        {workouts.map((workout) => (
          <motion.div
            key={workout.id}
            className="p-4 rounded-xl"
            style={{ backgroundColor: colors.surface }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-white font-semibold">{workout.title}</h3>
                <p className="text-sm text-gray-400">{workout.scheduled}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs" 
                    style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}>
                {workout.difficulty}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{workout.duration}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                <Play size={20} className="text-black" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Neuro View
function NeuroView({ userData, setUserData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 py-8"
    >
      <h1 className="text-2xl font-bold text-white mb-8">Neurotesting</h1>
      
      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: colors.surface }}>
        <h3 className="text-white font-semibold mb-4">Your Cognitive Profile</h3>
        <div className="space-y-4">
          {Object.entries(userData.testResults).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400 capitalize">{key}</span>
                <span className="text-white">{value}%</span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: colors.surfaceLight }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: colors.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-xl font-semibold text-black"
        style={{ backgroundColor: colors.primary }}
      >
        Retake Neurotests
      </motion.button>
    </motion.div>
  );
}

// Progress View
function ProgressView({ userData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 py-8"
    >
      <h1 className="text-2xl font-bold text-white mb-8">Your Progress</h1>
      
      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: colors.surface }}>
        <h3 className="text-white font-semibold mb-4">Weekly Statistics</h3>
        <div className="space-y-4">
          {[
            { label: 'Neural Training', value: 75, color: colors.primary },
            { label: 'Physical Training', value: 60, color: colors.accent1 },
            { label: 'Overall Progress', value: 68, color: colors.accent2 },
          ].map((metric) => (
            <div key={metric.label}>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">{metric.label}</span>
                <span className="text-white">{metric.value}%</span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: colors.surfaceLight }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: metric.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="rounded-xl p-6" style={{ backgroundColor: colors.surface }}>
        <h3 className="text-white font-semibold mb-4">Achievements</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Award, title: 'First Week', achieved: true },
            { icon: Brain, title: 'Neuro Master', achieved: true },
            { icon: Dumbbell, title: 'Strength Pro', achieved: false },
          ].map((achievement, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg text-center ${
                achievement.achieved ? '' : 'opacity-50'
              }`}
              style={{ backgroundColor: colors.surfaceLight }}
            >
              <achievement.icon 
                size={24} 
                className={`mx-auto mb-2 ${
                  achievement.achieved ? 'text-green-500' : 'text-gray-500'
                }`}
              />
              <p className="text-xs text-white">{achievement.title}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Profile View
function ProfileView({ userData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 py-8"
    >
      <h1 className="text-2xl font-bold text-white mb-8">Your Profile</h1>
      
      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: colors.surface }}>
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <User size={32} className="text-black" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{userData.name}</h3>
            <p className="text-gray-400">{userData.email}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-400">Age</span>
            <span className="text-white">{userData.age} years</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Height</span>
            <span className="text-white">{userData.height} cm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Weight</span>
            <span className="text-white">{userData.weight} kg</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Training Days</span>
            <span className="text-white">{userData.trainingDays.length} days/week</span>
          </div>
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-xl font-semibold text-white border border-gray-700"
      >
        Edit Profile
      </motion.button>
    </motion.div>
  );
}

// Settings View
function SettingsView({ setUserData, setCurrentView }) {
  const handleLogout = () => {
    setUserData({
      isAuthenticated: false,
      email: '',
      password: '',
      name: '',
      age: '',
      height: '',
      weight: '',
      gender: '',
      goals: [],
      trainingDays: [],
      equipment: [],
      preferredTime: '',
      testResults: {},
      generatedPlan: null,
    });
    setCurrentView('landing');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="px-6 py-8"
    >
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>
      
      <div className="space-y-4">
        {[
          { icon: Bell, label: 'Notifications' },
          { icon: Lock, label: 'Privacy' },
          { icon: User, label: 'Account' },
          { icon: Heart, label: 'Support' },
          { icon: Info, label: 'About' },
        ].map((item) => (
          <motion.button
            key={item.label}
            className="w-full p-4 rounded-xl flex items-center justify-between"
            style={{ backgroundColor: colors.surface }}
            whileHover={{ x: 5 }}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="text-gray-400" />
              <span className="text-white">{item.label}</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </motion.button>
        ))}
        
        <motion.button
          onClick={handleLogout}
          className="w-full p-4 rounded-xl flex items-center justify-between"
          style={{ backgroundColor: colors.surface }}
          whileHover={{ x: 5 }}
        >
          <div className="flex items-center gap-3">
            <ArrowLeft size={20} className="text-red-500" />
            <span className="text-red-500">Logout</span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}
