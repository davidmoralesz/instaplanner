"use client"

import type React from "react"
import type { ImageItem } from "@/types"
import { useState, useCallback, useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { AppError, ErrorCodes } from "@/lib/errors"
import { motion } from "framer-motion"

interface DropZoneProps {
  children: React.ReactNode
  onDrop: (images: ImageItem[]) => void
}

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

      // Limit the number of files to process at once to prevent browser freezing
      const MAX_FILES_TO_PROCESS = 20
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
            // Check file size
            const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
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
          className="absolute inset-0 z-50 flex items-center justify-center border-2 border-dashed border-white/20 bg-black/90 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 300,
          }}
        >
          <motion.div
            className="rounded-lg bg-white/10 px-6 py-4 text-xl font-medium text-white/80 backdrop-blur-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Drop images here
          </motion.div>
        </motion.div>
      )}
      {children}
    </div>
  )
}
