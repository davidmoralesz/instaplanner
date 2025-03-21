"use client"

/**
 * Component for rendering a ghost placeholder during drag operations
 */
import { motion } from "framer-motion"
import { tweenTransition } from "@/lib/dnd/animation"

interface GhostPlaceholderProps {
  /** Whether the placeholder is visible */
  isVisible: boolean
  /** Additional class names */
  className?: string
  /** Whether this is a swap operation */
  isSwap?: boolean
  /** Whether slide mode is active */
  isSlideMode?: boolean
}

/**
 * GhostPlaceholder component that displays a placeholder with animated visibility and scaling effects.
 * @param isVisible - Determines if the placeholder is visible or not
 * @param className - Custom additional class names to be applied to the component
 * @param isSwap - Indicates if the placeholder should behave differently during a swap action
 * @param isSlideMode - Specifies if the component is in slide mode for animations
 * @returns A placeholder component with animated visibility and scaling effects.
 */
export function GhostPlaceholder({
  isVisible,
  className = "",
  // isSwap = false,
  // isSlideMode = false,
}: GhostPlaceholderProps) {
  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.95,
      }}
      transition={{ ...tweenTransition }}
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <div className="absolute inset-0 bg-foreground/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 to-transparent" />
    </motion.div>
  )
}
