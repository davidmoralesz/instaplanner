"use client"

import { useCallback, useEffect, useState } from "react"
import type { ContainerType } from "@/types"

interface UseKeyboardNavigationProps {
  onMoveToGrid: (id: string) => Promise<void>
  onMoveToSidebar: (id: string) => Promise<void>
  onMoveAllToGrid: () => Promise<void>
  onMoveAllToSidebar: () => Promise<void>
  onDelete: (id: string, container: ContainerType) => Promise<void>
  onUndo: () => Promise<void>
  onRedo: () => Promise<void>
  canUndo: boolean
  canRedo: boolean
}

/**
 * Custom hook for managing keyboard navigation and actions for image manipulation.
 * @param onMoveToGrid - Callback for moving a single image to the grid
 * @param onMoveToSidebar - Callback for moving a single image to the sidebar
 * @param onMoveAllToGrid - Callback for moving all images to the grid
 * @param onMoveAllToSidebar - Callback for moving all images to the sidebar
 * @param onDelete - Callback for deleting an image
 * @param onUndo - Callback for undoing the last action
 * @param onRedo - Callback for redoing the last undone action
 * @param canUndo - Boolean indicating if undo is possible
 * @param canRedo - Boolean indicating if redo is possible
 * @returns An object with the following properties:
 * @property hoveredImageId - The ID of the currently hovered image
 * @property setHoveredImageId - Function to set the currently hovered image ID
 * @property hoveredContainer - The container (grid or sidebar) where the image is hovered
 * @property setHoveredContainer - Function to set the hovered container
 */
export function useKeyboardNavigation({
  onMoveToGrid,
  onMoveToSidebar,
  onMoveAllToGrid,
  onMoveAllToSidebar,
  onDelete,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: UseKeyboardNavigationProps) {
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null)
  const [hoveredContainer, setHoveredContainer] =
    useState<ContainerType | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMac = /Mac/i.test(navigator.userAgent)
      const modifierKey = isMac ? e.metaKey : e.ctrlKey

      // Handle navigation and movement
      if (hoveredImageId && hoveredContainer) {
        if (e.key === "ArrowLeft") {
          if (hoveredContainer === "grid") {
            e.preventDefault() // Prevent browser back navigation
            if (modifierKey) {
              onMoveAllToSidebar()
            } else {
              onMoveToSidebar(hoveredImageId)
            }
          }
        } else if (e.key === "ArrowRight") {
          if (hoveredContainer === "sidebar") {
            e.preventDefault() // Prevent browser forward navigation
            if (modifierKey) {
              onMoveAllToGrid()
            } else {
              onMoveToGrid(hoveredImageId)
            }
          }
        }

        // Handle delete
        if (
          (e.key === "Delete" || e.key === "Backspace") &&
          !(e.target as Element)?.matches("input, textarea")
        ) {
          e.preventDefault()
          onDelete(hoveredImageId, hoveredContainer)
        }
      }

      // Handle undo/redo
      if (modifierKey && e.key.toLowerCase() === "z") {
        e.preventDefault()
        if (e.shiftKey) {
          if (canRedo) onRedo()
        } else {
          if (canUndo) onUndo()
        }
      }
    },
    [
      hoveredImageId,
      hoveredContainer,
      onMoveToGrid,
      onMoveToSidebar,
      onMoveAllToGrid,
      onMoveAllToSidebar,
      onDelete,
      onUndo,
      onRedo,
      canUndo,
      canRedo,
    ]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return {
    hoveredImageId,
    setHoveredImageId,
    hoveredContainer,
    setHoveredContainer,
  }
}
