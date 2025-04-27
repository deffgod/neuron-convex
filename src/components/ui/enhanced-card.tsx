'use client';

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { useScreenSize } from "@/hooks/use-screen-size"

interface EnhancedCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: 'default' | 'neon' | 'glass' | 'interactive'
  children: React.ReactNode
  showParticles?: boolean
  glowColor?: string
  depth?: number
}

export function EnhancedCard({
  variant = 'default',
  children,
  showParticles = false,
  glowColor = 'var(--theme-color)',
  depth = 20,
  className,
  ...props
}: EnhancedCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const screenSize = useScreenSize()
  const isTouch = screenSize.lessThan('md')

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring animations
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig)
  const scale = useSpring(isHovered ? 1.02 : 1, springConfig)

  // Particles for interactive effect
  const particles = React.useMemo(() => 
    Array(5).fill(0).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }))
  , [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  return (
    <motion.div
      style={{
        perspective: 1000,
        scale
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        mouseX.set(0)
        mouseY.set(0)
      }}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative overflow-hidden rounded-2xl gpu-accelerated",
        variant === 'neon' && "neon-border",
        variant === 'glass' && "glass-morphism",
        variant === 'interactive' && "interactive-hover",
        className
      )}
      {...props}
    >
      <motion.div
        style={{
          rotateX: isTouch ? 0 : rotateX,
          rotateY: isTouch ? 0 : rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative w-full h-full"
      >
        {/* Background Glow */}
        <motion.div
          className="absolute inset-0 opacity-0 transition-opacity duration-300"
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          style={{
            background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
            filter: 'blur(20px)'
          }}
        />

        {/* Floating Particles */}
        {showParticles && (
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: glowColor,
                  x: `${particle.x}%`,
                  y: `${particle.y}%`,
                }}
                animate={{
                  x: [
                    `${particle.x}%`,
                    `${particle.x + 10}%`,
                    `${particle.x}%`
                  ],
                  y: [
                    `${particle.y}%`,
                    `${particle.y - 10}%`,
                    `${particle.y}%`
                  ],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        )}

        {/* Content with Depth */}
        <motion.div
          style={{
            translateZ: depth
          }}
          className="relative z-10"
        >
          {children}
        </motion.div>

        {/* Interactive Shine Effect */}
        {variant === 'interactive' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
            style={{
              backgroundSize: '200% 100%',
            }}
            animate={{
              opacity: isHovered ? 0.1 : 0,
              backgroundPosition: isHovered ? '200% center' : '-200% center',
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
} 