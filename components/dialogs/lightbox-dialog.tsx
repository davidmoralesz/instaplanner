"use client"

import { Button } from "@/components/ui/button"
import type { ImageItem } from "@/types"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react"
import { useLightboxHandlers } from "@/hooks/use-lightbox-handlers"
import { ANIMATION_DURATION_SEC } from "@/config/constants"

interface LightboxProps {
  images: ImageItem[]
  initialIndex?: number
  open: boolean
  onClose: () => void
}

/**
 * Component for rendering a lightbox dialog to display images with zoom, drag, and navigation controls.
 * @param images - List of images to display in the lightbox
 * @param initialIndex - The index of the image to show initially (defaults to 0)
 * @param open - Determines if the dialog is open
 * @param onClose - A callback function to close the lightbox
 * @returns A lightbox dialog component with image navigation, zoom, and drag functionality.
 */
export function LightboxDialog({
  images,
  initialIndex = 0,
  open,
  onClose,
}: LightboxProps) {
  const {
    currentIndex,
    scale,
    position,
    isDragging,
    handlePrevious,
    handleNext,
    handleZoom,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  } = useLightboxHandlers(images, initialIndex, open, onClose)

  if (!open) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm"
    >
      {/* Controls */}
      <div className="absolute right-4 top-4 z-50 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleZoom(0.5)}
          disabled={scale >= 3}
        >
          <ZoomIn className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleZoom(-0.5)}
          disabled={scale <= 0.5}
        >
          <ZoomOut className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2"
          >
            <ChevronLeft className="size-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <ChevronRight className="size-6" />
          </Button>
        </>
      )}

      {/* Image container */}
      <div className="flex size-full flex-col items-center justify-center gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "tween", duration: ANIMATION_DURATION_SEC }}
            className="relative"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            style={{
              cursor:
                scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              touchAction: "none",
            }}
          >
            <motion.img
              src={images[currentIndex].data}
              alt={`Image ${currentIndex + 1}`}
              className="max-h-[80vh] max-w-[90vw] select-none object-contain"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? "none" : "transform 0.2s ease-out",
              }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
        {/* Image counter */}
        <div className="text-sm text-foreground/70">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </motion.div>
  )
}
