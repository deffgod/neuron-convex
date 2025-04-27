'use client'

import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="relative"
      >
        <Brain className="w-16 h-16 text-[#7CFF00]" />
        <motion.div
          className="absolute inset-0 rounded-full bg-[#7CFF00] blur-xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      <motion.div
        className="absolute bottom-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7CFF00] to-[#00FF9D]">
          Neuronline
        </h2>
        <p className="text-gray-400 mt-2">Загрузка...</p>
      </motion.div>
    </div>
  )
} 