"use client"

import { useToast } from "@/components/ui/use-toast"
import { AppError } from "@/lib/errors"
import { compressImage } from "@/lib/image-utils"
import {
  clearAllImages,
  deleteImage,
  loadImages,
  saveImages,
  updatePositions,
} from "@/lib/storage"
import { swapArrayElements } from "@/lib/utils"
import type { ImageItem } from "@/types"
import { arrayMove } from "@dnd-kit/sortable"
import { useCallback, useEffect, useState } from "react"

const MAX_IMAGES = 100

export function useImageManagement() {
  const [gridImages, setGridImages] = useState<ImageItem[]>([])
  const [sidebarImages, setSidebarImages] = useState<ImageItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const handleError = useCallback(
    (error: unknown) => {
      console.error("Error:", error)
      const errorMessage =
        error instanceof AppError
          ? error.message
          : "An unexpected error occurred"
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    },
    [toast]
  )

  const loadImagesWithErrorHandling = useCallback(async () => {
    try {
      setIsLoading(true)
      const { gridImages, sidebarImages } = await loadImages()
      setGridImages(gridImages)
      setSidebarImages(sidebarImages)

      const totalImages = gridImages.length + sidebarImages.length
      if (totalImages > 0) {
        toast({
          title: "Images loaded",
          description: `Loaded ${totalImages} images from storage.`,
        })
      }
    } catch (error) {
      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }, [handleError, toast])

  // Load images on mount
  useEffect(() => {
    loadImagesWithErrorHandling()
  }, [loadImagesWithErrorHandling])

  const addImages = useCallback(
    async (newImages: ImageItem[]) => {
      if (sidebarImages.length + newImages.length > MAX_IMAGES) {
        toast({
          variant: "destructive",
          title: "Too many images",
          description: `Maximum ${MAX_IMAGES} images allowed.`,
        })
        return
      }

      try {
        toast({
          title: "Processing images",
          description: "Compressing and adding your images...",
        })

        const compressedImages = await Promise.all(
          newImages.map(async (img) => ({
            ...img,
            data: await compressImage(img.data),
          }))
        )

        setSidebarImages((prev) => {
          const updated = [...compressedImages, ...prev]
          saveImages(updated, "sidebar").catch(handleError)
          return updated
        })

        toast({
          title: "Images added successfully",
          description: `${newImages.length} image(s) have been added to the sidebar.`,
        })
      } catch (error) {
        handleError(error)
      }
    },
    [sidebarImages.length, toast, handleError]
  )

  const deleteImageById = useCallback(
    async (id: string, container: "grid" | "sidebar") => {
      try {
        await deleteImage(id)
        if (container === "grid") {
          setGridImages((prev) => {
            const updated = prev.filter((img) => img.id !== id)
            updatePositions(updated, "grid").catch(handleError)
            return updated
          })
        } else {
          setSidebarImages((prev) => {
            const updated = prev.filter((img) => img.id !== id)
            updatePositions(updated, "sidebar").catch(handleError)
            return updated
          })
        }
        toast({
          title: "Image deleted",
          description: `The image has been removed from the ${container}.`,
        })
      } catch (error) {
        handleError(error)
      }
    },
    [toast, handleError]
  )

  const moveImageToGrid = useCallback(
    async (id: string) => {
      try {
        const imageToMove = sidebarImages.find((img) => img.id === id)
        if (!imageToMove) return

        setSidebarImages((prev) => {
          const updated = prev.filter((img) => img.id !== id)
          saveImages(updated, "sidebar").catch(handleError)
          return updated
        })

        setGridImages((prev) => {
          const updated = [imageToMove, ...prev]
          saveImages(updated, "grid").catch(handleError)
          return updated
        })

        toast({
          title: "Image moved",
          description: "Image has been moved to grid.",
        })
      } catch (error) {
        handleError(error)
      }
    },
    [sidebarImages, toast, handleError]
  )

  const moveImageToSidebar = useCallback(
    async (id: string) => {
      try {
        const imageToMove = gridImages.find((img) => img.id === id)
        if (!imageToMove) return

        setGridImages((prev) => {
          const updated = prev.filter((img) => img.id !== id)
          saveImages(updated, "grid").catch(handleError)
          return updated
        })

        setSidebarImages((prev) => {
          const updated = [imageToMove, ...prev]
          saveImages(updated, "sidebar").catch(handleError)
          return updated
        })

        toast({
          title: "Image moved",
          description: "Image has been moved to sidebar.",
        })
      } catch (error) {
        handleError(error)
      }
    },
    [gridImages, toast, handleError]
  )

  const moveAllToGrid = useCallback(async () => {
    if (sidebarImages.length === 0) {
      toast({
        title: "No images to move",
        description: "The sidebar is empty.",
      })
      return
    }

    try {
      const count = sidebarImages.length
      setGridImages((prev) => {
        const updated = [...sidebarImages, ...prev]
        saveImages(updated, "grid").catch(handleError)
        return updated
      })
      setSidebarImages([])
      await saveImages([], "sidebar")

      toast({
        title: "Images moved",
        description: `${count} image(s) moved to grid.`,
      })
    } catch (error) {
      handleError(error)
    }
  }, [sidebarImages, toast, handleError])

  const moveAllToSidebar = useCallback(async () => {
    if (gridImages.length === 0) {
      toast({
        title: "No images to move",
        description: "The grid is empty.",
      })
      return
    }

    try {
      const count = gridImages.length
      setSidebarImages((prev) => {
        const updated = [...gridImages, ...prev]
        saveImages(updated, "sidebar").catch(handleError)
        return updated
      })
      setGridImages([])
      await saveImages([], "grid")

      toast({
        title: "Images moved",
        description: `${count} image(s) moved to sidebar.`,
      })
    } catch (error) {
      handleError(error)
    }
  }, [gridImages, toast, handleError])

  const shuffleSidebarImages = useCallback(async () => {
    if (sidebarImages.length <= 1) {
      toast({
        title: "Cannot shuffle",
        description: "Need at least two images to shuffle.",
      })
      return
    }

    try {
      // Fisher-Yates shuffle algorithm
      const shuffled = [...sidebarImages]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))

        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }

      setSidebarImages(shuffled)
      await saveImages(shuffled, "sidebar")

      toast({
        title: "Images shuffled",
        description: `${shuffled.length} sidebar images have been randomly rearranged.`,
      })
    } catch (error) {
      handleError(error)
    }
  }, [sidebarImages, toast, handleError])

  const clearAll = useCallback(async () => {
    try {
      const totalCount = gridImages.length + sidebarImages.length
      await clearAllImages()
      setGridImages([])
      setSidebarImages([])
      toast({
        title: "All images cleared",
        description: `${totalCount} images have been successfully removed.`,
      })
    } catch (error) {
      handleError(error)
    }
  }, [gridImages.length, sidebarImages.length, toast, handleError])

  const clearSidebar = useCallback(async () => {
    try {
      const count = sidebarImages.length
      await Promise.all(sidebarImages.map((img) => deleteImage(img.id)))
      setSidebarImages([])
      await saveImages([], "sidebar")
      toast({
        title: "Sidebar cleared",
        description: `${count} images in the sidebar have been removed.`,
      })
    } catch (error) {
      handleError(error)
    }
  }, [sidebarImages, toast, handleError])

  const clearGrid = useCallback(async () => {
    try {
      const count = gridImages.length
      await Promise.all(gridImages.map((img) => deleteImage(img.id)))
      setGridImages([])
      await saveImages([], "grid")
      toast({
        title: "Grid cleared",
        description: `${count} images in the grid have been removed.`,
      })
    } catch (error) {
      handleError(error)
    }
  }, [gridImages, toast, handleError])

  const updateImageOrder = useCallback(
    async (
      container: "grid" | "sidebar",
      oldIndex: number,
      newIndex: number,
      shouldSlide: boolean = false
    ) => {
      try {
        if (container === "grid") {
          setGridImages((prev) => {
            const updated = shouldSlide
              ? arrayMove(prev, oldIndex, newIndex)
              : swapArrayElements(prev, oldIndex, newIndex)

            saveImages(updated, "grid").catch(handleError)
            return updated
          })
        } else {
          setSidebarImages((prev) => {
            const updated = shouldSlide
              ? arrayMove(prev, oldIndex, newIndex)
              : swapArrayElements(prev, oldIndex, newIndex)

            saveImages(updated, "sidebar").catch(handleError)
            return updated
          })
        }
      } catch (error) {
        handleError(error)
      }
    },
    [handleError]
  )

  const swapImages = useCallback(
    async (sourceId: string, targetId: string) => {
      try {
        // Find the source and target images
        const sourceInGrid = gridImages.find((img) => img.id === sourceId)
        const sourceInSidebar = sidebarImages.find((img) => img.id === sourceId)
        const targetInGrid = gridImages.find((img) => img.id === targetId)
        const targetInSidebar = sidebarImages.find((img) => img.id === targetId)

        // Determine the source and target containers
        const sourceContainer = sourceInGrid ? "grid" : "sidebar"
        const targetContainer = targetInGrid ? "grid" : "sidebar"

        // If source and target are in the same container, use updateImageOrder
        if (sourceContainer === targetContainer) {
          const images = sourceContainer === "grid" ? gridImages : sidebarImages
          const sourceIndex = images.findIndex((img) => img.id === sourceId)
          const targetIndex = images.findIndex((img) => img.id === targetId)

          if (sourceIndex !== -1 && targetIndex !== -1) {
            await updateImageOrder(
              sourceContainer,
              sourceIndex,
              targetIndex,
              false
            )
          }
          return
        }

        // If source and target are in different containers, swap them
        if (sourceInGrid && targetInSidebar) {
          // Source is in grid, target is in sidebar
          setGridImages((prev) => {
            const updated = prev.map((img) =>
              img.id === sourceId ? { ...targetInSidebar } : img
            )
            saveImages(updated, "grid").catch(handleError)
            return updated
          })

          setSidebarImages((prev) => {
            const updated = prev.map((img) =>
              img.id === targetId ? { ...sourceInGrid } : img
            )
            saveImages(updated, "sidebar").catch(handleError)
            return updated
          })

          toast({
            title: "Images swapped",
            description: "Images have been swapped between grid and sidebar.",
          })
        } else if (sourceInSidebar && targetInGrid) {
          // Source is in sidebar, target is in grid
          setGridImages((prev) => {
            const updated = prev.map((img) =>
              img.id === targetId ? { ...sourceInSidebar } : img
            )
            saveImages(updated, "grid").catch(handleError)
            return updated
          })

          setSidebarImages((prev) => {
            const updated = prev.map((img) =>
              img.id === sourceId ? { ...targetInGrid } : img
            )
            saveImages(updated, "sidebar").catch(handleError)
            return updated
          })

          toast({
            title: "Images swapped",
            description: "Images have been swapped between sidebar and grid.",
          })
        }
      } catch (error) {
        handleError(error)
      }
    },
    [gridImages, sidebarImages, updateImageOrder, toast, handleError]
  )

  const updateGridImages = useCallback(
    (images: ImageItem[]) => {
      setGridImages(images)
      saveImages(images, "grid").catch(handleError)
    },
    [handleError]
  )

  const updateSidebarImages = useCallback(
    (images: ImageItem[]) => {
      setSidebarImages(images)
      saveImages(images, "sidebar").catch(handleError)
    },
    [handleError]
  )

  return {
    gridImages,
    sidebarImages,
    isLoading,
    loadImagesWithErrorHandling,
    addImages,
    deleteImageById,
    moveImageToGrid,
    moveImageToSidebar,
    moveAllToGrid,
    moveAllToSidebar,
    shuffleSidebarImages,
    clearAll,
    clearSidebar,
    clearGrid,
    updateImageOrder,
    updateGridImages,
    updateSidebarImages,
    swapImages,
  }
}
