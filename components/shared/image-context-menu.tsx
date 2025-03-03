"use client"

import type React from "react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Trash2 as Trash,
  ArrowRight,
  ArrowLeft,
  Shuffle,
  Upload,
} from "lucide-react"

interface ImageContextMenuProps {
  children: React.ReactNode
  onDelete?: () => void
  onMove?: () => void
  onMoveAll?: () => void
  onDeleteAll?: () => void
  onShuffle?: () => void
  onUpload?: () => void
  moveDirection: "toGrid" | "toSidebar"
  isEmpty?: boolean
}

export function ImageContextMenu({
  children,
  onDelete,
  onMove,
  onMoveAll,
  onDeleteAll,
  onShuffle,
  onUpload,
  moveDirection,
  isEmpty = false,
}: ImageContextMenuProps) {
  const ArrowIcon = moveDirection === "toGrid" ? ArrowRight : ArrowLeft
  const moveText =
    moveDirection === "toGrid" ? "Move to Grid" : "Move to Sidebar"
  const moveAllText =
    moveDirection === "toGrid" ? "Move All to Grid" : "Move All to Sidebar"

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="bg-black border-white/25 text-white/70">
        {isEmpty && onUpload && (
          <ContextMenuItem
            onClick={onUpload}
            className="flex items-center gap-2 cursor-pointer focus:bg-white/10 focus:text-white transition-all"
          >
            <Upload className="size-4" />
            <span>Upload Images</span>
          </ContextMenuItem>
        )}

        {!isEmpty && onDelete && (
          <ContextMenuItem
            onClick={onDelete}
            className="flex items-center gap-2 cursor-pointer focus:bg-white/10 focus:text-white transition-all"
          >
            <Trash className="size-4" />
            <span>Delete</span>
          </ContextMenuItem>
        )}

        {!isEmpty && onMove && (
          <ContextMenuItem
            onClick={onMove}
            className="flex items-center gap-2 cursor-pointer focus:bg-white/10 focus:text-white transition-all"
          >
            <ArrowIcon className="size-4" />
            <span>{moveText}</span>
          </ContextMenuItem>
        )}

        {!isEmpty && onMoveAll && (
          <ContextMenuItem
            onClick={onMoveAll}
            className="flex items-center gap-2 cursor-pointer focus:bg-white/10 focus:text-white transition-all"
          >
            <ArrowIcon className="size-4" />
            <span>{moveAllText}</span>
          </ContextMenuItem>
        )}

        {!isEmpty && onShuffle && (
          <ContextMenuItem
            onClick={onShuffle}
            className="flex items-center gap-2 cursor-pointer focus:bg-white/10 focus:text-white transition-all"
          >
            <Shuffle className="size-4" />
            <span>Shuffle</span>
          </ContextMenuItem>
        )}

        {!isEmpty && onDeleteAll && (
          <ContextMenuItem
            onClick={onDeleteAll}
            className="flex items-center gap-2 cursor-pointer focus:bg-white/10 text-red-400 focus:text-red-600"
          >
            <Trash className="size-4" />
            <span>Clear All</span>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
