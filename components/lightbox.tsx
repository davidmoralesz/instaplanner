"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import type { ImageItem } from "@/types"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

interface LightboxProps {
  images: ImageItem[]
  initialIndex?: number
  open: boolean
  onClose: () => void
}

export function Lightbox({
  images,
  initialIndex = 0,
  open,
  onClose,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }, [currentIndex])

  useEffect(() => {
    if (open) setCurrentIndex(initialIndex)
  }, [open, initialIndex])

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }, [images.length])

  const handleZoom = useCallback((delta: number) => {
    setScale((prev) => Math.min(Math.max(0.5, prev + delta), 3))
    setPosition({ x: 0, y: 0 })
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case "ArrowLeft":
          handlePrevious()
          break
        case "ArrowRight":
          handleNext()
          break
        case "Escape":
          onClose()
          break
      }
    },
    [open, handlePrevious, handleNext, onClose]
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (scale === 1) return

      setIsDragging(true)
      const point = "touches" in e ? e.touches[0] : e
      setDragStart({
        x: point.clientX - position.x,
        y: point.clientY - position.y,
      })
    },
    [scale, position]
  )

  const handleDragMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDragging) return

      const point = "touches" in e ? e.touches[0] : e
      const maxOffset = 100 * (scale - 1)

      setPosition({
        x: Math.min(
          Math.max(point.clientX - dragStart.x, -maxOffset),
          maxOffset
        ),
        y: Math.min(
          Math.max(point.clientY - dragStart.y, -maxOffset),
          maxOffset
        ),
      })
    },
    [isDragging, dragStart, scale]
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  if (!open) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg"
    >
      {/* Controls */}
      <div className="absolute right-4 top-4 z-50 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleZoom(0.5)}
          disabled={scale >= 3}
          className="text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ZoomIn className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleZoom(-0.5)}
          disabled={scale <= 0.5}
          className="text-white/70 hover:bg-white/10 hover:text-white"
        >
          <ZoomOut className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white/70 hover:bg-white/10 hover:text-white"
        >
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
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="size-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:bg-white/10 hover:text-white"
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
            transition={{ type: "spring", duration: 0.3 }}
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
        <div className="text-sm text-white/70">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </motion.div>
  )
}
