"use client"

import type { ContainerType, ImageItem } from "@/types"
import type React from "react"

import { GhostPlaceholder } from "@/components/ghost-placeholder"
import { ImageContextMenu } from "@/components/image-context-menu"
import { Button } from "@/components/ui/button"
import { useSortable } from "@dnd-kit/sortable"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Trash } from "lucide-react"
import Image from "next/image"
import { tweenTransition } from "@/lib/dnd/animation"

interface ImageCardProps {
  container: ContainerType
  image: ImageItem
  onDelete: (id: string) => void
  onMoveToGrid?: (id: string) => void
  onMoveToSidebar?: (id: string) => void
  onMoveAllToSidebar?: () => void
  onDeleteAll?: () => void
  hoveredImageId?: string | null
  setHoveredImageId?: (id: string | null) => void
  setHoveredContainer?: (container: ContainerType | null) => void
  onClick?: () => void
  shouldSlide?: boolean
}

/**
 * Component for rendering an image grid item with drag-and-drop functionality
 * @param container - The container, either "grid" or "sidebar"
 * @param image - The image data to be displayed
 * @param onDelete - Callback for deleting the image
 * @param onMoveToGrid - Callback function to move the image to a grid
 * @param onMoveToSidebar - Callback for moving the image to the sidebar
 * @param onMoveAllToSidebar - Callback for moving all images to the sidebar
 * @param onDeleteAll - Callback for deleting all images
 * @param hoveredImageId - The ID of the currently hovered image
 * @param setHoveredImageId - Function to set the hovered image ID
 * @param setHoveredContainer - Function to set the hovered container type
 * @param onClick - Callback for handling image clicks
 * @param shouldSlide - Determines if slide mode is enabled
 * @returns A draggable image grid item with contextual actions
 */
export function ImageCard({
  container,
  image,
  onDelete,
  onMoveToGrid,
  onMoveToSidebar,
  onMoveAllToSidebar,
  onDeleteAll,
  hoveredImageId,
  setHoveredImageId,
  setHoveredContainer,
  onClick,
  shouldSlide = false,
}: ImageCardProps) {
  const { attributes, listeners, setNodeRef, isDragging, isOver } = useSortable(
    {
      id: image.id,
      data: image,
    }
  )

  const isGrid = container === "grid"
  const isSidebar = container === "sidebar"

  const handleMoveToGrid = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onMoveToGrid) onMoveToGrid(image.id)
  }

  const handleMoveToSidebar = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onMoveToSidebar) onMoveToSidebar(image.id)
  }

  const handleMouseEnter = () => {
    setHoveredImageId?.(image.id)
    setHoveredContainer?.(container)
  }

  const handleMouseLeave = () => {
    setHoveredImageId?.(null)
    setHoveredContainer?.(null)
  }

  const renderImageCardContent = () => {
    const commonProps = {
      ref: setNodeRef,
      id: `image-${image.id}`,
      className: `group relative cursor-move overflow-hidden ${isDragging ? "opacity-30" : "opacity-100"}`,
      ...attributes,
      ...listeners,
      transition: { ...tweenTransition },
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    }

    const renderImage = () => (
      <div className="relative pb-[125%]">
        <Image
          src={image.data || ""}
          alt={`${container} gallery item`}
          className={`absolute inset-0 duration-200 ${isOver ? "scale-95 opacity-50" : ""}`}
          draggable={false}
          fill
        />
        <div
          className={`absolute inset-0 bg-gradient-to-b from-black/60 to-transparent 
          opacity-0 transition-opacity ${!isOver && "group-hover:opacity-100"}`}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 text-white opacity-0 transition-all hover:text-white/70 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(image.id)
            }}
          >
            <Trash className="size-4" />
            <span className="sr-only">Delete</span>
          </Button>
          {isGrid && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 top-1 text-white opacity-0 transition-all hover:text-white/70 group-hover:opacity-100"
              onClick={handleMoveToSidebar}
            >
              <ArrowLeft className="size-4" />
              <span className="sr-only">Move to Sidebar</span>
            </Button>
          )}
          {isSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-1 top-1 text-white opacity-0 transition-all hover:text-white/70 group-hover:opacity-100"
              onClick={handleMoveToGrid}
            >
              <ArrowRight className="size-3" />
              <span className="sr-only">Move to Grid</span>
            </Button>
          )}
        </div>
      </div>
    )

    return (
      <ImageContextMenu
        onDelete={() => onDelete(image.id)}
        onMove={() =>
          isGrid
            ? onMoveToSidebar && onMoveToSidebar(image.id)
            : onMoveToGrid && onMoveToGrid(image.id)
        }
        onMoveAll={isGrid ? onMoveAllToSidebar : undefined}
        moveDirection={isGrid ? "toSidebar" : "toGrid"}
        onDeleteAll={onDeleteAll}
      >
        <motion.div
          {...commonProps}
          onClick={(e) => {
            if (!isDragging && onClick) {
              e.stopPropagation()
              onClick()
            }
          }}
        >
          <GhostPlaceholder
            isVisible={isOver}
            className="z-10"
            isSwap={isOver && !isDragging && hoveredImageId !== image.id}
            isSlideMode={shouldSlide}
          />
          {renderImage()}
        </motion.div>
      </ImageContextMenu>
    )
  }

  return <>{renderImageCardContent()}</>
}
