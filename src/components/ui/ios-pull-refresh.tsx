'use client';

import * as React from "react"
import { motion, useMotionValue, useTransform, useSpring, useAnimation } from "framer-motion"
import { ArrowDown, CheckCircle2, RefreshCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface IOSPullRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  className?: string
}

export function IOSPullRefresh({
  onRefresh,
  children,
  className
}: IOSPullRefreshProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const controls = useAnimation()
  
  const y = useMotionValue(0)
  const springY = useSpring(y, {
    stiffness: 400,
    damping: 30,
    mass: 0.2
  })

  const pullProgress = useTransform(y, [0, 80], [0, 1])
  const iconRotation = useTransform(pullProgress, [0, 1], [0, 180])
  const iconScale = useTransform(pullProgress, [0, 1], [0.8, 1])
  const iconOpacity = useTransform(pullProgress, [0, 0.2, 1], [0, 0.8, 1])

  const handleDragEnd = async () => {
    setIsDragging(false)
    const currentY = y.get()
    
    if (currentY >= 80 && !isRefreshing) {
      setIsRefreshing(true)
      controls.start({
        y: 60,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      })

      try {
        await onRefresh()
        controls.start({
          y: 0,
          transition: { type: "spring", stiffness: 300, damping: 30 }
        })
      } finally {
        setIsRefreshing(false)
      }
    } else {
      controls.start({
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 }
      })
    }
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 120 }}
        dragElastic={0.4}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ y: springY }}
      >
        {/* Pull to refresh indicator */}
        <motion.div
          className="absolute top-0 left-0 right-0 flex justify-center"
          style={{ opacity: iconOpacity, y: -20 }}
        >
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {isRefreshing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCcw className="w-5 h-5" />
                </motion.div>
                <span>Обновление...</span>
              </>
            ) : (
              <>
                <motion.div style={{ rotate: iconRotation, scale: iconScale }}>
                  <ArrowDown className="w-5 h-5" />
                </motion.div>
                <span>{pullProgress.get() >= 1 ? "Отпустите для обновления" : "Потяните для обновления"}</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Content */}
        {children}
      </motion.div>
    </div>
  );
} 