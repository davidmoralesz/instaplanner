"use client"

import type React from "react"
import type { ImageItem } from "@/types"

import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Trash, ImageUp, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ImageContextMenu } from "@/components/shared/image-context-menu"
import { SkeletonGrid } from "@/components/skeleton-grid"
import { Lightbox } from "@/components/lightbox"
import { GhostPlaceholder } from "@/components/ghost-placeholder"
import Image from "next/image"

interface ImageGridProps {
  images: ImageItem[]
  onDelete: (id: string) => void
  onMoveToSidebar?: (id: string) => void
  onMoveAllToSidebar?: () => void
  onDeleteAll?: () => void
  onUpload?: () => void
  isLoading?: boolean
  hoveredImageId?: string | null
  setHoveredImageId?: (id: string | null) => void
  setHoveredContainer?: (container: "grid" | "sidebar" | null) => void
  onImageClick?: (index: number) => void
}

interface GridItemProps {
  image: ImageItem
  onDelete: (id: string) => void
  onMoveToSidebar?: (id: string) => void
  onMoveAllToSidebar?: () => void
  onDeleteAll?: () => void
  hoveredImageId?: string | null
  setHoveredImageId?: (id: string | null) => void
  setHoveredContainer?: (container: "grid" | "sidebar" | null) => void
  onClick?: () => void
}

export function ImageGrid({
  images,
  onDelete,
  onMoveToSidebar,
  onMoveAllToSidebar,
  onDeleteAll,
  onUpload,
  isLoading = false,
  hoveredImageId,
  setHoveredImageId,
  setHoveredContainer,
  // onImageClick,
}: ImageGridProps) {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: "grid",
  })

  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setLightboxOpen(true)
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <SkeletonGrid />
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <ImageContextMenu
        moveDirection="toSidebar"
        isEmpty={true}
        onUpload={onUpload}
      >
        <div ref={setDroppableRef} className="w-full h-[85vh]">
          <div
            className={`max-w-3xl size-full mx-auto border border-white/5 rounded-md
                        transition-colors duration-150 flex items-center justify-center flex-col gap-3
                        ${isOver ? "bg-white/10" : "bg-white/5"}`}
          >
            <ImageUp className="size-5 text-white opacity-30" />
            <p className="text-white/30">Drop images here</p>
          </div>
        </div>
      </ImageContextMenu>
    )
  }

  return (
    <>
      <div ref={setDroppableRef} className="w-full">
        <div
          className={`max-w-3xl mx-auto transition-all duration-300 rounded-lg
            ${isOver ? "bg-white/10 ring-2 ring-white/20 scale-[0.99]" : "bg-white/5"}`}
        >
          <div className="grid grid-cols-3 gap-1">
            {images.map((image, index) => (
              <GridItem
                key={image.id}
                image={image}
                onDelete={onDelete}
                onMoveToSidebar={onMoveToSidebar}
                onMoveAllToSidebar={onMoveAllToSidebar}
                onDeleteAll={onDeleteAll}
                hoveredImageId={hoveredImageId}
                setHoveredImageId={setHoveredImageId}
                setHoveredContainer={setHoveredContainer}
                onClick={() => handleImageClick(index)}
              />
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        images={images}
        initialIndex={selectedImageIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}

function GridItem({
  image,
  onDelete,
  onMoveToSidebar,
  onMoveAllToSidebar,
  onDeleteAll,
  // hoveredImageId,
  setHoveredImageId,
  setHoveredContainer,
  onClick,
}: GridItemProps) {
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

  const handleMoveToSidebar = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onMoveToSidebar) onMoveToSidebar(image.id)
  }

  const handleMouseEnter = () => {
    setHoveredImageId?.(image.id)
    setHoveredContainer?.("grid")
  }

  const handleMouseLeave = () => {
    setHoveredImageId?.(null)
    setHoveredContainer?.(null)
  }

  return (
    <ImageContextMenu
      onDelete={() => onDelete(image.id)}
      onMove={() => onMoveToSidebar && onMoveToSidebar(image.id)}
      onMoveAll={() => onMoveAllToSidebar && onMoveAllToSidebar()}
      onDeleteAll={() => onDeleteAll && onDeleteAll()}
      moveDirection="toSidebar"
    >
      <motion.div
        ref={setNodeRef}
        style={style}
        className={`group relative cursor-move bg-black overflow-hidden
          ${isDragging ? "opacity-0" : "opacity-100"}`}
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
        onClick={(e) => {
          if (!isDragging && onClick) {
            e.stopPropagation()
            onClick()
          }
        }}
      >
        <GhostPlaceholder
          isVisible={isOver}
          className="z-10" // Ensure it's above the image
        />

        <div className="relative pb-[125%]">
          <Image
            src={image.data || "/placeholder.svg"}
            alt="Gallery item"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-200
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
              className="absolute top-2 right-2 scale-90 opacity-0 
                            group-hover:opacity-100 group-hover:scale-100
                            transition-all duration-200 text-white/70 hover:text-white"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(image.id)
              }}
            >
              <Trash className="size-4" />
              <span className="sr-only">Delete</span>
            </Button>
            {onMoveToSidebar && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 left-2 scale-90 opacity-0 
                                group-hover:opacity-100 group-hover:scale-100
                                transition-all duration-200 text-white/70 hover:text-white"
                onClick={handleMoveToSidebar}
              >
                <ArrowLeft className="size-4" />
                <span className="sr-only">Move to Sidebar</span>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </ImageContextMenu>
  )
}
