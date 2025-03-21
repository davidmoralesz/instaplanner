/**
 * Animation utilities for the drag and drop system
 */
import { ANIMATION_DURATION_MS } from "@/config/constants"
import { defaultDropAnimationSideEffects } from "@dnd-kit/core"
import type { DragOverlayConfig } from "@/lib/dnd/types"

/**
 * Base transition configuration for animations
 */
export const tweenTransition = {
  type: "tween",
  damping: 15,
  stiffness: 200,
} as const

/**
 * Animation configuration for fading elements in and out
 */
export const fadeAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { ...tweenTransition },
}

/**
 * Animation configuration for the drag overlay
 * Creates a slight rotation effect while dragging
 */
export const dragOverlayAnimation: DragOverlayConfig = {
  initial: { opacity: 0, rotate: 0 },
  animate: { opacity: 0.5, rotate: Math.random() < 0.5 ? -3 : 3 },
  exit: { opacity: 0, rotate: 0 },
  transition: { duration: 0.5 },
}

/**
 * Animation configuration for dropping elements
 * Creates a smooth transition to the new position
 */
export const dropAnimation = {
  duration: ANIMATION_DURATION_MS,
  easing: "ease-out",
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      dragOverlay: {
        transition: `opacity ${ANIMATION_DURATION_MS}ms ease`,
        opacity: "0",
      },
    },
  }),
}
