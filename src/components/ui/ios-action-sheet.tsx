'use client';

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface Action {
  label: string
  icon?: React.ReactNode
  destructive?: boolean
  onSelect: () => void
}

interface IOSActionSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  actions: Action[]
  className?: string
}

export function IOSActionSheet({
  isOpen,
  onClose,
  title,
  message,
  actions,
  className
}: IOSActionSheetProps) {
  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Sheet */}
          <motion.div
            className={cn(
              "relative w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-zinc-800/90 backdrop-blur-xl",
              "border border-white/10 shadow-2xl",
              "safe-bottom sm:safe-top sm:safe-bottom",
              className
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Header */}
              {(title || message) && (
                <div className="text-center space-y-2 mb-4">
                  {title && (
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                  )}
                  {message && (
                    <p className="text-sm text-gray-400">{message}</p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                {actions.map((action, index) => (
                  <motion.button
                    key={index}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2",
                      "text-sm font-medium transition-colors",
                      "bg-white/10 hover:bg-white/20",
                      action.destructive && "text-red-500 hover:text-red-400"
                    )}
                    onClick={() => {
                      action.onSelect()
                      onClose()
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {action.icon}
                    {action.label}
                  </motion.button>
                ))}
              </div>

              {/* Cancel button */}
              <motion.button
                className="w-full px-4 py-3 rounded-xl text-sm font-medium bg-white/10 hover:bg-white/20 mt-2"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 