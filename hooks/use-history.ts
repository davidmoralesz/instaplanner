"use client"

import { useState, useCallback } from "react"
import type { ImageItem } from "@/types"

type Container = "grid" | "sidebar" | "all"

interface HistoryAction {
  type: "add" | "delete" | "move" | "clear" | "moveAll" | "shuffle" | "clearAll"
  images: ImageItem[]
  container: Container
  targetContainer?: Container
  previousOrder?: ImageItem[]
}

export function useHistory() {
  const [undoStack, setUndoStack] = useState<HistoryAction[]>([])
  const [redoStack, setRedoStack] = useState<HistoryAction[]>([])

  const pushAction = useCallback((action: HistoryAction) => {
    setUndoStack((prev) => [...prev, action])
    setRedoStack([])
  }, [])

  const undo = useCallback(() => {
    const action = undoStack[undoStack.length - 1]
    if (!action) return null

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
