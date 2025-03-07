"use client"

import { useCallback, useEffect, useState } from "react"

interface UseKeyboardNavigationProps {
  onMoveToGrid: (id: string) => Promise<void>
  onMoveToSidebar: (id: string) => Promise<void>
  onMoveAllToGrid: () => Promise<void>
  onMoveAllToSidebar: () => Promise<void>
  onDelete: (id: string, container: "grid" | "sidebar") => Promise<void>
  onUndo: () => Promise<void>
  onRedo: () => Promise<void>
  canUndo: boolean
  canRedo: boolean
}

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
  const [hoveredContainer, setHoveredContainer] = useState<
    "grid" | "sidebar" | null
  >(null)

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

      // Handle undo/redo (works regardless of hover state)
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
