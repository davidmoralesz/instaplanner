"use client"

import { motion } from "framer-motion"

interface GhostPlaceholderProps {
  isVisible: boolean
  className?: string
  isSwap?: boolean
  isSlideMode?: boolean
}

export function GhostPlaceholder({
  isVisible,
  className = "",
  isSwap = false,
  isSlideMode = false,
}: GhostPlaceholderProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.95,
      }}
      transition={{
        type: "tween",
        damping: 20,
        stiffness: 300,
      }}
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <div
        className={`absolute inset-0 ${
          isSwap && !isSlideMode ? "bg-foreground/10" : "bg-foreground/5"
        }`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-b ${
          isSwap && !isSlideMode ? "from-foreground/20" : "from-foreground/10"
        } 
          to-transparent
        `}
      />
    </motion.div>
  )
}
