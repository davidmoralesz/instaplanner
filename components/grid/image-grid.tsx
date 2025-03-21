"use client"

import type { ContainerType, ImageItem } from "@/types"
import type React from "react"

import { LightboxDialog } from "@/components/dialogs/lightbox-dialog"
import { ImageContextMenu } from "@/components/image-context-menu"
import { SkeletonGrid } from "@/components/grid/skeleton-grid"
import { useDroppable } from "@dnd-kit/core"
import { ImageUp } from "lucide-react"
import { useState } from "react"
import { ImageCard } from "@/components/grid/image-card"

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
  setHoveredContainer?: (container: ContainerType | null) => void
  onImageClick?: (index: number) => void
  shouldSlide?: boolean
}

/**
 * Component for rendering an image grid with drag-and-drop support.
 * @param images - List of images to be displayed in the grid
 * @param onDelete - Callback for deleting an image
 * @param onMoveToSidebar - Callback for moving an image to the sidebar
 * @param onMoveAllToSidebar - Callback for moving all images to the sidebar
 * @param onDeleteAll - Callback for deleting all images
 * @param onUpload - Callback for handling image uploads
 * @param isLoading - Determines if the grid is in a loading state
 * @param hoveredImageId - The ID of the currently hovered image
 * @param setHoveredImageId - Function to update the hovered image ID
 * @param setHoveredContainer - Function to update the hovered container type
 * @param shouldSlide - Determines if slide mode is enabled
 * @returns An image grid component with interactive actions and a lightbox viewer.
 */
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
  shouldSlide = false,
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
          <div className="h-[calc(100vh-117px)] w-full pt-4">
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
              <ImageCard
                key={image.id}
                container="grid"
                image={image}
                onDelete={onDelete}
                onMoveToSidebar={onMoveToSidebar}
                onMoveAllToSidebar={onMoveAllToSidebar}
                onDeleteAll={onDeleteAll}
                hoveredImageId={hoveredImageId}
                setHoveredImageId={setHoveredImageId}
                setHoveredContainer={setHoveredContainer}
                onClick={() => handleImageClick(index)}
                shouldSlide={shouldSlide}
              />
            ))}
          </div>
        </div>
      </div>

      <LightboxDialog
        images={images}
        initialIndex={selectedImageIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}
