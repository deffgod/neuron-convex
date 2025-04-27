'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Eye, Zap, Target, Activity, CheckCircle, Clock, 
  ChevronRight, X, AlertCircle, ArrowLeft, BarChart2, Info,
  Award, Play, Pause, RotateCcw, Volume2, VolumeX
} from 'lucide-react';
import * as Recharts from 'recharts';
const { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } = Recharts;

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

// Test configurations
const testConfigs = [
  {
    id: 'visual',
    name: 'Visual Processing',
    description: 'Test your visual tracking and pattern recognition abilities',
    icon: Eye,
    color: colors.accent1,
    duration: 120,
    instructions: 'Follow the moving target with your eyes. Click when you see it change color.',
  },
  {
    id: 'reaction',
    name: 'Reaction Speed',
    description: 'Measure your response time to visual and auditory stimuli',
    icon: Zap,
    color: colors.primary,
    duration: 90,
    instructions: 'Click the screen as quickly as possible when the signal appears.',
  },
  {
    id: 'memory',
    name: 'Working Memory',
    description: 'Assess your ability to retain and manipulate information',
    icon: Brain,
    color: colors.accent2,
    duration: 180,
    instructions: 'Remember the sequence and repeat it in the correct order.',
  },
  {
    id: 'coordination',
    name: 'Hand-Eye Coordination',
    description: 'Evaluate your motor control and precision',
    icon: Target,
    color: colors.accent3,
    duration: 150,
    instructions: 'Trace the path as accurately as possible using your mouse or finger.',
  },
  {
    id: 'balance',
    name: 'Balance Assessment',
    description: 'Measure your proprioceptive awareness and stability',
    icon: Activity,
    color: colors.success,
    duration: 120,
    instructions: 'Stand on one leg and maintain balance for the duration.',
  },
];

export default function Neurotest() {
  const [currentView, setCurrentView] = useState('overview'); // overview, active, results
  const [activeTest, setActiveTest] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [testPhase, setTestPhase] = useState('instructions'); // instructions, active, complete
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const startTest = (test) => {
    setActiveTest(test);
    setCurrentView('active');
    setTestPhase('instructions');
    setTimeRemaining(test.duration);
  };

  const completeTest = (score) => {
    setTestResults(prev => ({
      ...prev,
      [activeTest.id]: { score, timestamp: new Date() }
    }));
    setTestPhase('complete');
    setTimeout(() => {
      setCurrentView('overview');
      setActiveTest(null);
      if (Object.keys(testResults).length === testConfigs.length - 1) {
        setCurrentView('results');
      }
    }, 2000);
  };

  const resetTests = () => {
    setTestResults({});
    setCurrentView('overview');
  };

  if (currentView === 'results') {
    return <ResultsDashboard results={testResults} onReset={resetTests} />;
  }

  if (currentView === 'active' && activeTest) {
    return (
      <ActiveTest
        test={activeTest}
        onComplete={completeTest}
        onBack={() => setCurrentView('overview')}
        testPhase={testPhase}
        setTestPhase={setTestPhase}
        timeRemaining={timeRemaining}
        setTimeRemaining={setTimeRemaining}
        soundEnabled={soundEnabled}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-black/70">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Neurotesting</h1>
              <p className="text-sm text-gray-400">Assess your cognitive baseline</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              {soundEnabled ? <Volume2 size={20} className="text-white" /> : <VolumeX size={20} className="text-gray-400" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Progress Overview */}
        <div className="mb-8 p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Progress</h2>
            <span className="text-sm text-gray-400">
              {Object.keys(testResults).length} of {testConfigs.length} completed
            </span>
          </div>
          <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.surfaceLight }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: colors.primary }}
              initial={{ width: 0 }}
              animate={{ width: `${(Object.keys(testResults).length / testConfigs.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Test Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testConfigs.map((test) => (
            <TestCard
              key={test.id}
              test={test}
              completed={!!testResults[test.id]}
              result={testResults[test.id]}
              onStart={() => startTest(test)}
            />
          ))}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 rounded-xl"
          style={{ backgroundColor: colors.surface }}
        >
          <div className="flex items-start gap-4">
            <Info size={24} className="flex-shrink-0" style={{ color: colors.primary }} />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">About Neurotesting</h3>
              <p className="text-gray-400">
                These tests are designed to assess various aspects of your neurological function, 
                including visual processing, reaction time, memory, coordination, and balance. 
                Your results will help create a personalized training program tailored to your needs.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function TestCard({ test, completed, result, onStart }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="p-6 rounded-xl"
      style={{ backgroundColor: colors.surface }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center"
             style={{ backgroundColor: `${test.color}20` }}>
          <test.icon size={24} style={{ color: test.color }} />
        </div>
        {completed && (
          <CheckCircle size={24} style={{ color: colors.success }} />
        )}
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">{test.name}</h3>
      <p className="text-sm text-gray-400 mb-4">{test.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock size={16} />
          <span>{Math.floor(test.duration / 60)} min</span>
        </div>
        
        {completed ? (
          <div className="text-sm font-medium" style={{ color: test.color }}>
            Score: {result.score}%
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-4 py-2 rounded-lg font-medium text-black"
            style={{ backgroundColor: test.color }}
          >
            Start Test
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

function ActiveTest({ test, onComplete, onBack, testPhase, setTestPhase, timeRemaining, setTimeRemaining, soundEnabled }) {
  useEffect(() => {
    if (testPhase === 'active' && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && testPhase === 'active') {
      // Simulate test completion
      const score = Math.floor(Math.random() * 30) + 70; // Random score 70-100
      onComplete(score);
    }
  }, [testPhase, timeRemaining]);

  const startActiveTest = () => {
    setTestPhase('active');
    setTimeRemaining(test.duration);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-black/70">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.button
            whileHover={{ x: -4 }}
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </motion.button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-white">{test.name}</h1>
            {testPhase === 'active' && (
              <p className="text-sm text-gray-400">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </p>
            )}
          </div>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {testPhase === 'instructions' && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="mb-8">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                     style={{ backgroundColor: `${test.color}20` }}>
                  <test.icon size={40} style={{ color: test.color }} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Instructions</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">{test.instructions}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startActiveTest}
                className="px-8 py-3 rounded-lg font-semibold text-black"
                style={{ backgroundColor: test.color }}
              >
                Start Test
              </motion.button>
            </motion.div>
          )}

          {testPhase === 'active' && (
            <motion.div
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {/* Simplified test visualization */}
              <div className="mb-8">
                <div className="w-64 h-64 mx-auto rounded-full border-4 relative"
                     style={{ borderColor: test.color }}>
                  <motion.div
                    className="absolute w-6 h-6 rounded-full"
                    style={{ backgroundColor: test.color }}
                    animate={{
                      top: ['20%', '80%', '50%', '20%'],
                      left: ['20%', '50%', '80%', '20%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </div>
              </div>
              <p className="text-white">Test in progress...</p>
            </motion.div>
          )}

          {testPhase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <CheckCircle size={64} className="mx-auto mb-4" style={{ color: colors.success }} />
              <h2 className="text-2xl font-bold text-white mb-2">Test Complete!</h2>
              <p className="text-gray-400">Processing your results...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ResultsDashboard({ results, onReset }) {
  const chartData = Object.entries(results).map(([testId, data]) => {
    const test = testConfigs.find(t => t.id === testId);
    return {
      subject: test?.name || testId,
      score: data.score,
      fullMark: 100,
    };
  });

  const overallScore = Math.round(
    Object.values(results).reduce((acc, curr) => acc + curr.score, 0) / Object.keys(results).length
  );

  const getPerformanceLevel = (score) => {
    if (score >= 90) return { level: 'Excellent', color: colors.success };
    if (score >= 75) return { level: 'Good', color: colors.primary };
    if (score >= 60) return { level: 'Average', color: colors.accent3 };
    return { level: 'Needs Improvement', color: colors.error };
  };

  const performance = getPerformanceLevel(overallScore);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-black/70">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-white">Your Neural Profile</h1>
          <p className="text-sm text-gray-400">Comprehensive test results</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Overall Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-xl text-center"
          style={{ backgroundColor: colors.surface }}
        >
          <h2 className="text-lg font-semibold text-gray-400 mb-4">Overall Neural Score</h2>
          <div className="text-6xl font-bold mb-2" style={{ color: performance.color }}>
            {overallScore}
          </div>
          <p className="text-lg font-medium" style={{ color: performance.color }}>
            {performance.level}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-xl"
            style={{ backgroundColor: colors.surface }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Performance Profile</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={chartData}>
                  <PolarGrid stroke="#333" />
                  <PolarAngleAxis dataKey="subject" stroke="#666" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#666" />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke={colors.primary}
                    fill={colors.primary}
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Individual Scores */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-xl"
            style={{ backgroundColor: colors.surface }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Individual Test Results</h3>
            <div className="space-y-4">
              {testConfigs.map((test) => {
                const result = results[test.id];
                if (!result) return null;
                
                const performanceData = getPerformanceLevel(result.score);
                
                return (
                  <div key={test.id} className="p-4 rounded-lg" style={{ backgroundColor: colors.surfaceLight }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center"
                             style={{ backgroundColor: `${test.color}20` }}>
                          <test.icon size={20} style={{ color: test.color }} />
                        </div>
                        <span className="font-medium text-white">{test.name}</span>
                      </div>
                      <span className="font-bold" style={{ color: performanceData.color }}>
                        {result.score}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.background }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: performanceData.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.score}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-xl"
          style={{ backgroundColor: colors.surface }}
        >
          <h3 className="text-lg font-semibold text-white mb-4">Personalized Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getRecommendations(results).map((rec, index) => (
              <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: colors.surfaceLight }}>
                <div className="flex items-center gap-3 mb-2">
                  <rec.icon size={20} style={{ color: rec.color }} />
                  <h4 className="font-medium text-white">{rec.title}</h4>
                </div>
                <p className="text-sm text-gray-400">{rec.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg font-semibold text-black"
            style={{ backgroundColor: colors.primary }}
          >
            Start Training Program
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="px-6 py-3 rounded-lg font-medium border"
            style={{ borderColor: colors.surfaceLight, color: colors.textSecondary }}
          >
            <RotateCcw size={20} className="inline mr-2" />
            Retake Tests
          </motion.button>
        </div>
      </main>
    </div>
  );
}

function getRecommendations(results) {
  const recommendations = [];
  
  // Analyze results and provide recommendations
  Object.entries(results).forEach(([testId, data]) => {
    const test = testConfigs.find(t => t.id === testId);
    if (!test) return;
    
    if (data.score < 70) {
      switch (testId) {
        case 'visual':
          recommendations.push({
            title: 'Visual Training',
            description: 'Focus on eye tracking exercises and visual processing drills',
            icon: Eye,
            color: colors.accent1,
          });
          break;
        case 'reaction':
          recommendations.push({
            title: 'Reaction Drills',
            description: 'Practice quick response exercises and stimulus recognition',
            icon: Zap,
            color: colors.primary,
          });
          break;
        case 'memory':
          recommendations.push({
            title: 'Memory Enhancement',
            description: 'Engage in working memory exercises and cognitive challenges',
            icon: Brain,
            color: colors.accent2,
          });
          break;
        case 'coordination':
          recommendations.push({
            title: 'Coordination Practice',
            description: 'Improve hand-eye coordination with targeted exercises',
            icon: Target,
            color: colors.accent3,
          });
          break;
        case 'balance':
          recommendations.push({
            title: 'Balance Training',
            description: 'Work on stability and proprioceptive awareness',
            icon: Activity,
            color: colors.success,
          });
          break;
      }
    }
  });
  
  // If no specific recommendations, provide general ones
  if (recommendations.length === 0) {
    recommendations.push(
      {
        title: 'Maintain Performance',
        description: 'Continue regular neural training to maintain your high scores',
        icon: Award,
        color: colors.primary,
      },
      {
        title: 'Challenge Yourself',
        description: 'Try advanced difficulty levels in your training',
        icon: Target,
        color: colors.accent1,
      },
      {
        title: 'Holistic Approach',
        description: 'Combine neural and physical training for optimal results',
        icon: Brain,
        color: colors.accent2,
      }
    );
  }
  
  return recommendations;
}