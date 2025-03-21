"use client"

import type { ContainerType, ImageItem } from "@/types"
import { useCallback, useState } from "react"

interface HistoryAction {
  type: "add" | "delete" | "move" | "clear" | "moveAll" | "shuffle" | "clearAll"
  images: ImageItem[]
  container: ContainerType
  targetContainer?: ContainerType
  previousOrder?: ImageItem[]
  positions?: number[]
}

/**
 * Custom hook that manages a history stack for actions like add, delete, move, clear, shuffle, etc.
 * It allows users to undo and redo actions on images in containers.
 * @returns An object with the following properties:
 * @property pushAction: Function to push a new action to the history stack
 * @property undo: Function to undo the last action, returning the undone action
 * @property redo: Function to redo the last undone action, returning the redone action
 * @property canUndo: A boolean that indicates whether an undo action is possible
 * @property canRedo: A boolean that indicates whether a redo action is possible
 */
export function useHistory() {
  const [undoStack, setUndoStack] = useState<HistoryAction[]>([])
  const [redoStack, setRedoStack] = useState<HistoryAction[]>([])

  const pushAction = useCallback((action: HistoryAction) => {
    if (process.env.NODE_ENV === "development")
      console.debug("[History] Pushing action:", action)

    setUndoStack((prev) => [...prev, action])
    setRedoStack([])
  }, [])

  const undo = useCallback(() => {
    const action = undoStack[undoStack.length - 1]
    if (!action) return null

    if (process.env.NODE_ENV === "development")
      console.debug("[History] Undoing action:", action)

    setUndoStack((prev) => prev.slice(0, -1))
    setRedoStack((prev) => [...prev, action])

    return {
      action,
      type: "undo" as const,
    }
  }, [undoStack])

  const redo = useCallback(() => {
    const action = redoStack[redoStack.length - 1]
    if (!action) return null

    if (process.env.NODE_ENV === "development")
      console.debug("[History] Redoing action:", action)

    setRedoStack((prev) => prev.slice(0, -1))
    setUndoStack((prev) => [...prev, action])

    return {
      action,
      type: "redo" as const,
    }
  }, [redoStack])

  const canUndo = undoStack.length > 0
  const canRedo = redoStack.length > 0

  return {
    pushAction,
    undo,
    redo,
    canUndo,
    canRedo,
  }
}
