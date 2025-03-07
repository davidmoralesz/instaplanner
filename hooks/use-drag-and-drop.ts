"use client"

import {
  ANIMATION_DURATION,
  useSwapAnimation,
} from "@/hooks/use-swap-animation"
import type { ImageItem } from "@/types"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { useCallback, useState } from "react"

interface UseDragAndDropProps {
  gridImages: ImageItem[]
  sidebarImages: ImageItem[]
  moveImageToGrid: (id: string) => Promise<void>
  moveImageToSidebar: (id: string) => Promise<void>
  updateImageOrder: (
    container: "grid" | "sidebar",
    oldIndex: number,
    newIndex: number
  ) => Promise<void>
}

// Add dragOverlay animation configuration
const dragOverlayConfig = {
  initial: { opacity: 0, scale: 0.85, rotate: -3 },
  animate: { opacity: 1, scale: 1.05, rotate: 0 },
  exit: { opacity: 0, scale: 0.85, rotate: 3 },
  transition: {
    type: "spring",
    damping: 15,
    stiffness: 200,
  },
}

/**
 * Custom hook for handling drag and drop functionality with direct swap animations
 */
export function useDragAndDrop({
  gridImages,
  sidebarImages,
  moveImageToGrid,
  moveImageToSidebar,
  updateImageOrder,
}: UseDragAndDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dragOverlayAnimation, setDragOverlayAnimation] =
    useState(dragOverlayConfig)
  const { startSwapAnimation, isSwapAnimating } = useSwapAnimation()

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    setDragOverlayAnimation({
      ...dragOverlayConfig,
      animate: {
        ...dragOverlayConfig.animate,
        rotate: Math.random() * 6 - 3,
      },
    })
  }, [])

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

      const handleSwapAnimation = async (
        container: "grid" | "sidebar",
        oldIndex: number,
        newIndex: number
      ) => {
        const isValidIndex =
          oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex

        if (isValidIndex) {
          // Trigger the swap animation before updating the order
          startSwapAnimation(active.id as string, over.id as string)

          // Delay the actual reordering to allow animation to complete
          await new Promise((resolve) =>
            setTimeout(resolve, ANIMATION_DURATION)
          )
          await updateImageOrder(container, oldIndex, newIndex)
        }
      }

      const moveImage = async (moveFn: (id: string) => Promise<void>) => {
        await moveFn(active.id as string)
      }

      const reorderImages = async (
        container: "grid" | "sidebar",
        images: ImageItem[]
      ) => {
        const oldIndex = images.findIndex((img) => img.id === active.id)
        const newIndex = images.findIndex((img) => img.id === over.id)
        await handleSwapAnimation(container, oldIndex, newIndex)
      }

      switch (true) {
        case overInGrid:
          if (activeInSidebar) await moveImage(moveImageToGrid)
          if (activeInGrid) await reorderImages("grid", gridImages)
          break
        case overInSidebar:
          if (activeInGrid) await moveImage(moveImageToSidebar)
          if (activeInSidebar) await reorderImages("sidebar", sidebarImages)
          break
        default:
          break
      }
    },
    [
      gridImages,
      sidebarImages,
      moveImageToGrid,
      moveImageToSidebar,
      updateImageOrder,
      startSwapAnimation,
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
  }
}
