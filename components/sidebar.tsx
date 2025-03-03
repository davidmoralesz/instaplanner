"use client"

import type React from "react"
import type { ImageItem } from "@/types"

import { useDroppable } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Trash, ArrowRight, ImageUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ImageContextMenu } from "@/components/shared/image-context-menu"
import { GhostPlaceholder } from "@/components/ghost-placeholder"
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
}: SidebarProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "sidebar",
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 h-full overflow-y-auto p-3 transition-all duration-300
        ${isOver ? "bg-white/10 scale-[0.99]" : "bg-black"}`}
    >
      {images.length === 0 ? (
        <ImageContextMenu
          moveDirection="toGrid"
          isEmpty={true}
          onUpload={onUpload}
        >
          <div className="flex items-center justify-center flex-col h-full rounded-md border border-white/5 bg-white/5 gap-3">
            <ImageUp className="size-5 text-white opacity-30" />
            <p className="text-white/30">Drop images here</p>
          </div>
        </ImageContextMenu>
      ) : (
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
            />
          ))}
        </div>
      )}
    </div>
  )
}

function SidebarItem({
  image,
  onDelete,
  onMoveToGrid,
  // hoveredImageId,
  setHoveredImageId,
  setHoveredContainer,
  onMoveAllToGrid,
  onDeleteAll,
  onShuffle,
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 1 : undefined,
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
        className={`group relative bg-black overflow-hidden cursor-move transition-all
          duration-200 ${isDragging ? "opacity-0" : ""}`}
        {...attributes}
        {...listeners}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.02 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <GhostPlaceholder
          isVisible={isOver}
          className="z-10" // Ensure it's above the image
        />

        <div className="relative pb-[125%]">
          <Image
            src={image.data || "/placeholder.svg"}
            alt="Gallery item"
            className={`absolute inset-0 size-full object-cover transition-transform duration-200
              ${isOver ? "scale-95 opacity-50" : ""}`}
            draggable={false}
            fill={true}
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/60
                        to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 scale-75 opacity-0 group-hover:opacity-100
                            group-hover:scale-100 transition-all duration-200 text-white/70 hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(image.id)
              }}
            >
              <Trash className="w-3 h-3" />
              <span className="sr-only">Delete</span>
            </Button>
            {onMoveToGrid && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 left-1 scale-75 opacity-0 group-hover:opacity-100
                                group-hover:scale-100 transition-all duration-200 text-white/70 hover:text-white"
                onClick={handleMoveToGrid}
              >
                <ArrowRight className="w-3 h-3" />
                <span className="sr-only">Move to Grid</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </ImageContextMenu>
  )
}
