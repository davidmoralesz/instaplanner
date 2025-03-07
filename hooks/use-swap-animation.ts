"use client"

import { useState, useCallback } from "react"
import { calculateSwapTransform, easings } from "@/lib/animation-utils"

interface SwapAnimationState {
  isAnimating: boolean
  sourceId: string | null
  targetId: string | null
  sourceRect: DOMRect | null
  targetRect: DOMRect | null
}

export const ANIMATION_DURATION = 50

export function useSwapAnimation() {
  const [swapState, setSwapState] = useState<SwapAnimationState>({
    isAnimating: false,
    sourceId: null,
    targetId: null,
    sourceRect: null,
    targetRect: null,
  })

  // Start a swap animation between two images
  const startSwapAnimation = useCallback(
    (sourceId: string, targetId: string) => {
      // Get the DOM elements for both images
      const sourceElement = document.getElementById(`image-${sourceId}`)
      const targetElement = document.getElementById(`image-${targetId}`)

      if (!sourceElement || !targetElement) return

      // Get the current positions and dimensions
      const sourceRect = sourceElement.getBoundingClientRect()
      const targetRect = targetElement.getBoundingClientRect()

      // Set the animation state
      setSwapState({
        isAnimating: true,
        sourceId,
        targetId,
        sourceRect,
        targetRect,
      })

      // End the animation after it completes
      setTimeout(() => {
        setSwapState((prev) => ({ ...prev, isAnimating: false }))
      }, ANIMATION_DURATION)
    },
    []
  )

  // Calculate animation styles for an image
  const getSwapAnimationStyles = useCallback(
    (imageId: string) => {
      if (!swapState.isAnimating) return {}

      // If this is the source image
      if (
        imageId === swapState.sourceId &&
        swapState.targetRect &&
        swapState.sourceRect
      ) {
        const { sourceTransform } = calculateSwapTransform(
          swapState.sourceRect,
          swapState.targetRect
        )

        return {
          zIndex: 10,
          transition: `transform ${ANIMATION_DURATION}ms cubic-bezier(${easings.easeInOut.join(", ")})`,
          transform: `translate(${sourceTransform.x}px, ${sourceTransform.y}px)`,
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        }
      }

      // If this is the target image
      if (
        imageId === swapState.targetId &&
        swapState.sourceRect &&
        swapState.targetRect
      ) {
        const { targetTransform } = calculateSwapTransform(
          swapState.sourceRect,
          swapState.targetRect
        )

        return {
          zIndex: 10,
          transition: `transform ${ANIMATION_DURATION}ms cubic-bezier(${easings.easeInOut.join(", ")})`,
          transform: `translate(${targetTransform.x}px, ${targetTransform.y}px)`,
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        }
      }

      return {}
    },
    [swapState]
  )

  return {
    isSwapAnimating: swapState.isAnimating,
    startSwapAnimation,
    getSwapAnimationStyles,
  }
}
