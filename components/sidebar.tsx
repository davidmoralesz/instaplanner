"use client"

import type { ImageItem } from "@/types"
import type React from "react"

import { GhostPlaceholder } from "@/components/ghost-placeholder"
import { ImageContextMenu } from "@/components/image-context-menu"
import { Button } from "@/components/ui/button"
import { useSwapAnimation } from "@/hooks/use-swap-animation"
import { useDroppable } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { ArrowRight, ImageUp, Trash } from "lucide-react"
import Image from "next/image"

interface SidebarProps {
  images: ImageItem[]
  onDelete: (id: string) => void
  onMoveToGrid?: (id: string) => void
  onMoveAllToGrid?: () => void
  onDeleteAll?: () => void
  onShuffle?: () => void
  onUpload?: () => void
  hoveredImageId?: string | null
  setHoveredImageId?: (id: string | null) => void
  setHoveredContainer?: (container: "grid" | "sidebar" | null) => void
  shouldSlide?: boolean
}

interface SidebarItemProps {
  image: ImageItem
  onDelete: (id: string) => void
  onMoveToGrid?: (id: string) => void
  onMoveAllToGrid?: () => void
  onDeleteAll?: () => void
  onShuffle?: () => void
  hoveredImageId?: string | null
  setHoveredImageId?: (id: string | null) => void
  setHoveredContainer?: (container: "grid" | "sidebar" | null) => void
  shouldSlide?: boolean
}

export function Sidebar({
  images,
  onDelete,
  onMoveToGrid,
  onMoveAllToGrid,
  onDeleteAll,
  onShuffle,
  onUpload,
  hoveredImageId,
  setHoveredImageId,
  setHoveredContainer,
  shouldSlide = false,
}: SidebarProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "sidebar",
  })

  return (
    <>
      {images.length === 0 ? (
        <div
          ref={setNodeRef}
          className="h-full flex-1 overflow-y-auto p-3 transition-all duration-300"
        >
          <ImageContextMenu
            moveDirection="toGrid"
            isEmpty={true}
            onUpload={onUpload}
          >
            <div
              className={`flex h-full flex-col items-center justify-center gap-3 rounded-md border border-foreground/5 ${isOver ? "bg-foreground/10" : "bg-foreground/5"}`}
            >
              <ImageUp className="size-5 text-foreground opacity-40" />
              <p className="text-foreground/40">Drop images here</p>
            </div>
          </ImageContextMenu>
        </div>
      ) : (
        <div
          ref={setNodeRef}
          className={`h-full flex-1 overflow-y-auto p-3 transition-all duration-300 ${isOver ? "bg-foreground/10 bg-gradient-to-t from-background" : ""}`}
        >
          <div className="grid grid-cols-3 gap-[2px]">
            {images.map((image) => (
              <SidebarItem
                key={image.id}
                image={image}
                onDelete={onDelete}
                onMoveToGrid={onMoveToGrid}
                onMoveAllToGrid={onMoveAllToGrid}
                onDeleteAll={onDeleteAll}
                onShuffle={onShuffle}
                hoveredImageId={hoveredImageId}
                setHoveredImageId={setHoveredImageId}
                setHoveredContainer={setHoveredContainer}
                shouldSlide={shouldSlide}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

function SidebarItem({
  image,
  onDelete,
  onMoveToGrid,
  hoveredImageId,
  setHoveredImageId,
  setHoveredContainer,
  onMoveAllToGrid,
  onDeleteAll,
  onShuffle,
  shouldSlide = false,
}: SidebarItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: image.id,
    data: image,
  })

  const { getSwapAnimationStyles } = useSwapAnimation()

  const swapAnimationStyles = getSwapAnimationStyles(image.id)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 1 : swapAnimationStyles.zIndex || "auto",
    ...swapAnimationStyles,
  }

  const handleMoveToGrid = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onMoveToGrid) onMoveToGrid(image.id)
  }

  const handleMouseEnter = () => {
    setHoveredImageId?.(image.id)
    setHoveredContainer?.("sidebar")
  }

  const handleMouseLeave = () => {
    setHoveredImageId?.(null)
    setHoveredContainer?.(null)
  }

  return (
    <ImageContextMenu
      onDelete={() => onDelete(image.id)}
      onMove={() => onMoveToGrid && onMoveToGrid(image.id)}
      onMoveAll={() => onMoveAllToGrid && onMoveAllToGrid()}
      onDeleteAll={() => onDeleteAll && onDeleteAll()}
      onShuffle={onShuffle}
      moveDirection="toGrid"
    >
      <motion.div
        ref={setNodeRef}
        style={style}
        id={`image-${image.id}`}
        className={`group relative cursor-move overflow-hidden bg-background transition-all
          duration-200 ${isDragging ? "opacity-0" : ""}`}
        {...attributes}
        {...listeners}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.02 }}
        transition={{
          type: "tween",
          damping: 20,
          stiffness: 300,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <GhostPlaceholder
          isVisible={isOver}
          className="z-10"
          isSwap={isOver && !isDragging && hoveredImageId !== image.id}
          isSlideMode={shouldSlide}
        />

        <div className="relative pb-[125%]">
          <Image
            src={image.data || ""}
            alt="Gallery item"
            className={`absolute inset-0 size-full object-cover transition-transform duration-200 ${isOver ? "scale-95 opacity-50" : ""}`}
            draggable={false}
            fill={true}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 text-white opacity-0 transition-all duration-200 hover:text-white/70 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(image.id)
              }}
            >
              <Trash className="size-3" />
              <span className="sr-only">Delete</span>
            </Button>
            {onMoveToGrid && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-1 top-1 text-white opacity-0 transition-all duration-200 hover:text-white/70 group-hover:opacity-100"
                onClick={handleMoveToGrid}
              >
                <ArrowRight className="size-3" />
                <span className="sr-only">Move to Grid</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </ImageContextMenu>
  )
}
