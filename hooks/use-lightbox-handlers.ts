import { useCallback, useEffect, useState } from "react"
import type { ImageItem } from "@/types"

/**
 * Custom hook for handling lightbox functionality, including navigation, zoom, and drag interactions.
 * @param images - Array of images available in the lightbox
 * @param initialIndex - Index of the initially displayed image
 * @param open - Boolean indicating if the lightbox is open
 * @param onClose - Callback for closing the lightbox
 * @returns An object with the following properties:
 * @property currentIndex - The index of the currently displayed image
 * @property scale - The zoom level of the image
 * @property position - The current position of the image when dragged
 * @property isDragging - Boolean indicating if the image is being dragged
 * @property handlePrevious - Function to navigate to the previous image
 * @property handleNext - Function to navigate to the next image
 * @property handleZoom - Function to zoom in or out on the image
 * @property handleDragStart - Function to start dragging the image
 * @property handleDragMove - Function to update the image position while dragging
 * @property handleDragEnd - Function to stop dragging the image
 */
export function useLightboxHandlers(
  images: ImageItem[],
  initialIndex: number,
  open: boolean,
  onClose: () => void
) {
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

  return {
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
  }
}
