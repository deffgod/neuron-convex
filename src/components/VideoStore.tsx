'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Clock, Target, Dumbbell, Brain, Heart, 
  Activity, Play, Calendar, Star, ChevronDown, X, BarChart2,
  Zap, User, Award, ChevronRight, Eye, BookOpen
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

// Mock workout data
const workouts = [
  {
    id: 1,
    title: 'Neural Activation Fundamentals',
    category: 'Neural Training',
    subcategory: 'Vestibular System',
    duration: 25,
    difficulty: 'Beginner',
    instructor: 'Dr. Sarah Chen',
    rating: 4.8,
    views: 1250,
    description: 'Activate your vestibular system with fundamental balance exercises designed to improve spatial awareness.',
    effects: ['Balance', 'Spatial Awareness', 'Coordination'],
    equipment: ['None'],
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop',
    preview: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop'
  },
  {
    id: 2,
    title: 'Visual System Enhancement',
    category: 'Neural Training',
    subcategory: 'Vision Training',
    duration: 20,
    difficulty: 'Intermediate',
    instructor: 'Dr. Michael Roberts',
    rating: 4.7,
    views: 980,
    description: 'Enhance your visual processing with targeted exercises for eye tracking and depth perception.',
    effects: ['Vision', 'Focus', 'Reaction Time'],
    equipment: ['None'],
    thumbnail: 'https://images.unsplash.com/photo-1554244933-d876deb6b2ff?w=400&h=225&fit=crop',
    preview: 'https://images.unsplash.com/photo-1554244933-d876deb6b2ff?w=800&h=450&fit=crop'
  },
  {
    id: 3,
    title: 'Core & Breathing Mastery',
    category: 'Physical Training',
    subcategory: 'Core Strength',
    duration: 30,
    difficulty: 'Intermediate',
    instructor: 'John Williams',
    rating: 4.9,
    views: 2100,
    description: 'Strengthen your core and improve breathing patterns for better overall performance.',
    effects: ['Core Strength', 'Breathing', 'Posture'],
    equipment: ['Yoga Mat'],
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop',
    preview: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop'
  },
  {
    id: 4,
    title: 'Cognitive Speed Training',
    category: 'Neural Training',
    subcategory: 'Cognitive',
    duration: 15,
    difficulty: 'Advanced',
    instructor: 'Dr. Sarah Chen',
    rating: 4.6,
    views: 750,
    description: 'Improve your cognitive processing speed with advanced reaction and decision-making exercises.',
    effects: ['Reaction Time', 'Decision Making', 'Mental Agility'],
    equipment: ['None'],
    thumbnail: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=400&h=225&fit=crop',
    preview: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=800&h=450&fit=crop'
  },
  {
    id: 5,
    title: 'Mobility & Balance Flow',
    category: 'Physical Training',
    subcategory: 'Mobility',
    duration: 40,
    difficulty: 'Beginner',
    instructor: 'Emma Davis',
    rating: 4.9,
    views: 1800,
    description: 'Improve your joint mobility and balance through flowing movement patterns.',
    effects: ['Mobility', 'Balance', 'Flexibility'],
    equipment: ['Yoga Mat', 'Resistance Band'],
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=225&fit=crop',
    preview: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop'
  },
  {
    id: 6,
    title: 'Stress Recovery Circuit',
    category: 'Recovery Training',
    subcategory: 'Stress Management',
    duration: 25,
    difficulty: 'Beginner',
    instructor: 'Dr. Michael Roberts',
    rating: 4.7,
    views: 1450,
    description: 'Release stress and tension with guided breathing and relaxation techniques.',
    effects: ['Stress Relief', 'Relaxation', 'Recovery'],
    equipment: ['Yoga Mat'],
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=225&fit=crop',
    preview: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop'
  }
];

const categories = [
  { id: 'all', name: 'All', icon: Activity },
  { id: 'neural', name: 'Neural Training', icon: Brain },
  { id: 'physical', name: 'Physical Training', icon: Dumbbell },
  { id: 'recovery', name: 'Recovery Training', icon: Heart },
];

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const durations = ['All', '10-20 min', '20-30 min', '30+ min'];

export default function WorkoutLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  // Filter workouts based on current selections
  const filteredWorkouts = useMemo(() => {
    return workouts.filter(workout => {
      const matchesSearch = workout.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          workout.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
                             workout.category.toLowerCase().includes(selectedCategory);
      
      const matchesDifficulty = selectedDifficulty === 'All' || 
                               workout.difficulty === selectedDifficulty;
      
      const matchesDuration = selectedDuration === 'All' || 
                             (selectedDuration === '10-20 min' && workout.duration >= 10 && workout.duration <= 20) ||
                             (selectedDuration === '20-30 min' && workout.duration > 20 && workout.duration <= 30) ||
                             (selectedDuration === '30+ min' && workout.duration > 30);
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedDuration]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-black/70">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Workout Library</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg"
              style={{ 
                backgroundColor: showFilters ? colors.primary : colors.surface,
                color: showFilters ? 'black' : 'white'
              }}
            >
              <Filter size={20} />
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2"
              style={{ 
                backgroundColor: colors.surface,
                borderColor: 'transparent',
                focusRingColor: colors.primary 
              }}
            />
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
            style={{ backgroundColor: colors.surface }}
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                        selectedCategory === category.id ? 'bg-primary text-black' : 'bg-surfaceLight text-white'
                      }`}
                      style={{
                        backgroundColor: selectedCategory === category.id ? colors.primary : colors.surfaceLight,
                        color: selectedCategory === category.id ? 'black' : 'white'
                      }}
                    >
                      <category.icon size={16} />
                      {category.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Difficulty Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                    <motion.button
                      key={difficulty}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDifficulty(difficulty)}
                      className={`px-4 py-2 rounded-full ${
                        selectedDifficulty === difficulty ? 'bg-primary text-black' : 'bg-surfaceLight text-white'
                      }`}
                      style={{
                        backgroundColor: selectedDifficulty === difficulty ? colors.primary : colors.surfaceLight,
                        color: selectedDifficulty === difficulty ? 'black' : 'white'
                      }}
                    >
                      {difficulty}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3">Duration</h3>
                <div className="flex flex-wrap gap-2">
                  {durations.map((duration) => (
                    <motion.button
                      key={duration}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDuration(duration)}
                      className={`px-4 py-2 rounded-full ${
                        selectedDuration === duration ? 'bg-primary text-black' : 'bg-surfaceLight text-white'
                      }`}
                      style={{
                        backgroundColor: selectedDuration === duration ? colors.primary : colors.surfaceLight,
                        color: selectedDuration === duration ? 'black' : 'white'
                      }}
                    >
                      {duration}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            {filteredWorkouts.length} workouts found
          </p>
        </div>

        {/* Workout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onClick={() => setSelectedWorkout(workout)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredWorkouts.length === 0 && (
          <div className="text-center py-12">
            <Dumbbell size={48} className="mx-auto mb-4 text-gray-600" />
            <h3 className="text-lg font-medium text-white mb-2">No workouts found</h3>
            <p className="text-gray-400">Try adjusting your filters or search query</p>
          </div>
        )}
      </main>

      {/* Workout Details Modal */}
      <AnimatePresence>
        {selectedWorkout && (
          <WorkoutDetailModal
            workout={selectedWorkout}
            onClose={() => setSelectedWorkout(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function WorkoutCard({ workout, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="rounded-xl overflow-hidden cursor-pointer"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <img
          src={workout.thumbnail}
          alt={workout.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium"
             style={{ backgroundColor: colors.primary, color: 'black' }}>
          {workout.difficulty}
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <Clock size={14} className="text-white" />
          <span className="text-sm text-white">{workout.duration} min</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1">{workout.title}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{workout.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">{workout.instructor}</span>
          <div className="flex items-center gap-1">
            <Star size={14} className="text-yellow-400" />
            <span className="text-sm text-white">{workout.rating}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {workout.effects.slice(0, 3).map((effect, index) => (
            <span
              key={index}
              className="px-2 py-1 rounded-full text-xs"
              style={{ backgroundColor: colors.surfaceLight, color: colors.textSecondary }}
            >
              {effect}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function WorkoutDetailModal({ workout, onClose }) {
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
        className="w-full max-w-2xl rounded-xl overflow-hidden"
        style={{ backgroundColor: colors.surface }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative aspect-video">
          <img
            src={workout.preview}
            alt={workout.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <X size={20} className="text-white" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
            <h2 className="text-2xl font-bold text-white mb-2">{workout.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span>{workout.instructor}</span>
              <span>•</span>
              <span>{workout.duration} min</span>
              <span>•</span>
              <span>{workout.difficulty}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 mb-6">{workout.description}</p>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {workout.effects.map((effect, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: colors.surfaceLight, color: colors.primary }}
                  >
                    {effect}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-3">Equipment</h3>
              <div className="flex flex-wrap gap-2">
                {workout.equipment.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: colors.surfaceLight, color: colors.textPrimary }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 rounded-lg font-semibold text-black flex items-center justify-center gap-2"
              style={{ backgroundColor: colors.primary }}
            >
              <Play size={20} />
              Start Workout
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-lg font-medium border"
              style={{ borderColor: colors.surfaceLight, color: colors.textSecondary }}
            >
              <Calendar size={20} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}