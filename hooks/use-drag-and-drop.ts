"use client"

import { useCallback, useEffect, useState } from "react"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import type { ImageItem, ContainerType } from "@/types"
import { ANIMATION_DURATION_MS } from "@/config/constants"

interface DragAndDropProps {
  gridImages: ImageItem[]
  sidebarImages: ImageItem[]
  onMoveToGrid: (id: string) => Promise<void>
  onMoveToSidebar: (id: string) => Promise<void>
  onUpdateImageOrder: (
    container: ContainerType,
    oldIndex: number,
    newIndex: number,
    shouldSlide: boolean
  ) => Promise<void>
  onSwapImages: (sourceId: string, targetId: string) => Promise<void>
  shouldSlide?: boolean
}

/**
 * Custom hook for managing drag and drop functionality for images between grid and sidebar
 * @param gridImages - Array of images in the grid
 * @param sidebarImages - Array of images in the sidebar
 * @param onMoveToGrid - Callback for moving an image to the grid
 * @param onMoveToSidebar - Callback for moving an image to the sidebar
 * @param onUpdateImageOrder - Function to update the order of images within a container
 * @param onSwapImages - Function to swap images between containers
 * @param shouldSlide - Determines if images should slide when moved, controlled externally
 * @returns An object with the following properties:
 * @property activeId - The ID of the currently active (dragging) image
 * @property handleDragStart - Function to handle the start of a drag operation
 * @property handleDragEnd - Function to handle the end of a drag operation
 * @property getActiveImage - Function to get the currently active image object
 * @property shouldSlide - Indicates whether images should slide during movement
 */
export function useDragAndDrop({
  gridImages,
  sidebarImages,
  onMoveToGrid,
  onMoveToSidebar,
  onUpdateImageOrder,
  onSwapImages,
  shouldSlide: externalShouldSlide,
}: DragAndDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [internalShouldSlide, setInternalShouldSlide] = useState(false)

  // Use external shouldSlide prop if provided, otherwise use internal state
  const shouldSlide =
    externalShouldSlide !== undefined
      ? externalShouldSlide
      : internalShouldSlide

  // Update internal state when external prop changes
  useEffect(() => {
    if (externalShouldSlide !== undefined)
      setInternalShouldSlide(externalShouldSlide)
  }, [externalShouldSlide])

  // Only use internal key tracking if shouldSlide prop is not provided
  useEffect(() => {
    if (externalShouldSlide !== undefined) return

    const toggleSlide = (e: KeyboardEvent) => {
      if (e.key === "Shift") setInternalShouldSlide(e.type === "keydown")
    }

    window.addEventListener("keydown", toggleSlide)
    window.addEventListener("keyup", toggleSlide)
    return () => {
      window.removeEventListener("keydown", toggleSlide)
      window.removeEventListener("keyup", toggleSlide)
    }
  }, [externalShouldSlide])

  /**
   * Handles the start of a drag operation
   * @param event - The drag start event
   */
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  /**
   * Handles the end of a drag operation
   * @param event - The drag end event
   */
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event

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
        !shouldSlide
      ) {
        await new Promise((resolve) =>
          setTimeout(resolve, ANIMATION_DURATION_MS)
        )
        await onSwapImages(active.id as string, over.id as string)
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
            await new Promise((resolve) =>
              setTimeout(resolve, ANIMATION_DURATION_MS)
            )
            await onUpdateImageOrder(container, oldIndex, newIndex, shouldSlide)
          }
        }
      }
      // Handle moving between containers (without swapping)
      else if (activeInSidebar && overInGrid) {
        await onMoveToGrid(active.id as string)
      } else if (activeInGrid && overInSidebar) {
        await onMoveToSidebar(active.id as string)
      }
    },
    [
      gridImages,
      sidebarImages,
      onMoveToGrid,
      onMoveToSidebar,
      onUpdateImageOrder,
      shouldSlide,
      onSwapImages,
    ]
  )

  /**
   * Gets the active image being dragged
   * @returns The active image or null
   */
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
    shouldSlide,
  }
}
