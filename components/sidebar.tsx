"use client"

import type { ContainerType, ImageItem } from "@/types"
import type React from "react"

import { ImageContextMenu } from "@/components/image-context-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import { AnimatePresence } from "framer-motion"
import { ChevronDown, ImageUp, MoveRight, Shuffle, Trash } from "lucide-react"
import { ImageCard } from "./grid/image-card"

interface SidebarSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: ImageItem[]
  onDelete: (id: string) => void
  onDeleteAll: () => void
  onMoveAllToGrid: () => void
  onShuffle: () => void
  onMoveToGrid?: (id: string) => void
  hoveredImageId?: string | null
  setHoveredImageId?: (id: string | null) => void
  setHoveredContainer?: (container: ContainerType | null) => void
  shouldSlide?: boolean
}

/**
 * SidebarSheet component that displays a slide-up sidebar with images.
 * It provides functionalities for shuffling, moving all images to the grid, and clearing all images.
 * @param open - A boolean that controls the open state of the sidebar sheet
 * @param onOpenChange - A function to toggle the open state of the sidebar sheet
 * @param images - An array of image objects to display in the sidebar
 * @param onDelete - Callback function to delete an image
 * @param onDeleteAll - Callback function to clear all images in the sidebar
 * @param onMoveAllToGrid - Callback function to move all images to the grid
 * @param onShuffle - Callback function to shuffle images in the sidebar
 * @param onMoveToGrid - Callback function to move an image to the grid
 * @param hoveredImageId - The ID of the currently hovered image
 * @param setHoveredImageId - Function to set the hovered image ID
 * @param setHoveredContainer - Function to set the hovered container (in this case, "sidebar")
 * @param shouldSlide - A boolean to determine if the sliding effect should be applied (defaults to false)
 * @returns A slide-up sidebar component with image management functionalities, including shuffle, move, and delete actions.
 */
export function SidebarSheet({
  open,
  onOpenChange,
  images,
  onDelete,
  onDeleteAll,
  onMoveAllToGrid,
  onShuffle,
  onMoveToGrid,
  hoveredImageId,
  setHoveredImageId,
  setHoveredContainer,
  shouldSlide = false,
}: SidebarSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-xl border-t border-foreground/10 bg-background p-0"
        closeClassName="absolute right-4 top-4 text-foreground/50 hover:text-foreground"
      >
        <div className="flex h-full flex-col">
          {/* Handle bar for dragging */}
          <div className="flex justify-center pb-2 pt-3">
            <div className="h-1 w-12 rounded-full bg-foreground/20" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium text-foreground">
                New Images
              </h2>
              <span className="text-sm text-foreground/50">
                {images.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onShuffle}
                title="Shuffle images"
                className="text-foreground/50 hover:text-foreground"
                disabled={images.length <= 1}
              >
                <Shuffle className="size-4" />
                <span className="sr-only">Shuffle</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onMoveAllToGrid}
                title="Move all to grid"
                className="text-foreground/50 hover:text-foreground"
                disabled={images.length === 0}
              >
                <MoveRight className="size-4" />
                <span className="sr-only">Move all to grid</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDeleteAll}
                className="text-foreground/50 hover:text-foreground"
              >
                <Trash className="size-4" />
                <span className="sr-only">Clear</span>
              </Button>
            </div>
          </div>

          {/* Content */}
          <SidebarContent
            images={images}
            onDelete={onDelete}
            onDeleteAll={onDeleteAll}
            onShuffle={onShuffle}
            onMoveToGrid={onMoveToGrid}
            hoveredImageId={hoveredImageId}
            setHoveredImageId={setHoveredImageId}
            setHoveredContainer={setHoveredContainer}
            shouldSlide={shouldSlide}
          />

          {/* Close button at bottom */}
          <div className="border-t border-foreground/10 p-4">
            <Button
              variant="ghost"
              className="flex w-full items-center justify-center gap-2 text-foreground/50 hover:text-foreground"
              onClick={() => onOpenChange(false)}
            >
              Close
              <ChevronDown className="size-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface SidebarContentProps {
  images: ImageItem[]
  onDelete: (id: string) => void
  onDeleteAll: () => void
  onMoveToGrid?: (id: string) => void
  onMoveAllToGrid?: () => void
  onShuffle: () => void
  onUpload?: () => void
  hoveredImageId?: string | null
  setHoveredImageId?: (id: string | null) => void
  setHoveredContainer?: (container: ContainerType | null) => void
  shouldSlide?: boolean
}

/**
 * SidebarContent component that displays images in the sidebar.
 * It handles showing a droppable area when there are no images and displays a grid of images when there are items.
 * It also manages image deletion, movement, and uploading.
 * @param images - An array of image objects to be displayed in the sidebar
 * @param onDelete - Callback function to delete an image
 * @param onMoveToGrid - Callback function to move an image to the grid
 * @param onUpload - Callback function to upload images when the sidebar is empty
 * @param hoveredImageId - The ID of the currently hovered image in the sidebar
 * @param setHoveredImageId - Function to set the hovered image ID
 * @param setHoveredContainer - Function to set the hovered container (in this case, "sidebar")
 * @param shouldSlide - Boolean to determine whether the sliding effect is enabled (defaults to false)
 * @returns A sidebar that displays images with drag-and-drop functionality, and an empty area with upload functionality when no images are present.
 */
export function SidebarContent({
  images,
  onDelete,
  onDeleteAll,
  onMoveToGrid,
  onMoveAllToGrid,
  onUpload,
  onShuffle,
  hoveredImageId,
  setHoveredImageId,
  setHoveredContainer,
  shouldSlide = false,
}: SidebarContentProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "sidebar",
  })

  return (
    <>
      {images.length === 0 ? (
        <div
          ref={setNodeRef}
          className="h-[calc(100vh-109px)] flex-1 overflow-y-auto p-3 transition-all"
        >
          <ImageContextMenu isEmpty={true} onUpload={onUpload}>
            <div
              className={`flex h-full flex-col items-center justify-center gap-3 rounded-md border border-foreground/5 ${
                isOver ? "bg-foreground/10" : "bg-foreground/5"
              }`}
            >
              <ImageUp className="size-5 text-foreground opacity-40" />
              <p className="text-foreground/40">Drop images here</p>
            </div>
          </ImageContextMenu>
        </div>
      ) : (
        <div
          ref={setNodeRef}
          className={`h-full flex-1 overflow-y-auto p-3 transition-all ${
            isOver ? "bg-foreground/10 bg-gradient-to-t from-background" : ""
          }`}
        >
          <SortableContext items={images.map((img) => img.id)}>
            <AnimatePresence>
              <div className="grid grid-cols-3 gap-[2px]">
                {images.map((image) => (
                  <ImageCard
                    key={image.id}
                    container="sidebar"
                    image={image}
                    onDelete={onDelete}
                    onDeleteAll={onDeleteAll}
                    onMoveToGrid={onMoveToGrid}
                    onMoveAllToGrid={onMoveAllToGrid}
                    onShuffle={onShuffle}
                    hoveredImageId={hoveredImageId}
                    setHoveredImageId={setHoveredImageId}
                    setHoveredContainer={setHoveredContainer}
                    shouldSlide={shouldSlide}
                  />
                ))}
              </div>
            </AnimatePresence>
          </SortableContext>
        </div>
      )}
    </>
  )
}
