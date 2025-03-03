"use client"

import { motion } from "framer-motion"

interface GhostPlaceholderProps {
  isVisible: boolean
  className?: string
}

export function GhostPlaceholder({
  isVisible,
  className = "",
}: GhostPlaceholderProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.95,
      }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 300,
      }}
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <div className="absolute inset-0 bg-white/5" />
      <div className="absolute inset-0 border border-white/5" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
    </motion.div>
  )
}
