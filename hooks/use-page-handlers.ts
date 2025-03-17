"use client"

import { useToast } from "@/components/ui/use-toast"
import { useHistory } from "@/hooks/use-history"
import { useImageManagement } from "@/hooks/use-image-management"
import { useCallback, useRef, useState } from "react"

export function usePageHandlers() {
  const [mobileGalleryOpen, setMobileGalleryOpen] = useState(false)
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const [instructionsOpen, setInstructionsOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const imageUploaderRef = useRef<HTMLInputElement>(null)

  const { toast } = useToast()
  const { pushAction, undo, redo, canUndo, canRedo } = useHistory()

  const {
    gridImages,
    sidebarImages,
    isLoading,
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
  } = useImageManagement()

  const handleDeleteImage = useCallback(
    async (id: string, container: "grid" | "sidebar") => {
      const images = container === "grid" ? gridImages : sidebarImages
      const imageToDelete = images.find((img) => img.id === id)

      if (imageToDelete) {
        pushAction({
          type: "delete",
          images: [imageToDelete],
          container,
        })
        await deleteImageById(id, container)
      }
    },
    [deleteImageById, gridImages, sidebarImages, pushAction]
  )

  const handleClearSidebar = useCallback(async () => {
    pushAction({
      type: "clear",
      images: [...sidebarImages],
      container: "sidebar",
    })
    await clearSidebar()
  }, [clearSidebar, sidebarImages, pushAction])

  const handleClearGrid = useCallback(async () => {
    pushAction({
      type: "clear",
      images: [...gridImages],
      container: "grid",
    })
    await clearGrid()
  }, [clearGrid, gridImages, pushAction])

  const handleClearAll = useCallback(async () => {
    pushAction({
      type: "clearAll",
      images: [...gridImages, ...sidebarImages],
      container: "all",
    })
    await clearAll()
  }, [clearAll, gridImages, sidebarImages, pushAction])

  const handleUndo = useCallback(async () => {
    const result = undo()
    if (!result) return

    const { action } = result

    try {
      switch (action.type) {
        case "delete":
          if (action.container === "grid") {
            const updatedGridImages = [...gridImages]
            action.images.forEach((img) => {
              if (
                !updatedGridImages.some((existing) => existing.id === img.id)
              ) {
                updatedGridImages.push(img)
              }
            })
            updateGridImages(updatedGridImages)
          } else {
            const updatedSidebarImages = [...sidebarImages]
            action.images.forEach((img) => {
              if (
                !updatedSidebarImages.some((existing) => existing.id === img.id)
              ) {
                updatedSidebarImages.push(img)
              }
            })
            updateSidebarImages(updatedSidebarImages)
          }
          break
        case "clear":
          if (action.container === "grid") {
            updateGridImages([...action.images])
          } else if (action.container === "sidebar") {
            updateSidebarImages([...action.images])
          }
          break
        case "clearAll":
          updateGridImages([
            ...action.images.filter(
              (img) =>
                gridImages.some((g) => g.id === img.id) ||
                action.container === "grid"
            ),
          ])
          updateSidebarImages([
            ...action.images.filter(
              (img) =>
                sidebarImages.some((s) => s.id === img.id) ||
                action.container === "sidebar"
            ),
          ])
          break
      }
    } catch (error) {
      console.error("Error during undo:", error)
      toast({
        variant: "destructive",
        title: "Undo failed",
        description: "Failed to undo the last action.",
      })
    }
  }, [
    undo,
    toast,
    gridImages,
    sidebarImages,
    updateGridImages,
    updateSidebarImages,
  ])

  const handleRedo = useCallback(async () => {
    const result = redo()
    if (!result) return

    const { action } = result

    try {
      switch (action.type) {
        case "delete":
          for (const image of action.images) {
            if (action.container === "grid" || action.container === "sidebar") {
              await deleteImageById(image.id, action.container)
            }
          }
          break
        case "clear":
          if (action.container === "grid") {
            await clearGrid()
          } else if (action.container === "sidebar") {
            await clearSidebar()
          }
          break
        case "clearAll":
          await clearAll()
          break
      }
    } catch (error) {
      console.error("Error during redo:", error)
      toast({
        variant: "destructive",
        title: "Redo failed",
        description: "Failed to redo the action.",
      })
    }
  }, [redo, deleteImageById, clearGrid, clearSidebar, clearAll, toast])

  const handleUploadClick = useCallback(() => {
    if (imageUploaderRef.current) {
      imageUploaderRef.current.click()
    }
  }, [])

  return {
    // State
    mobileGalleryOpen,
    setMobileGalleryOpen,
    clearDialogOpen,
    setClearDialogOpen,
    instructionsOpen,
    setInstructionsOpen,
    imageUploaderRef,
    previewOpen,
    setPreviewOpen,

    // Image management
    gridImages,
    sidebarImages,
    isLoading,
    addImages,
    moveImageToGrid,
    moveImageToSidebar,
    moveAllToGrid,
    moveAllToSidebar,
    shuffleSidebarImages,
    updateImageOrder,
    swapImages,

    // Handlers
    handleDeleteImage,
    handleClearSidebar,
    handleClearGrid,
    handleClearAll,
    handleUndo,
    handleRedo,
    handleUploadClick,

    // History
    canUndo,
    canRedo,
  }
}
