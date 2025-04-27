'use client';

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface IOSCardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  variant?: 'default' | 'active' | 'inactive'
  blurHash?: string
  children: React.ReactNode
  onPress?: () => void
}

const IOSCard = React.forwardRef<HTMLDivElement, IOSCardProps>(
  ({ className, variant = 'default', blurHash, children, onPress, ...props }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);

    const handlePressStart = () => {
      setIsPressed(true);
      onPress?.();
    };

    const handlePressEnd = () => {
      setIsPressed(false);
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10",
          "bg-black/40 backdrop-blur-xl backdrop-saturate-150",
          "transition-all duration-300 ease-out",
          "hover:bg-black/50 hover:border-white/20",
          "active:scale-[0.98] active:bg-black/60",
          "dark:border-white/5 dark:bg-white/5",
          "safe-top safe-left safe-right safe-bottom",
          variant === 'active' && "bg-black/60 border-white/20",
          variant === 'inactive' && "opacity-50",
          isPressed && "scale-[0.98] bg-black/60",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: isPressed ? 0.98 : 1,
          backgroundColor: isPressed ? "rgba(0, 0, 0, 0.6)" : "rgba(0, 0, 0, 0.4)"
        }}
        exit={{ opacity: 0, y: 20 }}
        whileHover={{ 
          scale: 1.02,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          borderColor: "rgba(255, 255, 255, 0.2)"
        }}
        whileTap={{ 
          scale: 0.98,
          backgroundColor: "rgba(0, 0, 0, 0.6)"
        }}
        onTapStart={handlePressStart}
        onTapCancel={handlePressEnd}
        onTapEnd={handlePressEnd}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
        {...props}
      >
        {blurHash && (
          <div 
            className="absolute inset-0 z-0 opacity-50"
            style={{ 
              backgroundImage: `url(data:image/jpeg;base64,${blurHash})`,
              filter: 'blur(20px)',
              transform: 'scale(1.1)'
            }} 
          />
        )}
        <div className="relative z-10">{children}</div>
      </motion.div>
    )
  }
)
IOSCard.displayName = "IOSCard"

export { IOSCard } 