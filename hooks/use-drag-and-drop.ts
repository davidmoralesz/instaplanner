"use client"

import {
  ANIMATION_DURATION,
  useSwapAnimation,
} from "@/hooks/use-swap-animation"
import type { ImageItem } from "@/types"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { useCallback, useEffect, useState } from "react"

interface UseDragAndDropProps {
  gridImages: ImageItem[]
  sidebarImages: ImageItem[]
  moveImageToGrid: (id: string) => Promise<void>
  moveImageToSidebar: (id: string) => Promise<void>
  updateImageOrder: (
    container: "grid" | "sidebar",
    oldIndex: number,
    newIndex: number,
    shouldSlide: boolean
  ) => Promise<void>
  swapImages: (sourceId: string, targetId: string) => Promise<void>
  shouldSlide: boolean
}

const dragOverlayConfig = {
  transition: {
    type: "tween",
    damping: 15,
    stiffness: 300,
  },
}

/**
 * Custom hook for handling drag and drop functionality with direct swap animations,
 * with an optional sliding effect when Shift is held.
 */
export function useDragAndDrop({
  gridImages,
  sidebarImages,
  moveImageToGrid,
  moveImageToSidebar,
  updateImageOrder,
  swapImages,
  shouldSlide = false,
}: UseDragAndDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dragOverlayAnimation, setDragOverlayAnimation] =
    useState(dragOverlayConfig)
  const [internalShouldSlide, setInternalShouldSlide] = useState(shouldSlide)
  const { startSwapAnimation, isSwapAnimating } = useSwapAnimation()

  useEffect(() => {
    setInternalShouldSlide(shouldSlide)
  }, [shouldSlide])

  useEffect(() => {
    if (shouldSlide !== undefined) return

    const toggleSlide = (e: KeyboardEvent) => {
      if (e.key === "Shift") setInternalShouldSlide(e.type === "keydown")
    }

    window.addEventListener("keydown", toggleSlide)
    window.addEventListener("keyup", toggleSlide)
    return () => {
      window.removeEventListener("keydown", toggleSlide)
      window.removeEventListener("keyup", toggleSlide)
    }
  }, [shouldSlide])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    setDragOverlayAnimation({ ...dragOverlayConfig })
  }, [])

  const handleSwapAnimation = useCallback(
    async (
      container: "grid" | "sidebar",
      oldIndex: number,
      newIndex: number
    ) => {
      const images = container === "grid" ? gridImages : sidebarImages
      startSwapAnimation(images[oldIndex].id, images[newIndex].id)
      await new Promise((resolve) => setTimeout(resolve, ANIMATION_DURATION))
      await updateImageOrder(container, oldIndex, newIndex, internalShouldSlide)
    },
    [
      startSwapAnimation,
      updateImageOrder,
      internalShouldSlide,
      gridImages,
      sidebarImages,
    ]
  )

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event

      // Clear active ID after a short delay to allow for animation
      setTimeout(() => setActiveId(null), 50)

      if (!over) return

      const activeImage =
        sidebarImages.find((img) => img.id === active.id) ||
        gridImages.find((img) => img.id === active.id)

      if (!activeImage) return

      const activeInSidebar = sidebarImages.some((img) => img.id === active.id)
      const activeInGrid = gridImages.some((img) => img.id === active.id)
      const overInSidebar =
        over.id === "sidebar" || sidebarImages.some((img) => img.id === over.id)
      const overInGrid =
        over.id === "grid" || gridImages.some((img) => img.id === over.id)

      // Check if we're hovering over a specific image (not just a container)
      const isOverSpecificImage = over.id !== "grid" && over.id !== "sidebar"

      // Handle swapping between containers - only if Shift is NOT pressed
      if (
        isOverSpecificImage &&
        ((activeInGrid && overInSidebar) || (activeInSidebar && overInGrid)) &&
        !internalShouldSlide
      ) {
        // Trigger the swap animation
        startSwapAnimation(active.id as string, over.id as string)

        // Wait for animation to complete
        await new Promise((resolve) => setTimeout(resolve, ANIMATION_DURATION))

        // Perform the swap
        await swapImages(active.id as string, over.id as string)
        return
      }

      // Handle reordering within the same container
      if ((activeInGrid && overInGrid) || (activeInSidebar && overInSidebar)) {
        const container = activeInGrid ? "grid" : "sidebar"
        const images = activeInGrid ? gridImages : sidebarImages

        // If dropping on a specific image
        if (isOverSpecificImage) {
          const oldIndex = images.findIndex((img) => img.id === active.id)
          const newIndex = images.findIndex((img) => img.id === over.id)

          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            await handleSwapAnimation(container, oldIndex, newIndex)
          }
        }
      }
      // Handle moving between containers (without swapping)
      else if (activeInSidebar && overInGrid) {
        await moveImageToGrid(active.id as string)
      } else if (activeInGrid && overInSidebar) {
        await moveImageToSidebar(active.id as string)
      }
    },
    [
      gridImages,
      sidebarImages,
      moveImageToGrid,
      moveImageToSidebar,
      updateImageOrder,
      startSwapAnimation,
      internalShouldSlide,
      swapImages,
      handleSwapAnimation,
    ]
  )

  const getActiveImage = useCallback(() => {
    if (!activeId) return null
    return (
      sidebarImages.find((img) => img.id === activeId) ||
      gridImages.find((img) => img.id === activeId) ||
      null
    )
  }, [activeId, gridImages, sidebarImages])

  return {
    activeId,
    handleDragStart,
    handleDragEnd,
    getActiveImage,
    dragOverlayAnimation,
    isSwapAnimating,
    shouldSlide: internalShouldSlide,
  }
}
