"use client"

import { useToast } from "@/components/ui/use-toast"
import { AppError, ErrorCodes } from "@/lib/errors"
import type { ImageItem } from "@/types"
import { motion } from "framer-motion"
import { ImageUp } from "lucide-react"
import type React from "react"
import { useCallback, useRef, useState } from "react"

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
          className="fixed inset-0 z-50 h-screen bg-background/90 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{
            type: "tween",
            damping: 20,
            stiffness: 300,
          }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute inset-10 z-50 flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-foreground/20 bg-foreground/5 backdrop-blur-sm"
          >
            <ImageUp className="size-10 opacity-40" strokeWidth={1} />
            <p className="font-medium text-foreground/40">Drop images here</p>
          </motion.div>
        </motion.div>
      )}
      {children}
    </div>
  )
}
