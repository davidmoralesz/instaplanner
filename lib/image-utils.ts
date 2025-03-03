import { AppError, ErrorCodes } from "@/lib/errors"

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
      let width = img.width
      let height = img.height
      const maxDimension = 1200

      if (width > height && width > maxDimension) {
        height = (height * maxDimension) / width
        width = maxDimension
      } else if (height > maxDimension) {
        width = (width * maxDimension) / height
        height = maxDimension
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress image
      ctx.drawImage(img, 0, 0, width, height)

      // Compress with reduced quality
      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7)
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
