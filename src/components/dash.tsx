import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  Brain, Activity, Dumbbell, Calendar, Settings, ChevronRight, Play, Award, 
  User, Bell, Home, Search, Heart, BookOpen, ArrowLeft, X, CheckCircle,
  BarChart2, Timer, Target, Video, Camera, Mail, Lock, ChevronDown
} from 'lucide-react';

// Core colors from the implementation document
const colors = {
  primary: '#B7F501',
  background: '#0F0F0F',
  surface: '#1A1A1A',
  surfaceLight: '#2A2A2A',
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
};

// Animation Variants from the original specification
const cardVariants: Variants = {
  default: {
    scale: 1,
    y: 0,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.2)',
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: {
      duration: 0.1,
    },
  },
  expanded: {
    scale: 1,
    height: 'auto',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn',
    },
  },
};

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
};

const buttonVariants: Variants = {
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

// Components
const NavigationBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { icon: Home, label: 'Home', id: 'home' },
    { icon: Dumbbell, label: 'Workouts', id: 'workouts' },
    { icon: Brain, label: 'Neuro', id: 'neuro' },
    { icon: Activity, label: 'Progress', id: 'progress' },
    { icon: User, label: 'Profile', id: 'profile' },
  ];

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl"
      style={{ backgroundColor: colors.surface }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center py-4">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex flex-col items-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <tab.icon 
              size={24} 
              color={activeTab === tab.id ? colors.primary : colors.textSecondary} 
            />
            <span 
              className="text-xs mt-1"
              style={{ color: activeTab === tab.id ? colors.primary : colors.textSecondary }}
            >
              {tab.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};

const ProgressIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center gap-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, index) => (
      <motion.div
        key={index}
        className="h-1 flex-1 rounded-full overflow-hidden"
        style={{ backgroundColor: colors.surface }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1 }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: colors.primary }}
          initial={{ width: 0 }}
          animate={{ width: index < currentStep ? '100%' : '0%' }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        />
      </motion.div>
    ))}
  </div>
);

const OnboardingFlow = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const totalSteps = 8;
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    age: '',
    weight: '',
    height: '',
    goals: [],
    trainingDays: [],
    duration: 30,
  });

  const goNext = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const goBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const renderStep = () => {
    switch (step) {
      case 0:
        return <LandingStep onNext={goNext} />;
      case 1:
        return <RegistrationStep onNext={goNext} onBack={goBack} formData={formData} setFormData={setFormData} />;
      case 2:
        return <BasicInfoStep onNext={goNext} onBack={goBack} formData={formData} setFormData={setFormData} />;
      case 3:
        return <GoalsStep onNext={goNext} onBack={goBack} formData={formData} setFormData={setFormData} />;
      case 4:
        return <ScheduleStep onNext={goNext} onBack={goBack} formData={formData} setFormData={setFormData} />;
      case 5:
        return <NeurotestingStep onNext={goNext} onBack={goBack} />;
      case 6:
        return <PlanGenerationStep onNext={goNext} />;
      case 7:
        return <PlanReviewStep onComplete={onComplete} onBack={goBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: colors.background }}>
      {step > 0 && step < totalSteps - 1 && (
        <ProgressIndicator currentStep={step} totalSteps={totalSteps} />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const LandingStep = ({ onNext }) => (
  <motion.div 
    className="h-screen flex flex-col items-center justify-center px-6"
    variants={staggerContainer}
    initial="initial"
    animate="animate"
  >
    <motion.div variants={fadeInUp} className="text-center mb-12">
      <Brain color={colors.primary} size={64} className="mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-white mb-4">Neuronline</h1>
      <p className="text-gray-400 text-lg">
        Transform your fitness with neural optimization
      </p>
    </motion.div>
    
    <motion.button
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onNext}
      className="w-full py-4 rounded-xl font-semibold text-black mb-4"
      style={{ backgroundColor: colors.primary }}
    >
      Get Started
    </motion.button>
    
    <motion.p variants={fadeInUp} className="text-gray-500 text-sm">
      Already have an account? <span className="text-white cursor-pointer">Sign in</span>
    </motion.p>
  </motion.div>
);

const RegistrationStep = ({ onNext, onBack, formData, setFormData }) => (
  <div className="flex flex-col h-screen px-6 py-8">
    <motion.button 
      onClick={onBack}
      className="mb-8 flex items-center text-gray-400"
      whileHover={{ x: -4 }}
    >
      <ArrowLeft size={20} className="mr-2" />
      Back
    </motion.button>
    
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex-1"
    >
      <motion.h1 variants={fadeInUp} className="text-2xl font-bold text-white mb-8">
        Create your account
      </motion.h1>
      
      <motion.div variants={fadeInUp} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="email"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="password"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
    
    <motion.button
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onNext}
      className="w-full py-4 rounded-xl font-semibold text-black"
      style={{ backgroundColor: colors.primary }}
    >
      Continue
    </motion.button>
  </div>
);

const BasicInfoStep = ({ onNext, onBack, formData, setFormData }) => (
  <div className="flex flex-col h-screen px-6 py-8">
    <motion.button 
      onClick={onBack}
      className="mb-8 flex items-center text-gray-400"
      whileHover={{ x: -4 }}
    >
      <ArrowLeft size={20} className="mr-2" />
      Back
    </motion.button>
    
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex-1"
    >
      <motion.h1 variants={fadeInUp} className="text-2xl font-bold text-white mb-8">
        Tell us about yourself
      </motion.h1>
      
      <motion.div variants={fadeInUp} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
          <input
            type="text"
            className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Age</label>
            <input
              type="number"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => setFormData({...formData, age: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Weight</label>
            <input
              type="number"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              placeholder="kg"
              value={formData.weight}
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Height</label>
            <input
              type="number"
              className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              placeholder="cm"
              value={formData.height}
              onChange={(e) => setFormData({...formData, height: e.target.value})}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
    
    <motion.button
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onNext}
      className="w-full py-4 rounded-xl font-semibold text-black"
      style={{ backgroundColor: colors.primary }}
    >
      Continue
    </motion.button>
  </div>
);

const GoalsStep = ({ onNext, onBack, formData, setFormData }) => {
  const goals = [
    { id: 'brain', label: 'Improve brain function', icon: Brain },
    { id: 'mobility', label: 'Increase mobility', icon: Activity },
    { id: 'strength', label: 'Build strength', icon: Dumbbell },
    { id: 'stress', label: 'Reduce stress', icon: Heart },
  ];

  const toggleGoal = (goalId) => {
    const updatedGoals = formData.goals.includes(goalId)
      ? formData.goals.filter(id => id !== goalId)
      : [...formData.goals, goalId];
    setFormData({ ...formData, goals: updatedGoals });
  };

  return (
    <div className="flex flex-col h-screen px-6 py-8">
      <motion.button 
        onClick={onBack}
        className="mb-8 flex items-center text-gray-400"
        whileHover={{ x: -4 }}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </motion.button>
      
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex-1"
      >
        <motion.h1 variants={fadeInUp} className="text-2xl font-bold text-white mb-8">
          What are your fitness goals?
        </motion.h1>
        
        <motion.div variants={fadeInUp} className="space-y-4">
          {goals.map((goal) => (
            <motion.button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              className={`w-full p-4 rounded-xl flex items-center space-x-4 transition-colors ${
                formData.goals.includes(goal.id)
                  ? 'bg-green-500/20 border-2 border-green-500'
                  : 'bg-gray-900 border-2 border-gray-800'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <goal.icon 
                size={24} 
                color={formData.goals.includes(goal.id) ? colors.primary : colors.textSecondary} 
              />
              <span className={formData.goals.includes(goal.id) ? 'text-white' : 'text-gray-400'}>
                {goal.label}
              </span>
              {formData.goals.includes(goal.id) && (
                <CheckCircle size={20} color={colors.primary} className="ml-auto" />
              )}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>
      
      <motion.button
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onClick={onNext}
        className="w-full py-4 rounded-xl font-semibold text-black"
        style={{ backgroundColor: colors.primary }}
        disabled={formData.goals.length === 0}
      >
        Continue
      </motion.button>
    </div>
  );
};

const ScheduleStep = ({ onNext, onBack, formData, setFormData }) => {
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const toggleDay = (day) => {
    const updatedDays = formData.trainingDays.includes(day)
      ? formData.trainingDays.filter(d => d !== day)
      : [...formData.trainingDays, day];
    setFormData({ ...formData, trainingDays: updatedDays });
  };

  return (
    <div className="flex flex-col h-screen px-6 py-8">
      <motion.button 
        onClick={onBack}
        className="mb-8 flex items-center text-gray-400"
        whileHover={{ x: -4 }}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </motion.button>
      
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex-1"
      >
        <motion.h1 variants={fadeInUp} className="text-2xl font-bold text-white mb-8">
          When do you want to train?
        </motion.h1>
        
        <motion.div variants={fadeInUp} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-4">Training Days</label>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => (
                <motion.button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold ${
                    formData.trainingDays.includes(day)
                      ? 'bg-green-500 text-black'
                      : 'bg-gray-900 text-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {day}
                </motion.button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-4">Session Duration</label>
            <div className="relative">
              <input
                type="range"
                min="15"
                max="60"
                step="15"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>15 min</span>
                <span>30 min</span>
                <span>45 min</span>
                <span>60 min</span>
              </div>
            </div>
            <div className="mt-4 text-center text-2xl font-bold text-white">
              {formData.duration} minutes
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      <motion.button
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
        onClick={onNext}
        className="w-full py-4 rounded-xl font-semibold text-black"
        style={{ backgroundColor: colors.primary }}
        disabled={formData.trainingDays.length === 0}
      >
        Continue
      </motion.button>
    </div>
  );
};

const NeurotestingStep = ({ onNext, onBack }) => {
  const [testing, setTesting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);

  const startTest = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      setTestComplete(true);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-screen px-6 py-8">
      <motion.button 
        onClick={onBack}
        className="mb-8 flex items-center text-gray-400"
        whileHover={{ x: -4 }}
      >
        <ArrowLeft size={20} className="mr-2" />
        Back
      </motion.button>
      
      <motion.div
        className="flex-1 flex flex-col items-center justify-center"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {!testing && !testComplete && (
          <>
            <motion.div variants={fadeInUp} className="text-center mb-12">
              <Brain color={colors.primary} size={64} className="mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-white mb-4">Neural Assessment</h1>
              <p className="text-gray-400">
                We'll measure your cognitive baseline to create a personalized neuro-fitness plan
              </p>
            </motion.div>
            
            <motion.button
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={startTest}
              className="px-8 py-4 rounded-xl font-semibold text-black"
              style={{ backgroundColor: colors.primary }}
            >
              Start Assessment
            </motion.button>
          </>
        )}
        
        {testing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <div className="relative w-32 h-32 mb-8">
              <motion.div
                className="absolute inset-0 rounded-full border-8"
                style={{ borderColor: colors.surface }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-8"
                style={{ borderColor: colors.primary, borderTopColor: 'transparent' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <h2 className="text-xl text-white mb-2">Analyzing...</h2>
            <p className="text-gray-400">Please wait while we process your results</p>
          </motion.div>
        )}
        
        {testComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <CheckCircle color={colors.primary} size={64} className="mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Assessment Complete</h2>
            <p className="text-gray-400 mb-8">
              Your personalized plan is ready!
            </p>
            <motion.button
              variants={buttonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              onClick={onNext}
              className="px-8 py-4 rounded-xl font-semibold text-black"
              style={{ backgroundColor: colors.primary }}
            >
              View Your Plan
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

const PlanGenerationStep = ({ onNext }) => {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onNext, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onNext]);

  return (
    <div className="flex flex-col h-screen px-6 py-8 items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mb-8">
          <Brain color={colors.primary} size={64} className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-white mb-4">Creating Your Plan</h1>
          <p className="text-gray-400">
            Our AI is analyzing your data and designing a personalized program
          </p>
        </div>
        
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: colors.primary }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-4 text-white font-medium">
          {progress}%
        </div>
      </motion.div>
    </div>
  );
};

const PlanReviewStep = ({ onComplete, onBack }) => (
  <div className="flex flex-col h-screen px-6 py-8">
    <motion.button 
      onClick={onBack}
      className="mb-8 flex items-center text-gray-400"
      whileHover={{ x: -4 }}
    >
      <ArrowLeft size={20} className="mr-2" />
      Back
    </motion.button>
    
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="flex-1"
    >
      <motion.h1 variants={fadeInUp} className="text-2xl font-bold text-white mb-8">
        Your Personalized Plan
      </motion.h1>
      
      <motion.div variants={fadeInUp} className="space-y-6 mb-8">
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-2">Weekly Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Sessions</p>
              <p className="text-lg font-semibold text-white">3 per week</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Duration</p>
              <p className="text-lg font-semibold text-white">30 min each</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-4">Training Focus</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Neural Training</span>
              <span className="text-green-500 font-semibold">40%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full">
              <div className="h-full w-2/5 rounded-full bg-green-500" />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Physical Training</span>
              <span className="text-blue-500 font-semibold">60%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full">
              <div className="h-full w-3/5 rounded-full bg-blue-500" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
    
    <motion.button
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onComplete}
      className="w-full py-4 rounded-xl font-semibold text-black"
      style={{ backgroundColor: colors.primary }}
    >
      Start My Journey
    </motion.button>
  </div>
);

const WorkoutCard = ({ workout, onClick }) => (
  <motion.div
    variants={cardVariants}
    initial="default"
    whileHover="hover"
    whileTap="tap"
    onClick={onClick}
    className="rounded-xl overflow-hidden cursor-pointer"
    style={{ backgroundColor: colors.surface }}
  >
    <div className="h-40 bg-gray-700 relative">
      <img 
        src="/api/placeholder/400/200" 
        alt={workout.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-4">
        <div className="text-white font-semibold">{workout.title}</div>
        <div className="text-sm text-gray-300">{workout.duration} • {workout.exerciseCount} exercises</div>
      </div>
      <div 
        className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ backgroundColor: colors.primary }}
      >
        <workout.icon className="text-black" size={16} />
      </div>
    </div>
    <div className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-white font-medium">Focus: {workout.focus}</div>
          <div className="text-sm text-gray-400">Difficulty: {workout.difficulty}</div>
        </div>
        <motion.button 
          className="w-10 h-10 rounded-full flex items-center justify-center" 
          style={{ backgroundColor: colors.primary }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Play className="text-black" size={16} />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

const ProgressTracker = ({ progress }) => (
  <motion.div 
    variants={cardVariants}
    initial="default"
    whileHover="hover"
    className="rounded-xl p-5"
    style={{ backgroundColor: colors.surface }}
  >
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-white font-semibold">Weekly Progress</h3>
      <span 
        className="text-sm px-2 py-1 rounded-full"
        style={{ backgroundColor: colors.primary, color: 'black' }}
      >
        +12%
      </span>
    </div>
    <div className="space-y-3">
      {progress.map((item, index) => (
        <div key={index}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-400">{item.label}</span>
            <span className="text-white">{item.value}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: item.color }}
              variants={progressBar}
              initial="initial"
              animate="animate"
              custom={`${item.value}%`}
            />
          </div>
        </div>
      ))}
    </div>
  </motion.div>
);

const HomeScreen = () => {
  const workouts = [
    {
      id: 1,
      title: 'Neural Activation',
      duration: '20 min',
      exerciseCount: 5,
      icon: Brain,
      focus: 'Balance',
      difficulty: 'Beginner',
    },
    {
      id: 2,
      title: 'Strength Basics',
      duration: '30 min',
      exerciseCount: 8,
      icon: Dumbbell,
      focus: 'Core',
      difficulty: 'Intermediate',
    },
  ];

  const progressData = [
    { label: 'Neural Training', value: 68, color: colors.primary },
    { label: 'Physical Training', value: 82, color: '#00D1FF' },
    { label: 'Plan Completion', value: 75, color: '#FF00E5' },
  ];

  return (
    <div className="pb-24">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-6 pt-8"
      >
        <motion.div variants={fadeInUp} className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome back, Sarah</h1>
          <p className="text-gray-400">Ready for today's neural training?</p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <h2 className="text-lg font-semibold text-white mb-4">Today's Workouts</h2>
          <div className="space-y-4">
            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} onClick={() => {}} />
            ))}
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Your Progress</h2>
          <ProgressTracker progress={progressData} />
        </motion.div>
      </motion.div>
    </div>
  );
};

// Main Application
const NeuronlinePlatform = () => {
  const [onboarded, setOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  if (!onboarded) {
    return <OnboardingFlow onComplete={() => setOnboarded(true)} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'workouts' && (
            <div className="p-6 text-white">Workouts Screen</div>
          )}
          {activeTab === 'neuro' && (
            <div className="p-6 text-white">Neuro Screen</div>
          )}
          {activeTab === 'progress' && (
            <div className="p-6 text-white">Progress Screen</div>
          )}
          {activeTab === 'profile' && (
            <div className="p-6 text-white">Profile Screen</div>
          )}
        </motion.div>
      </AnimatePresence>
      <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default NeuronlinePlatform;