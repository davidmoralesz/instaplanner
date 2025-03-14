"use client"

import type { ImageItem } from "@/types"
import type React from "react"

import { GhostPlaceholder } from "@/components/ghost-placeholder"
import { Lightbox } from "@/components/lightbox"
import { ImageContextMenu } from "@/components/image-context-menu"
import { SkeletonGrid } from "@/components/skeleton-grid"
import { Button } from "@/components/ui/button"
import { useSwapAnimation } from "@/hooks/use-swap-animation"
import { useDroppable } from "@dnd-kit/core"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { motion } from "framer-motion"
import { ArrowLeft, ImageUp, Trash } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

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
      <div className="mx-auto max-w-3xl">
        <SkeletonGrid />
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div ref={setDroppableRef} className="transition-all duration-300">
        <ImageContextMenu
          moveDirection="toSidebar"
          isEmpty={true}
          onUpload={onUpload}
        >
          <div className="h-[85vh] w-full">
            <div
              className={`mx-auto flex size-full max-w-3xl flex-col items-center
              justify-center gap-3 rounded-md border border-foreground/5 transition-colors duration-150
              ${isOver ? "bg-foreground/10" : "bg-foreground/5"}`}
            >
              <ImageUp className="size-5 text-foreground opacity-40" />
              <p className="text-foreground/40">Drop images here</p>
            </div>
          </div>
        </ImageContextMenu>
      </div>
    )
  }

  return (
    <>
      <div
        ref={setDroppableRef}
        className={`w-full ${images.length > 7 ? "h-full" : "h-[85vh]"}`}
      >
        <div
          className={`mx-auto h-full max-w-3xl p-5 transition-all duration-300 ${isOver ? "bg-foreground/10 bg-gradient-to-t from-background" : ""}`}
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

  const { getSwapAnimationStyles } = useSwapAnimation()

  const swapAnimationStyles = getSwapAnimationStyles(image.id)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 1 : swapAnimationStyles.zIndex || "auto",
    ...swapAnimationStyles,
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
        id={`image-${image.id}`}
        className={`group relative cursor-move overflow-hidden
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
        <GhostPlaceholder isVisible={isOver} className="z-10" />

        <div className="relative pb-[125%]">
          <Image
            src={image.data || ""}
            alt="Gallery item"
            className={`absolute inset-0 size-full object-cover transition-transform duration-200
              ${isOver ? "scale-95 opacity-50" : ""}`}
            draggable={false}
            fill={true}
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent 
            opacity-0 transition-opacity group-hover:opacity-100"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 text-white opacity-0
              transition-all hover:text-white/70 group-hover:opacity-100"
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
                className="absolute left-1 top-1 text-white opacity-0 
                transition-all hover:text-white/70 group-hover:opacity-100"
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
