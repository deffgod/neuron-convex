'use client';

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { useScreenSize } from "@/hooks/use-screen-size"

interface IOS3DCardProps extends React.HTMLAttributes<HTMLDivElement> {
  depth?: number
  backgroundImage?: string
  children: React.ReactNode
}

export function IOS3DCard({
  depth = 50,
  backgroundImage,
  children,
  className,
  ...props
}: IOS3DCardProps) {
  const [hovering, setHovering] = React.useState(false)

  // Mouse position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Spring animations for smooth movement
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig)
  const scale = useSpring(hovering ? 1.05 : 1, springConfig)
  const brightness = useSpring(hovering ? 1.1 : 1, springConfig)

  // Parallax layers
  const layerOneX = useTransform(mouseX, [-0.5, 0.5], [-15, 15])
  const layerOneY = useTransform(mouseY, [-0.5, 0.5], [-15, 15])
  const layerTwoX = useTransform(mouseX, [-0.5, 0.5], [-25, 25])
  const layerTwoY = useTransform(mouseY, [-0.5, 0.5], [-25, 25])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = (event.clientX - rect.left) / rect.width - 0.5
    const centerY = (event.clientY - rect.top) / rect.height - 0.5
    mouseX.set(centerX)
    mouseY.set(centerY)
  }

  return (
    <motion.div
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        scale
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false)
        mouseX.set(0)
        mouseY.set(0)
      }}
      onMouseMove={handleMouseMove}
      className={cn("relative cursor-pointer", className)}
      {...props}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative w-full h-full"
      >
        {/* Background layer */}
        <motion.div
          style={{
            filter: `brightness(${brightness.get()})`,
            x: layerOneX,
            y: layerOneY,
            z: -depth
          }}
          className="absolute inset-0 rounded-2xl overflow-hidden"
        >
          {backgroundImage && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/60" />
        </motion.div>

        {/* Content layer */}
        <motion.div
          style={{
            x: layerTwoX,
            y: layerTwoY,
            z: 0
          }}
          className="relative z-10"
        >
          {children}
        </motion.div>

        {/* Glass effect */}
        <motion.div
          style={{
            opacity: useTransform(mouseX, [-0.5, 0, 0.5], [0.2, 0, 0.2]),
            x: useTransform(mouseX, [-0.5, 0.5], ["20%", "-20%"]),
            rotateY: useTransform(mouseX, [-0.5, 0.5], [15, -15])
          }}
          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-white/0"
        />
      </motion.div>
    </motion.div>
  )
} 