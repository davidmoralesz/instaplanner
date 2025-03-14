"use client"

import type React from "react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Trash2 as Trash,
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
      <ContextMenuContent className="border-foreground/25 text-foreground/70">
        {isEmpty && onUpload && (
          <ContextMenuItem
            onClick={onUpload}
            className="flex cursor-pointer items-center gap-2 transition-all focus:bg-foreground/10 focus:text-foreground"
          >
            <Upload className="size-4" />
            <span>Upload Images</span>
          </ContextMenuItem>
        )}

        {!isEmpty && onDelete && (
          <ContextMenuItem
            onClick={onDelete}
            className="flex cursor-pointer items-center gap-2 transition-all focus:bg-foreground/10 focus:text-foreground"
          >
            <Trash className="size-4" />
            <span>Delete</span>
          </ContextMenuItem>
        )}

        {!isEmpty && onMove && (
          <ContextMenuItem
            onClick={onMove}
            className="flex cursor-pointer items-center gap-2 transition-all focus:bg-foreground/10 focus:text-foreground"
          >
            <ArrowIcon className="size-4" />
            <span>{moveText}</span>
          </ContextMenuItem>
        )}

        {!isEmpty && onMoveAll && (
          <ContextMenuItem
            onClick={onMoveAll}
            className="flex cursor-pointer items-center gap-2 transition-all focus:bg-foreground/10 focus:text-foreground"
          >
            <ArrowIcon className="size-4" />
            <span>{moveAllText}</span>
          </ContextMenuItem>
        )}

        {!isEmpty && onShuffle && (
          <ContextMenuItem
            onClick={onShuffle}
            className="flex cursor-pointer items-center gap-2 transition-all focus:bg-foreground/10 focus:text-foreground"
          >
            <Shuffle className="size-4" />
            <span>Shuffle</span>
          </ContextMenuItem>
        )}

        {!isEmpty && onDeleteAll && (
          <ContextMenuItem
            onClick={onDeleteAll}
            className="flex cursor-pointer items-center gap-2 
              text-red-700 focus:bg-foreground/10 
              focus:text-red-700 dark:text-red-400
              dark:focus:text-red-400"
          >
            <Trash className="size-4" />
            <span>Clear All</span>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
