"use client"

import { useToast } from "@/components/ui/use-toast"
import { AppError, ErrorCodes } from "@/lib/errors"
import type { ImageItem } from "@/types"
import { motion } from "framer-motion"
import { ImageUp } from "lucide-react"
import type React from "react"
import { useCallback, useRef, useState } from "react"
import { MAX_FILE_SIZE, MAX_FILES_TO_PROCESS } from "@/config/constants"
import { fadeAnimation } from "@/lib/dnd/animation"

interface DropZoneProps {
  children: React.ReactNode
  onDrop: (images: ImageItem[]) => void
}

/**
 * DropZone component that handles drag-and-drop image file uploads.
 * @param children - The content inside the drop zone
 * @param onDrop - Callback function triggered when valid images are dropped
 * @returns A div element representing the drop zone with drag and drop functionality.
 */
export function DropZone({ children, onDrop }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)
  const { toast } = useToast()

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      dragCounter.current = 0

      const files = Array.from(e.dataTransfer.files)
      const imageFiles = files.filter((file) => file.type.startsWith("image/"))

      if (imageFiles.length === 0) {
        toast({
          variant: "destructive",
          title: "Invalid files",
          description: "Please drop only image files.",
        })
        return
      }

      if (imageFiles.length > MAX_FILES_TO_PROCESS) {
        toast({
          variant: "destructive",
          title: "Too many files",
          description: `Please drop ${MAX_FILES_TO_PROCESS} or fewer images at a time.`,
        })
        return
      }

      const processImages = imageFiles.map(
        (file) =>
          new Promise<ImageItem>((resolve, reject) => {
            if (file.size > MAX_FILE_SIZE) {
              reject(
                new AppError(
                  `File ${file.name} is too large (max 10MB)`,
                  ErrorCodes.IMAGE_UPLOAD_FAILED
                )
              )
              return
            }

            const reader = new FileReader()
            reader.onload = (e) => {
              const result = e.target?.result
              if (typeof result === "string") {
                resolve({
                  id: crypto.randomUUID(),
                  data: result,
                })
              } else {
                reject(
                  new AppError(
                    "Failed to read image file",
                    ErrorCodes.IMAGE_UPLOAD_FAILED
                  )
                )
              }
            }
            reader.onerror = () => {
              reject(
                new AppError(
                  "Error reading file",
                  ErrorCodes.IMAGE_UPLOAD_FAILED
                )
              )
            }
            reader.readAsDataURL(file)
          })
      )

      Promise.all(processImages)
        .then((images) => {
          onDrop(images)
        })
        .catch((error) => {
          console.error("Error processing images:", error)
          toast({
            variant: "destructive",
            title: "Error processing images",
            description:
              error instanceof AppError
                ? error.message
                : "Failed to process image files",
          })
        })
    },
    [onDrop, toast]
  )

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="relative min-h-screen"
    >
      {isDragging && (
        <motion.div
          {...fadeAnimation}
          className="fixed inset-0 z-50 h-screen bg-background/90 backdrop-blur-sm"
        >
          <div className="absolute inset-10 z-50 flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-foreground/20 bg-foreground/5 backdrop-blur-sm">
            <ImageUp className="size-10 opacity-40" strokeWidth={1} />
            <p className="font-medium text-foreground/40">Drop images here</p>
          </div>
        </motion.div>
      )}
      {children}
    </div>
  )
}
