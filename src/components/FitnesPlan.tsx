'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Brain, Calendar, ChevronRight, ChevronDown, Activity, Heart, Zap, 
  Trophy, Target, Dumbbell, Clock, CheckCircle, BarChart2,
  Loader2, Bell, Play, Star, MessageSquare, Plus, AlertCircle
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

// Animation Variants
const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

const staggerContainer: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const scaleButton: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.95,
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  expanded: {
    scale: 1.02,
    transition: {
      duration: 0.2,
    },
  },
};

const weekTabVariants: Variants = {
  inactive: {
    scale: 0.95,
    opacity: 0.7,
  },
  active: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

const progressBar: Variants = {
  initial: {
    width: 0,
  },
  animate: (width: string) => ({
    width,
    transition: {
      duration: 1,
      ease: 'easeOut',
    },
  }),
};

// Types
interface Workout {
  id: string;
  type: string;
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  focus: string;
  equipment?: string[];
}

interface DailyPlan {
  day: number;
  wday_name: string;
  date: string;
  theme: string;
  workouts: Workout[];
  Tips: string[];
  Notifications: {
    time: string;
    message: string;
    type: string;
  }[];
  Progress: {
    workout_id: string;
    status: string;
    completion_percentage: number;
    rating?: number;
    feedback?: string;
  }[];
  Comments: string[];
}

interface WeeklyPlan {
  week: number;
  timeline: DailyPlan[];
}

interface FitnessPlanViewProps {
  weeklyPlans: WeeklyPlan[];
  onWorkoutStart?: (workoutId: string) => void;
  onProgressUpdate?: (weekIndex: number, dayIndex: number, workoutId: string, progress: any) => void;
}

// Fitness Plan Component
function FitnessPlanView({ 
  weeklyPlans, 
  onWorkoutStart, 
  onProgressUpdate 
}: FitnessPlanViewProps) {
  const [activeWeek, setActiveWeek] = useState(0);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInUp}
      className="space-y-6"
    >
      {/* Week Navigation */}
      <motion.div 
        className="flex gap-2 p-2 rounded-xl overflow-x-auto"
        style={{ backgroundColor: colors.surface }}
        variants={staggerContainer}
      >
        {weeklyPlans.map((week, index) => (
          <motion.button
            key={week.week}
            onClick={() => setActiveWeek(index)}
            variants={weekTabVariants}
            animate={activeWeek === index ? 'active' : 'inactive'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeWeek === index ? 'text-black' : 'text-white'
            }`}
            style={{
              backgroundColor: activeWeek === index ? colors.primary : colors.surfaceLight,
            }}
          >
            <Calendar size={18} />
            Week {week.week}
          </motion.button>
        ))}
      </motion.div>

      {/* Daily Plans */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeWeek}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          exit="exit"
          className="space-y-4"
        >
          {weeklyPlans[activeWeek].timeline.map((day, dayIndex) => (
            <DayCard
              key={`${day.day}-${day.date}`}
              day={day}
              isExpanded={expandedDay === `${activeWeek}-${dayIndex}`}
              onToggle={() => setExpandedDay(
                expandedDay === `${activeWeek}-${dayIndex}` ? null : `${activeWeek}-${dayIndex}`
              )}
              onWorkoutStart={onWorkoutStart}
              onProgressUpdate={(workoutId, progress) => 
                onProgressUpdate?.(activeWeek, dayIndex, workoutId, progress)
              }
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function DayCard({ 
  day, 
  isExpanded, 
  onToggle, 
  onWorkoutStart,
  onProgressUpdate 
}: {
  day: DailyPlan;
  isExpanded: boolean;
  onToggle: () => void;
  onWorkoutStart?: (workoutId: string) => void;
  onProgressUpdate?: (workoutId: string, progress: any) => void;
}) {
  const completedWorkouts = day.Progress.filter(p => p.status === 'completed').length;
  const totalWorkouts = day.workouts.length;
  const completionPercentage = (completedWorkouts / totalWorkouts) * 100;

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="expanded"
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Day Header */}
      <motion.div
        className="p-4 cursor-pointer"
        onClick={onToggle}
        whileHover={{ backgroundColor: colors.surfaceLight }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
                 style={{ backgroundColor: `${colors.primary}20` }}>
              <Calendar size={24} style={{ color: colors.primary }} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {day.wday_name}
              </h3>
              <p className="text-sm text-gray-400">{day.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-24 h-2 rounded-full overflow-hidden" 
                   style={{ backgroundColor: colors.surfaceLight }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: colors.primary }}
                  variants={progressBar}
                  initial="initial"
                  animate="animate"
                  custom={`${completionPercentage}%`}
                />
              </div>
              <span className="text-sm text-white">
                {completedWorkouts}/{totalWorkouts}
              </span>
            </motion.div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={24} className="text-gray-400" />
            </motion.div>
          </div>
        </div>
        
        {/* Theme */}
        <motion.p 
          className="mt-2 text-sm"
          style={{ color: colors.accent1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {day.theme}
        </motion.p>
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {/* Workouts */}
              <div className="space-y-3">
                {day.workouts.map((workout, index) => (
                  <WorkoutItem
                    key={workout.id}
                    workout={workout}
                    progress={day.Progress.find(p => p.workout_id === workout.id)}
                    onStart={() => onWorkoutStart?.(workout.id)}
                    onProgressUpdate={(progress) => onProgressUpdate?.(workout.id, progress)}
                  />
                ))}
              </div>

              {/* Tips */}
              {day.Tips.length > 0 && (
                <motion.div
                  variants={fadeInUp}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.surfaceLight }}
                >
                  <h4 className="text-sm font-medium text-white mb-2">Tips</h4>
                  <ul className="space-y-2">
                    {day.Tips.map((tip, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2 text-sm text-gray-400"
                      >
                        <Star size={16} className="flex-shrink-0 mt-0.5" style={{ color: colors.primary }} />
                        {tip}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Notifications */}
              {day.Notifications.length > 0 && (
                <motion.div
                  variants={fadeInUp}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: colors.surfaceLight }}
                >
                  <h4 className="text-sm font-medium text-white mb-2">Reminders</h4>
                  <div className="space-y-2">
                    {day.Notifications.map((notification, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 text-sm"
                      >
                        <Bell size={16} style={{ color: colors.accent1 }} />
                        <span className="text-gray-400">{notification.time}</span>
                        <span className="text-white">{notification.message}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function WorkoutItem({ 
  workout, 
  progress,
  onStart,
  onProgressUpdate
}: {
  workout: Workout;
  progress?: {
    workout_id: string;
    status: string;
    completion_percentage: number;
    rating?: number;
    feedback?: string;
  };
  onStart?: () => void;
  onProgressUpdate?: (progress: any) => void;
}) {
  const [showFeedback, setShowFeedback] = useState(false);
  const isCompleted = progress?.status === 'completed';

  const getWorkoutIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'разминка':
        return Activity;
      case 'основная тренировка':
        return Dumbbell;
      case 'нейронная':
        return Brain;
      case 'заминка':
        return Heart;
      default:
        return Zap;
    }
  };

  const WorkoutIcon = getWorkoutIcon(workout.type);

  return (
    <motion.div
      variants={cardVariants}
      className="p-4 rounded-lg border transition-colors"
      style={{ 
        backgroundColor: isCompleted ? `${colors.success}10` : colors.surfaceLight,
        borderColor: isCompleted ? colors.success : colors.surface
      }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: isCompleted ? `${colors.success}20` : `${colors.primary}20` 
            }}
          >
            <WorkoutIcon 
              size={20} 
              style={{ color: isCompleted ? colors.success : colors.primary }} 
            />
          </div>
          <div>
            <h5 className="font-medium text-white">{workout.name}</h5>
            <p className="text-sm text-gray-400">{workout.type}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: colors.surface, color: colors.textSecondary }}>
                {workout.difficulty}
              </span>
              <span className="text-xs text-gray-400">
                {Math.floor(workout.duration / 60)} min
              </span>
              {workout.focus && (
                <span className="text-xs text-gray-400">
                  {workout.focus}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {isCompleted ? (
          <motion.button
            variants={scaleButton}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="p-2 rounded-full"
            style={{ backgroundColor: colors.success }}
            onClick={() => setShowFeedback(!showFeedback)}
          >
            <CheckCircle size={20} className="text-white" />
          </motion.button>
        ) : (
          <motion.button
            variants={scaleButton}
            initial="rest"
            whileHover="hover"
            whileTap="tap"
            className="px-4 py-2 rounded-lg flex items-center gap-2 text-black font-medium"
            style={{ backgroundColor: colors.primary }}
            onClick={onStart}
          >
            <Play size={16} />
            Start
          </motion.button>
        )}
      </div>

      {/* Description */}
      <motion.p 
        className="mt-2 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {workout.description}
      </motion.p>

      {/* Feedback Form */}
      <AnimatePresence>
        {showFeedback && isCompleted && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 overflow-hidden"
          >
            <div className="p-3 rounded-lg" style={{ backgroundColor: colors.surface }}>
              <div className="flex items-center gap-2 mb-2">
                <Star size={16} style={{ color: colors.primary }} />
                <span className="text-sm text-white">Rate this workout</span>
              </div>
              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <motion.button
                    key={rating}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      (progress?.rating || 0) >= rating ? 'text-primary bg-primary/20' : 'text-gray-400 bg-gray-800'
                    }`}
                    onClick={() => onProgressUpdate?.({ ...progress, rating })}
                  >
                    <Star size={16} fill={progress?.rating === rating ? 'currentColor' : 'none'} />
                  </motion.button>
                ))}
              </div>
              <textarea
                placeholder="Add a comment..."
                className="w-full bg-black/20 text-white rounded-lg p-2 text-sm"
                rows={2}
                value={progress?.feedback || ''}
                onChange={(e) => onProgressUpdate?.({ ...progress, feedback: e.target.value })}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Sample JSON fitness plan data
const sampleUserInfo = {
  UserID: "user_123",
  Email: "alex.morgan@example.com",
  "Полное имя": "Alex Morgan",
  "Имя": "Alex",
  "Фамилия": "Morgan",
  "Пол": "Ж",
  "Цель Фитнеса": ["Улучшить работу мозга", "Повысить двигательную активность"],
  "Расписание": ["Понедельник", "Среда", "Пятница"],
  "Вес": 65,
  "Рост": 170,
  "Возраст": 35,
  "Объем талии": 70,
  "Объем бедер": 98,
  "Пульс в покое": 75,
  "Макс Пульс": 187,
  "Пульсовой коридор 50": 94,
  "Пульсовой коридор 60": 112,
  "Пульсовой коридор 70": 131,
  "Пульсовой коридор 80": 150,
  "ИНДЕКС СТБ": 22.5,
  "Калораж": 2000,
  "Статус подписки": "Premium",
  "Всего курсов": 3,
  "Активные курсы": ["Нейрофитнес", "Координация", "Баланс"],
  goals: ["Улучшить работу мозга", "Повысить двигательную активность"],
  Plan_settings: {
    start_date: "2025-04-28",
    days_of_week: ["Понедельник", "Среда", "Пятница"],
    time_of_day: "morning",
    program_duration_weeks: 4,
    total_days: 12,
    daily_duration_minutes: 45,
  },
};

// Sample fitness plan data
const sampleFitnessPlan = {
  FitnessPlan: [
    {
      week: 1,
      timeline: [
        {
          day: 1,
          wday_name: "Понедельник",
          date: "2025-04-28",
          theme: "Нейроактивация и зрение",
          workouts: [
            {
              id: "w1_d1_1",
              type: "Разминка",
              name: "Бодрость. Точка зрения",
              description: "Активация нервной системы и подготовка мышц к тренировке",
              duration: 600,
              difficulty: "Легкая",
              focus: "Общая активация",
              equipment: []
            },
            {
              id: "w1_d1_2",
              type: "Основная тренировка",
              name: "Техника для тренировки ног",
              description: "Тренировка для улучшения когнитивных функций",
              duration: 1200,
              difficulty: "Средняя",
              focus: "Нейронная активация",
              equipment: []
            },
            {
              id: "w1_d1_3",
              type: "Ягодицы и мозжечок",
              name: "Активация ягодичных мышц",
              description: "Упражнения для улучшения подвижности и координации",
              duration: 1200,
              difficulty: "Средняя",
              focus: "Координация",
              equipment: []
            },
            {
              id: "w1_d1_4",
              type: "Заминка",
              name: "Восстановительные упражнения",
              description: "Растяжка и расслабление после тренировки",
              duration: 300,
              difficulty: "Легкая",
              focus: "Восстановление",
              equipment: []
            }
          ],
          Tips: [
            "Сохраняйте правильное дыхание и следите за пульсом",
            "Концентрируйтесь на точности движений",
            "Вода - ваш лучший друг! Пейте воду до и после тренировки"
          ],
          Notifications: [
            {
              time: "09:00",
              message: "Время для тренировки! Вы готовы?",
              type: "workout_reminder"
            },
            {
              time: "08:00",
              message: "Через час начнется ваша тренировка",
              type: "pre_workout"
            },
            {
              time: "10:30",
              message: "Не забудьте оценить тренировку и оставить комментарий",
              type: "post_workout"
            }
          ],
          Progress: [],
          Comments: []
        },
        {
          day: 3,
          wday_name: "Среда",
          date: "2025-04-30",
          theme: "Координация и баланс",
          workouts: [
            {
              id: "w1_d3_1",
              type: "Разминка",
              name: "Нейроактивация",
              description: "Активация нервной системы",
              duration: 600,
              difficulty: "Легкая",
              focus: "Общая активация",
              equipment: []
            },
            {
              id: "w1_d3_2",
              type: "Основная тренировка",
              name: "Координационная лестница",
              description: "Улучшение координации движений",
              duration: 1200,
              difficulty: "Средняя",
              focus: "Координация",
              equipment: []
            },
            {
              id: "w1_d3_3",
              type: "Основная тренировка",
              name: "Суставная гимнастика",
              description: "Улучшение подвижности суставов",
              duration: 1200,
              difficulty: "Средняя",
              focus: "Мобильность",
              equipment: []
            },
            {
              id: "w1_d3_4",
              type: "Заминка",
              name: "Восстановительные упражнения",
              description: "Растяжка и расслабление",
              duration: 300,
              difficulty: "Легкая",
              focus: "Восстановление",
              equipment: []
            }
          ],
          Tips: [
            "Начинайте с медленных движений, постепенно увеличивая скорость",
            "Следите за балансом во время упражнений",
            "Не забывайте про правильное дыхание"
          ],
          Notifications: [
            {
              time: "09:00",
              message: "Время для тренировки!",
              type: "workout_reminder"
            }
          ],
          Progress: [],
          Comments: []
        }
      ]
    }
  ]
};

// Main component
export default function FitnessPlanDemo() {
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState(null);

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setPlanData(sampleFitnessPlan);
      setLoading(false);
    }, 1500);
  }, []);

  const handleWorkoutStart = (workoutId) => {
    console.log(`Starting workout: ${workoutId}`);
    // In a real app, this would navigate to the workout player
  };

  const handleProgressUpdate = (weekIndex, dayIndex, workoutId, progress) => {
    console.log(`Updating progress for workout ${workoutId}:`, progress);
    // In a real app, this would update the database
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-16 w-16" style={{ color: colors.primary }} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-black/70">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Fitness Plan</h1>
              <p className="text-sm text-gray-400">Your personalized neurofitness journey</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg"
              style={{ backgroundColor: colors.surface }}
            >
              <BarChart2 size={20} className="text-white" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Plan Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-xl"
          style={{ backgroundColor: colors.surface }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                {sampleUserInfo["Полное имя"]}'s Fitness Plan
              </h2>
              <p className="text-gray-400">
                {sampleUserInfo.Plan_settings.program_duration_weeks} Week Program
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                  {sampleUserInfo.Plan_settings.total_days}
                </div>
                <div className="text-sm text-gray-400">Total Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: colors.accent1 }}>
                  {sampleUserInfo.Plan_settings.daily_duration_minutes}
                </div>
                <div className="text-sm text-gray-400">Min/Day</div>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Goals</h3>
            <div className="flex flex-wrap gap-2">
              {sampleUserInfo["Цель Фитнеса"].map((goal, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-full text-sm"
                  style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                >
                  {goal}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Training Schedule */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Training Schedule</h3>
            <div className="flex flex-wrap gap-2">
              {sampleUserInfo["Расписание"].map((day, index) => (
                <div
                  key={index}
                  className="px-4 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: colors.surfaceLight, color: colors.textPrimary }}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Fitness Plan View */}
        {planData && (
          <FitnessPlanView
            weeklyPlans={planData.FitnessPlan}
            onWorkoutStart={handleWorkoutStart}
            onProgressUpdate={handleProgressUpdate}
          />
        )}
      </main>
    </div>
  );
}