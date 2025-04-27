'use client';

import * as React from "react"
import { motion, useMotionValue, useTransform, useSpring, useAnimationControls } from "framer-motion"
import { useDragControls } from "framer-motion"
import { cn } from "@/lib/utils"

interface IOSSwiperProps {
  children: React.ReactNode[]
  className?: string
  itemWidth?: number
  gap?: number
  onIndexChange?: (index: number) => void
}

export function IOSSwiper({
  children,
  className,
  itemWidth = 80,
  gap = 12,
  onIndexChange
}: IOSSwiperProps) {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const controls = useAnimationControls()
  const dragControls = useDragControls()

  const x = useMotionValue(0)
  const springConfig = { stiffness: 300, damping: 30, mass: 0.2 }
  const springX = useSpring(x, springConfig)

  const containerWidth = React.useMemo(() => {
    if (!containerRef.current) return 0
    return containerRef.current.offsetWidth
  }, [])

  const maxScroll = React.useMemo(() => {
    const totalWidth = children.length * (itemWidth + gap) - gap
    return Math.max(0, totalWidth - containerWidth)
  }, [children.length, itemWidth, gap, containerWidth])

  const handleDragEnd = () => {
    const currentX = x.get()
    const itemTotalWidth = itemWidth + gap
    const newIndex = Math.round(-currentX / itemTotalWidth)
    const clampedIndex = Math.max(0, Math.min(newIndex, children.length - 1))
    const targetX = -clampedIndex * itemTotalWidth

    controls.start({
      x: targetX,
      transition: { type: "spring", ...springConfig }
    })

    setActiveIndex(clampedIndex)
    onIndexChange?.(clampedIndex)
  }

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden touch-pan-x", className)}
    >
      <motion.div
        drag="x"
        dragControls={dragControls}
        dragConstraints={{ left: -maxScroll, right: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x: springX }}
        className="flex"
      >
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            className={cn(
              "flex-shrink-0",
              index !== children.length - 1 && `mr-${gap}`
            )}
            style={{ width: itemWidth }}
            animate={{
              scale: index === activeIndex ? 1.05 : 1,
              opacity: index === activeIndex ? 1 : 0.7
            }}
            transition={{ type: "spring", ...springConfig }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
} 