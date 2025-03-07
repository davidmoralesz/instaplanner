/**
 * Calculates the transform values needed to swap two elements
 * @param sourceRect The bounding rectangle of the source element
 * @param targetRect The bounding rectangle of the target element
 * @returns The transform values for both elements
 */
export function calculateSwapTransform(
  sourceRect: DOMRect,
  targetRect: DOMRect
) {
  const sourceTransform = {
    x: targetRect.left - sourceRect.left,
    y: targetRect.top - sourceRect.top,
  }

  const targetTransform = {
    x: sourceRect.left - targetRect.left,
    y: sourceRect.top - targetRect.top,
  }

  return { sourceTransform, targetTransform }
}

/**
 * Creates a spring animation configuration for smooth transitions
 * @param damping The damping factor (higher = less oscillation)
 * @param stiffness The stiffness factor (higher = faster)
 * @returns A spring animation configuration object
 */
export function createSpringTransition(damping = 20, stiffness = 300) {
  return {
    type: "spring" as const,
    damping,
    stiffness,
  }
}

/**
 * Easing functions for animations
 */
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
}
