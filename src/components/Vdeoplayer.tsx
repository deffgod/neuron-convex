'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Maximize, Minimize, ChevronDown, Clock, Activity, Heart,
  Timer, Plus, Minus, Check, X, ArrowLeft, Settings, Info,
  BarChart2, Repeat, HelpCircle, Brain, Zap, Trophy, Share2,
  MessageSquare, Star
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { BottomNavBar } from '@/components/layout/BottomNavBar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { AchievementPopup } from '@/components/features/achievements/AchievementPopup';
import { useWorkoutProgress } from '@/hooks/use-workout-progress';
import { useNeurofeedback } from '@/hooks/use-neurofeedback';
import type { Workout, WorkoutActivity, Progress } from '@/types/models/workouts';

// Core colors from Neuronline design system
const colors = {
  primary: '#B7F501',
  secondary: '#D5FF88',
  background: '#000000',
  surface: '#1A1A1A',
  surfaceLight: '#2A2A2A',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  inactiveGray: '#8E8E93',
  cardBackground: '#1A1A1A',
  cardBorder: '#2A2A2A',
  success: '#00FF9D',
  warning: '#FF9500',
  error: '#FF3B30',
  accent1: '#00D1FF',
  accent2: '#FF00E5',
};

interface WorkoutPlayerProps {
  workoutId: string;
  planId: string;
}

export default function WorkoutPlayer({ workoutId, planId }: WorkoutPlayerProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showExerciseList, setShowExerciseList] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<WorkoutActivity | null>(null);
  const [heartRate, setHeartRate] = useState(72);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [cognitiveScore, setCognitiveScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<WorkoutActivity[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Custom hooks from Neuronline platform
  const { updateProgress, submitFeedback } = useWorkoutProgress();
  const { feedbackData, submitFeedback: submitNeurofeedback } = useNeurofeedback({
    userId: 'current-user-id', // Replace with actual user ID
    workoutId,
  });

  // Fetch workout data
  useEffect(() => {
    async function fetchWorkoutData() {
      try {
        setLoading(true);
        
        // Fetch workout details
        const { data: workoutData, error: workoutError } = await supabase
          .from('workouts')
          .select(`
            *,
            workout_activities(*)
          `)
          .eq('id', workoutId)
          .single();

        if (workoutError) throw workoutError;
        
        setWorkout(workoutData);
        setExercises(workoutData.workout_activities || []);
        if (workoutData.workout_activities?.length > 0) {
          setCurrentExercise(workoutData.workout_activities[0]);
        }
        
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkoutData();
  }, [workoutId, supabase]);

  // Simulate heart rate monitoring with neurofeedback integration
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        const newHeartRate = Math.min(
          Math.max(
            heartRate + (Math.random() * 2 - 1) * 2,
            60
          ),
          180
        );
        setHeartRate(newHeartRate);
        
        // Update cognitive score based on performance
        const performanceMetric = Math.random() * 100;
        setCognitiveScore(prev => (prev + performanceMetric) / 2);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Handle video playback and progress tracking
  useEffect(() => {
    if (isPlaying && workout) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = Math.min(prev + 1, workout.duration || 0);
          setProgress((newTime / (workout.duration || 1)) * 100);
          
          // Update current exercise
          const exercise = exercises.find(
            ex => ex.timestamp <= newTime && (ex.timestamp + ex.duration) > newTime
          );
          if (exercise) setCurrentExercise(exercise);
          
          // Check if workout completed
          if (newTime >= (workout.duration || 0)) {
            setIsPlaying(false);
            setWorkoutCompleted(true);
            handleWorkoutCompletion();
          }
          
          return newTime;
        });
      }, 1000 / playbackSpeed);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, playbackSpeed, workout, exercises]);

  const handleWorkoutCompletion = async () => {
    // Save progress to Supabase
    await updateProgress({
      workoutId,
      planId,
      completion_percentage: 100,
      calories_burned: Math.round(currentTime / 60 * 5),
      duration: currentTime,
      status: 'completed',
    });

    // Submit neurofeedback
    await submitNeurofeedback({
      perceived_exertion: 7,
      cognitive_load: 6,
      balance_stability: 8,
      coordination_rating: 7,
      notes: 'Workout completed successfully',
    });

    // Check for achievements
    setShowAchievement(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSkipToExercise = (exercise: WorkoutActivity) => {
    setCurrentTime(exercise.timestamp);
    setProgress((exercise.timestamp / (workout?.duration || 1)) * 100);
    setCurrentExercise(exercise);
    setShowExerciseList(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: colors.background }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Brain className="h-12 w-12" style={{ color: colors.primary }} />
        </motion.div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            Workout not found
          </h2>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg"
            style={{ backgroundColor: colors.primary, color: 'black' }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Neuronline Header */}
      {!isFullscreen && (
        <DashboardHeader 
          title={workout.name}
          showBackButton={true}
          rightContent={
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.surface }}
              >
                <Info size={20} className="text-white" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-lg"
                style={{ backgroundColor: colors.surface }}
              >
                <Settings size={20} className="text-white" />
              </button>
            </div>
          }
        />
      )}

      {/* Video Player Area */}
      <div className="relative aspect-video w-full bg-black">
        {/* Kinescope.io integration placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={workout.video_url}
            poster={workout.thumbnail}
            playsInline
          />
        </div>

        {/* Video Controls Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50"
            >
              {/* Top Bar */}
              <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
                {isFullscreen && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      document.exitFullscreen();
                      setIsFullscreen(false);
                    }}
                    className="p-2 rounded-full bg-black/30 backdrop-blur-sm"
                  >
                    <ArrowLeft size={24} className="text-white" />
                  </motion.button>
                )}
                
                {/* Neural Score Display */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm">
                  <Brain size={16} style={{ color: colors.primary }} />
                  <span className="text-white text-sm">
                    Neural Score: {Math.round(cognitiveScore)}
                  </span>
                </div>
              </div>

              {/* Center Play/Pause */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
                >
                  {isPlaying ? (
                    <Pause size={40} className="text-white" />
                  ) : (
                    <Play size={40} className="text-white ml-1" />
                  )}
                </motion.button>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* Progress Bar */}
                <div className="relative mb-4">
                  <div className="absolute -top-6 left-0 text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(workout.duration || 0)}
                  </div>
                  <div 
                    className="h-1 rounded-full overflow-hidden cursor-pointer"
                    style={{ backgroundColor: colors.inactiveGray }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ 
                        width: `${progress}%`,
                        backgroundColor: colors.primary 
                      }}
                    />
                    {/* Exercise markers */}
                    {exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="absolute top-0 w-0.5 h-full"
                        style={{
                          left: `${(exercise.timestamp / (workout.duration || 1)) * 100}%`,
                          backgroundColor: colors.textSecondary,
                          opacity: 0.5,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const prevExercise = exercises[exercises.indexOf(currentExercise!) - 1];
                        if (prevExercise) handleSkipToExercise(prevExercise);
                      }}
                      className="p-2 rounded-full bg-black/30 backdrop-blur-sm"
                    >
                      <SkipBack size={24} className="text-white" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-2 rounded-full bg-black/30 backdrop-blur-sm"
                    >
                      {isPlaying ? (
                        <Pause size={24} className="text-white" />
                      ) : (
                        <Play size={24} className="text-white" />
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const nextExercise = exercises[exercises.indexOf(currentExercise!) + 1];
                        if (nextExercise) handleSkipToExercise(nextExercise);
                      }}
                      className="p-2 rounded-full bg-black/30 backdrop-blur-sm"
                    >
                      <SkipForward size={24} className="text-white" />
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Volume Control */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 rounded-full bg-black/30 backdrop-blur-sm"
                      >
                        {isMuted ? (
                          <VolumeX size={24} className="text-white" />
                        ) : (
                          <Volume2 size={24} className="text-white" />
                        )}
                      </motion.button>
                      <div className="w-20 h-1 rounded-full overflow-hidden" style={{ backgroundColor: colors.inactiveGray }}>
                        <div
                          className="h-full rounded-full"
                          style={{ 
                            width: `${isMuted ? 0 : volume * 100}%`,
                            backgroundColor: colors.primary 
                          }}
                        />
                      </div>
                    </div>

                    {/* Fullscreen Toggle */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        if (!document.fullscreenElement) {
                          containerRef.current?.requestFullscreen();
                          setIsFullscreen(true);
                        } else {
                          document.exitFullscreen();
                          setIsFullscreen(false);
                        }
                      }}
                      className="p-2 rounded-full bg-black/30 backdrop-blur-sm"
                    >
                      {isFullscreen ? (
                        <Minimize size={24} className="text-white" />
                      ) : (
                        <Maximize size={24} className="text-white" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Workout Information Area */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Exercise Card */}
            <motion.div
              layout
              className="p-6 rounded-xl border"
              style={{ 
                backgroundColor: colors.cardBackground, 
                borderColor: colors.cardBorder 
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                    {currentExercise?.name}
                  </h2>
                  <p style={{ color: colors.textSecondary }}>
                    {currentExercise?.type} • {Math.floor((currentExercise?.duration || 0) / 60)} minutes
                  </p>
                </div>
                <span 
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: `${colors.primary}20`, 
                    color: colors.primary 
                  }}
                >
                  {currentExercise?.type}
                </span>
              </div>
              
              {/* Exercise Progress */}
              <div 
                className="w-full h-2 rounded-full mb-6" 
                style={{ backgroundColor: colors.surfaceLight }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: colors.primary }}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${((currentTime - (currentExercise?.timestamp || 0)) / (currentExercise?.duration || 1)) * 100}%` 
                  }}
                />
              </div>

              {/* Neuro Effects */}
              {currentExercise?.primary_effects && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
                    Neuro Effects
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentExercise.primary_effects.map((effect, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ 
                          backgroundColor: colors.surfaceLight, 
                          color: colors.primary 
                        }}
                      >
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Exercise Tips */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                  Tips for this exercise:
                </h3>
                <ul className="space-y-1">
                  {currentExercise?.user_benefits && (
                    <li className="flex items-center gap-2 text-sm" style={{ color: colors.textPrimary }}>
                      <Brain size={16} style={{ color: colors.primary }} />
                      {currentExercise.user_benefits}
                    </li>
                  )}
                  {currentExercise?.practical_tips?.map((tip, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm" style={{ color: colors.textPrimary }}>
                      <Check size={16} style={{ color: colors.primary }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Exercise List */}
            <motion.div
              layout
              className="p-6 rounded-xl border"
              style={{ 
                backgroundColor: colors.cardBackground, 
                borderColor: colors.cardBorder 
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>
                  Exercise List
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowExerciseList(!showExerciseList)}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: colors.surfaceLight }}
                >
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform ${showExerciseList ? 'rotate-180' : ''}`}
                    style={{ color: colors.textPrimary }} 
                  />
                </motion.button>
              </div>

              <AnimatePresence>
                {showExerciseList && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    {exercises.map((exercise) => (
                      <motion.button
                        key={exercise.id}
                        whileHover={{ x: 4 }}
                        onClick={() => handleSkipToExercise(exercise)}
                        className={`w-full p-4 rounded-lg text-left flex items-center justify-between border ${
                          currentExercise?.id === exercise.id ? 'border-primary' : 'border-transparent'
                        }`}
                        style={{ 
                          backgroundColor: colors.surfaceLight,
                          borderColor: currentExercise?.id === exercise.id ? colors.primary : 'transparent'
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${colors.primary}20` }}
                          >
                            {exercise.id === currentExercise?.id ? (
                              <Play size={16} style={{ color: colors.primary }} />
                            ) : exercise.timestamp < currentTime ? (
                              <Check size={16} style={{ color: colors.success }} />
                            ) : (
                              <Clock size={16} style={{ color: colors.textSecondary }} />
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium" style={{ color: colors.textPrimary }}>
                              {exercise.name}
                            </h4>
                            <p className="text-sm" style={{ color: colors.textSecondary }}>
                              {formatTime(exercise.duration)}
                            </p>
                          </div>
                        </div>
                        {exercise.timestamp < currentTime && exercise.id !== currentExercise?.id && (
                          <Check size={20} style={{ color: colors.success }} />
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Side Metrics Panel */}
          <div className="space-y-6">
            {/* Live Metrics */}
            <motion.div
              layout
              className="p-6 rounded-xl border"
              style={{ 
                backgroundColor: colors.cardBackground, 
                borderColor: colors.cardBorder 
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Live Metrics
              </h3>
              <div className="space-y-4">
                <MetricCard
                  icon={Heart}
                  label="Heart Rate"
                  value={`${Math.round(heartRate)} BPM`}
                  color={colors.error}
                />
                <MetricCard
                  icon={Activity}
                  label="Intensity"
                  value={currentExercise?.intensity || 'Medium'}
                  color={colors.primary}
                />
                <MetricCard
                  icon={Timer}
                  label="Time Remaining"
                  value={formatTime((workout?.duration || 0) - currentTime)}
                  color={colors.accent1}
                />
                <MetricCard
                  icon={Brain}
                  label="Neural Load"
                  value={`${Math.round(cognitiveScore)}%`}
                  color={colors.accent2}
                />
                <MetricCard
                  icon={Zap}
                  label="Calories Burned"
                  value={`${Math.round(currentTime / 60 * 5)} kcal`}
                  color={colors.warning}
                />
              </div>
            </motion.div>

            {/* Trainer Info */}
            <motion.div
              layout
              className="p-6 rounded-xl border"
              style={{ 
                backgroundColor: colors.cardBackground, 
                borderColor: colors.cardBorder 
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Trainer
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src={`https://picsum.photos/seed/${workout.trainer}/64/64`}
                  alt={workout.trainer}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium" style={{ color: colors.textPrimary }}>
                    {workout.trainer}
                  </h4>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    Neural Fitness Expert
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Workout Info */}
            <motion.div
              layout
              className="p-6 rounded-xl border"
              style={{ 
                backgroundColor: colors.cardBackground, 
                borderColor: colors.cardBorder 
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Workout Info
              </h3>
              <div className="space-y-3">
                <InfoRow label="Difficulty" value={workout.difficulty} />
                <InfoRow label="Type" value={workout.type} />
                <InfoRow label="Duration" value={`${Math.floor((workout.duration || 0) / 60)} minutes`} />
                <InfoRow label="Exercises" value={exercises.length} />
                <InfoRow label="Neuro Focus" value={workout.focus_area || 'Balance'} />
              </div>
            </motion.div>

            {/* Share and Community */}
            <motion.div
              layout
              className="p-6 rounded-xl border"
              style={{ 
                backgroundColor: colors.cardBackground, 
                borderColor: colors.cardBorder 
              }}
            >
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>
                Community
              </h3>
              <div className="space-y-3">
                <button
                  className="w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2"
                  style={{ backgroundColor: colors.primary, color: 'black' }}
                >
                  <Share2 size={20} />
                  Share Progress
                </button>
                <button
                  className="w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 border"
                  style={{ borderColor: colors.cardBorder, color: colors.textPrimary }}
                >
                  <MessageSquare size={20} />
                  Comments ({workout.comments?.length || 0})
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
            onClick={() => setShowSettings(false)}
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
                  <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>
                    Settings
                  </h2>
                  <button 
                    onClick={() => setShowSettings(false)} 
                    style={{ color: colors.textSecondary }}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Playback Speed */}
                  <div>
                    <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                      Playback Speed
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <motion.button
                          key={speed}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`px-3 py-1 rounded-full text-sm ${
                            playbackSpeed === speed ? 'bg-primary text-black' : 'bg-surfaceLight text-white'
                          }`}
                          style={{
                            backgroundColor: playbackSpeed === speed ? colors.primary : colors.surfaceLight,
                            color: playbackSpeed === speed ? 'black' : 'white'
                          }}
                        >
                          {speed}x
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Video Quality */}
                  <div>
                    <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                      Video Quality
                    </label>
                    <select
                      className="w-full p-2 rounded-lg bg-transparent border"
                      style={{ 
                        borderColor: colors.cardBorder, 
                        color: colors.textPrimary 
                      }}
                      defaultValue="1080p"
                    >
                      <option value="auto">Auto</option>
                      <option value="1080p">1080p</option>
                      <option value="720p">720p</option>
                      <option value="480p">480p</option>
                    </select>
                  </div>

                  {/* Neural Feedback */}
                  <div>
                    <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                      Neural Feedback
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="neuralFeedback"
                        defaultChecked
                        className="w-4 h-4"
                        style={{ accentColor: colors.primary }}
                      />
                      <label 
                        htmlFor="neuralFeedback" 
                        className="text-sm" 
                        style={{ color: colors.textPrimary }}
                      >
                        Show real-time cognitive metrics
                      </label>
                    </div>
                  </div>

                  {/* Subtitles */}
                  <div>
                    <label className="block text-sm mb-2" style={{ color: colors.textSecondary }}>
                      Subtitles
                    </label>
                    <select
                      className="w-full p-2 rounded-lg bg-transparent border"
                      style={{ 
                        borderColor: colors.cardBorder, 
                        color: colors.textPrimary 
                      }}
                      defaultValue="off"
                    >
                      <option value="off">Off</option>
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="ru">Russian</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workout Complete Modal */}
      <AnimatePresence>
        {workoutCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-xl overflow-hidden text-center"
              style={{ backgroundColor: colors.surface }}
            >
              <div className="p-8">
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: `${colors.success}20` }}
                >
                  <Trophy size={40} style={{ color: colors.success }} />
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: colors.textPrimary }}>
                  Workout Complete!
                </h2>
                <p className="mb-6" style={{ color: colors.textSecondary }}>
                  Great job! You've completed this workout.
                </p>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-lg" style={{ backgroundColor: colors.surfaceLight }}>
                    <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                      {Math.floor((workout?.duration || 0) / 60)}
                    </div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      Minutes
                    </div>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: colors.surfaceLight }}>
                    <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                      {Math.round(currentTime / 60 * 5)}
                    </div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      Calories
                    </div>
                  </div>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: colors.surfaceLight }}>
                    <div className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                      {Math.round(cognitiveScore)}
                    </div>
                    <div className="text-sm" style={{ color: colors.textSecondary }}>
                      Neuro Score
                    </div>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4" style={{ color: colors.textPrimary }}>
                    Rate this workout
                  </h3>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Star 
                          size={32}
                          style={{ color: colors.primary }}
                          fill={star <= 4 ? colors.primary : 'none'}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push('/dashboard')}
                    className="flex-1 py-3 rounded-lg font-semibold"
                    style={{ backgroundColor: colors.primary, color: 'black' }}
                  >
                    Continue
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setWorkoutCompleted(false);
                      setCurrentTime(0);
                      setProgress(0);
                      setCurrentExercise(exercises[0]);
                    }}
                    className="flex-1 py-3 rounded-lg font-medium border"
                    style={{ borderColor: colors.cardBorder, color: colors.textSecondary }}
                  >
                    Repeat
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Popup */}
      <AchievementPopup
        show={showAchievement}
        onClose={() => setShowAchievement(false)}
        title="Neural Master"
        description="Complete 10 neural training sessions"
        progress={7}
        total={10}
      />
      
      {/* Bottom Navigation */}
      {!isFullscreen && <BottomNavBar />}
    </div>
  );
}

// Helper Components
function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-3">
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-sm" style={{ color: colors.textSecondary }}>{label}</p>
        <p className="text-lg font-semibold" style={{ color: colors.textPrimary }}>{value}</p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span style={{ color: colors.textSecondary }}>{label}</span>
      <span className="font-medium" style={{ color: colors.textPrimary }}>{value}</span>
    </div>
  );
}