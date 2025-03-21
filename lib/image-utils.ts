/**
 * Utilities for image processing
 */
import { AppError, ErrorCodes } from "@/lib/errors"
import {
  MAX_IMAGE_DIMENSION,
  IMAGE_COMPRESSION_QUALITY,
} from "@/config/constants"

/**
 * Compresses an image to reduce file size.
 * @param base64String - The base64 encoded image data
 * @returns A promise that resolves to the compressed image data.
 */
export async function compressImage(base64String: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(
          new AppError(
            "Could not get canvas context",
            ErrorCodes.IMAGE_UPLOAD_FAILED
          )
        )
        return
      }

      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img

      if (width > height && width > MAX_IMAGE_DIMENSION) {
        height = (height * MAX_IMAGE_DIMENSION) / width
        width = MAX_IMAGE_DIMENSION
      } else if (height > MAX_IMAGE_DIMENSION) {
        width = (width * MAX_IMAGE_DIMENSION) / height
        height = MAX_IMAGE_DIMENSION
      }

      // Set canvas dimensions and draw image
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)

      // Compress with reduced quality
      const compressedBase64 = canvas.toDataURL(
        "image/jpeg",
        IMAGE_COMPRESSION_QUALITY
      )
      resolve(compressedBase64)
    }

    img.onerror = () => {
      reject(
        new AppError("Error loading image", ErrorCodes.IMAGE_UPLOAD_FAILED)
      )
    }

    img.src = base64String
  })
}

/**
 * Reads a file as a data URL
 * @param file - The file to read
 * @returns A promise that resolves to the data URL
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const result = e.target?.result
      if (typeof result === "string") {
        resolve(result)
      } else {
        reject(
          new AppError("Failed to read file", ErrorCodes.IMAGE_UPLOAD_FAILED)
        )
      }
    }

    reader.onerror = () => {
      reject(new AppError("Error reading file", ErrorCodes.IMAGE_UPLOAD_FAILED))
    }

    reader.readAsDataURL(file)
  })
}
