'use client'

import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  count?: number
  animated?: boolean
}

export function Skeleton({
  className,
  count = 1,
  animated = true,
  ...props
}: SkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i)

  return (
    <>
      {skeletons.map((index) => (
        <motion.div
          key={index}
          className={cn(
            "rounded-md bg-zinc-800/50 backdrop-blur-sm",
            animated && "animate-pulse",
            className
          )}
          initial={animated ? { opacity: 0, y: 20 } : undefined}
          animate={animated ? { opacity: 1, y: 0 } : undefined}
          transition={{
            delay: index * 0.1,
            duration: 0.5
          }}
          {...props}
        />
      ))}
    </>
  )
}

export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-[200px]" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24" count={4} />
      </div>
    </div>
  )
}

export function WorkoutSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[300px]" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-20" count={3} />
      </div>
    </div>
  )
} 