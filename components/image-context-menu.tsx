"use client"

import type React from "react"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import { ArrowLeft, ArrowRight, Shuffle, Trash, Upload } from "lucide-react"
import type { ContainerType } from "@/types"

interface ImageContextMenuProps {
  children: React.ReactNode
  container?: ContainerType
  onMove?: () => void
  onMoveAll?: () => void
  onShuffle?: () => void
  onUpload?: () => void
  onDelete?: () => void
  onDeleteAll?: () => void
  isEmpty?: boolean
}

/**
 * Context menu for image items with options to move, delete, etc.
 * @param children - The content to wrap with the context menu
 * @param container - The container type ("grid" or "sidebar") that determines available options
 * @param onMove - Callback for moving the image between containers
 * @param onMoveAll - Callback for moving all images between containers
 * @param onShuffle - Callback for shuffling images (sidebar only)
 * @param onUpload - Callback to upload new images if the container is empty
 * @param onDelete - Callback for deleting the image
 * @param onDeleteAll - Callback for deleting all images
 * @param isEmpty - Determine if the container is empty (defaults to false)
 * @returns A context menu with options based on the container type
 */
export function ImageContextMenu({
  children,
  container,
  onMove,
  onMoveAll,
  onShuffle,
  onUpload,
  onDelete,
  onDeleteAll,
  isEmpty = false,
}: ImageContextMenuProps) {
  const isGrid = container === "grid"
  const isSidebar = container === "sidebar"
  const ArrowIcon = isGrid ? ArrowLeft : ArrowRight
  const moveText = isGrid ? "Move to Sidebar" : "Move to Grid"
  const moveAllText = isGrid ? "Move All to Sidebar" : "Move All to Grid"

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        {isEmpty && (
          <ContextMenuItem onClick={onUpload}>
            <Upload className="mr-2 size-4" />
            <span>Upload Images</span>
          </ContextMenuItem>
        )}

        {!isEmpty && (
          <>
            <ContextMenuItem onClick={onMove}>
              <ArrowIcon className="mr-2 size-4" />
              {moveText}
            </ContextMenuItem>
            {onMoveAll && (
              <ContextMenuItem onClick={onMoveAll}>
                <ArrowIcon className="mr-2 size-4" />
                {moveAllText}
              </ContextMenuItem>
            )}

            <ContextMenuSeparator />
            <ContextMenuItem onClick={onDelete}>
              <Trash className="mr-2 size-4" />
              Delete
            </ContextMenuItem>
            {onDeleteAll && (
              <ContextMenuItem onClick={onDeleteAll}>
                <Trash className="mr-2 size-4" />
                Delete All
              </ContextMenuItem>
            )}

            {isSidebar && (
              <>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={onShuffle}>
                  <Shuffle className="mr-2 size-4" />
                  Shuffle
                </ContextMenuItem>
              </>
            )}
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
