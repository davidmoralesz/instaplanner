"use client"

import { useState, useCallback } from "react"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import type { ImageItem } from "@/types"

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
 * Custom hook for handling drag and drop functionality
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

  // Add this to handle drag start animation
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
    setDragOverlayAnimation({
      ...dragOverlayConfig,
      animate: {
        ...dragOverlayConfig.animate,
        rotate: Math.random() * 6 - 3, // Random slight rotation between -3 and 3 degrees
      },
    })
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null)
      const { active, over } = event

      if (!over) return

      const activeImage =
        sidebarImages.find((img) => img.id === active.id) ||
        gridImages.find((img) => img.id === active.id)

      if (!activeImage) return

      // Moving to grid
      if (over.id === "grid" || gridImages.some((img) => img.id === over.id)) {
        // If coming from sidebar
        if (sidebarImages.find((img) => img.id === active.id)) {
          moveImageToGrid(active.id as string)
        }
        // Reordering within grid
        else if (gridImages.find((img) => img.id === active.id)) {
          const oldIndex = gridImages.findIndex((img) => img.id === active.id)
          const newIndex = gridImages.findIndex((img) => img.id === over.id)

          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            updateImageOrder("grid", oldIndex, newIndex)
          }
        }
      }
      // Moving to sidebar
      else if (
        over.id === "sidebar" ||
        sidebarImages.some((img) => img.id === over.id)
      ) {
        if (gridImages.find((img) => img.id === active.id)) {
          moveImageToSidebar(active.id as string)
        }
        // Reordering within sidebar
        else if (sidebarImages.find((img) => img.id === active.id)) {
          const oldIndex = sidebarImages.findIndex(
            (img) => img.id === active.id
          )
          const newIndex = sidebarImages.findIndex((img) => img.id === over.id)

          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            updateImageOrder("sidebar", oldIndex, newIndex)
          }
        }
      }
    },
    [
      gridImages,
      sidebarImages,
      moveImageToGrid,
      moveImageToSidebar,
      updateImageOrder,
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
    dragOverlayAnimation, // Export the animation config
  }
}
