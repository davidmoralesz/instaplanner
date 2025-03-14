"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type { ImageItem } from "@/types"
import { Upload } from "lucide-react"
import type React from "react"
import { forwardRef, useCallback, useState } from "react"

interface ImageUploaderProps {
  onUpload: (images: ImageItem[]) => void
}

export const ImageUploader = forwardRef<HTMLInputElement, ImageUploaderProps>(
  function ImageUploader({ onUpload }, ref) {
    const { toast } = useToast()
    const [isProcessing, setIsProcessing] = useState(false)

    const handleFiles = useCallback(
      async (files: FileList) => {
        if (isProcessing) return

        setIsProcessing(true)
        const imageFiles = Array.from(files).filter((file) =>
          file.type.startsWith("image/")
        )

        if (imageFiles.length === 0) {
          toast({
            variant: "destructive",
            title: "Invalid file type",
            description: "Please upload only image files.",
          })
          setIsProcessing(false)
          return
        }

        const processedImages: ImageItem[] = []

        try {
          for (const file of imageFiles) {
            const result = await readFileAsDataURL(file)
            processedImages.push({
              id: crypto.randomUUID(),
              data: result,
            })
          }

          onUpload(processedImages)
        } catch (error) {
          console.error("Error processing images:", error)
          toast({
            variant: "destructive",
            title: "Error processing images",
            description: "Failed to process one or more images.",
          })
        } finally {
          setIsProcessing(false)
          const inputElement = ref as React.RefObject<HTMLInputElement>
          if (inputElement && inputElement.current) {
            inputElement.current.value = ""
          }
        }
      },
      [onUpload, toast, isProcessing, ref]
    )

    const readFileAsDataURL = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result
          if (typeof result === "string") {
            resolve(result)
          } else {
            reject(new Error("Failed to read file"))
          }
        }
        reader.onerror = () => reject(new Error("Error reading file"))
        reader.readAsDataURL(file)
      })
    }

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        handleFiles(e.dataTransfer.files)
      },
      [handleFiles]
    )

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
          handleFiles(e.target.files)
        }
      },
      [handleFiles]
    )

    const handleClick = () => {
      const inputElement = ref as React.RefObject<HTMLInputElement>
      if (!isProcessing && inputElement && inputElement.current) {
        inputElement.current.click()
      }
    }

    return (
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative"
      >
        <input
          ref={ref}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="sr-only"
          title="Upload images"
          disabled={isProcessing}
        />
        <Button
          onClick={handleClick}
          variant="ghost"
          size="icon"
          disabled={isProcessing}
        >
          <Upload className={`size-4 ${isProcessing ? "animate-pulse" : ""}`} />
          <span className="sr-only">Upload Images</span>
        </Button>
      </div>
    )
  }
)
