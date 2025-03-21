"use client"

import { useToast } from "@/components/ui/use-toast"
import { useHistory } from "@/hooks/use-history"
import { useImageManagement } from "@/hooks/use-image-management"
import { useCallback, useRef, useState } from "react"
import { ContainerType } from "@/types"

/**
 * Custom hook for managing page-level interactions and image operations
 * @returns An object with the following properties:
 * @property mobileSheetOpen - Boolean state for controlling the mobile sheet
 * @property setMobileSheetOpen - Function to update mobileSheetOpen state
 * @property clearDialogOpen - Boolean state for controlling the clear dialog
 * @property setClearDialogOpen - Function to update clearDialogOpen state
 * @property instructionsOpen - Boolean state for controlling instructions visibility
 * @property setInstructionsOpen - Function to update instructionsOpen state
 * @property imageUploaderRef - Ref for the image uploader input element
 * @property previewOpen - Boolean state for controlling the preview modal
 * @property setPreviewOpen - Function to update previewOpen state
 * @property gridImages - Array of images in the grid
 * @property sidebarImages - Array of images in the sidebar
 * @property isLoading - Boolean indicating if image data is being loaded
 * @property onAddImages - Function to add images to the image collection
 * @property onMoveToGrid - Function to move an image to the grid
 * @property onMoveToSidebar - Function to move an image to the sidebar
 * @property onMoveAllToGrid - Function to move all images to the grid
 * @property onMoveAllToSidebar - Function to move all images to the sidebar
 * @property onShuffleSidebar - Function to shuffle images in the sidebar
 * @property onUpdateImageOrder - Function to update image order within a container
 * @property onSwapImages - Function to swap images between containers
 * @property handleDeleteImage - Function to delete an image from a specified container
 * @property handleClearSidebar - Function to clear all images from the sidebar
 * @property handleClearGrid - Function to clear all images from the grid
 * @property handleClearAll - Function to clear all images from both containers
 * @property handleUndo - Function to undo the last action
 * @property handleRedo - Function to redo the last undone action
 * @property handleUploadClick - Function to trigger the image uploader
 * @property canUndo - Boolean indicating if undo is possible
 * @property canRedo - Boolean indicating if redo is possible
 */

export function usePageHandlers() {
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)
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
    onAddImages,
    onDeleteImageById,
    onMoveToGrid,
    onMoveToSidebar,
    onMoveAllToGrid,
    onMoveAllToSidebar,
    onShuffleSidebar,
    onClearAll,
    onClearSidebar,
    onClearGrid,
    onUpdateImageOrder,
    onUpdateGridImages,
    onUpdateSidebarImages,
    onSwapImages,
  } = useImageManagement()

  const handleDeleteImage = useCallback(
    async (id: string, container: ContainerType) => {
      const images = container === "grid" ? gridImages : sidebarImages
      const imageToDelete = images.find((img) => img.id === id)

      if (imageToDelete) {
        pushAction({
          type: "delete",
          images: [imageToDelete],
          container,
        })
        await onDeleteImageById(id, container)
      }
    },
    [onDeleteImageById, gridImages, sidebarImages, pushAction]
  )

  const handleClearSidebar = useCallback(async () => {
    pushAction({
      type: "clear",
      images: [...sidebarImages],
      container: "sidebar",
    })
    await onClearSidebar()
  }, [onClearSidebar, sidebarImages, pushAction])

  const handleClearGrid = useCallback(async () => {
    pushAction({
      type: "clear",
      images: [...gridImages],
      container: "grid",
    })
    await onClearGrid()
  }, [onClearGrid, gridImages, pushAction])

  const handleClearAll = useCallback(async () => {
    pushAction({
      type: "clearAll",
      images: [...gridImages, ...sidebarImages],
      container: "all",
    })
    await onClearAll()
  }, [onClearAll, gridImages, sidebarImages, pushAction])

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
            onUpdateGridImages(updatedGridImages)
          } else {
            const updatedSidebarImages = [...sidebarImages]
            action.images.forEach((img) => {
              if (
                !updatedSidebarImages.some((existing) => existing.id === img.id)
              ) {
                updatedSidebarImages.push(img)
              }
            })
            onUpdateSidebarImages(updatedSidebarImages)
          }
          break
        case "clear":
          if (action.container === "grid") {
            onUpdateGridImages([...action.images])
          } else if (action.container === "sidebar") {
            onUpdateSidebarImages([...action.images])
          }
          break
        case "clearAll":
          onUpdateGridImages([
            ...action.images.filter(
              (img) =>
                gridImages.some((g) => g.id === img.id) ||
                action.container === "grid"
            ),
          ])
          onUpdateSidebarImages([
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
    onUpdateGridImages,
    onUpdateSidebarImages,
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
              await onDeleteImageById(image.id, action.container)
            }
          }
          break
        case "clear":
          if (action.container === "grid") {
            await onClearGrid()
          } else if (action.container === "sidebar") {
            await onClearSidebar()
          }
          break
        case "clearAll":
          await onClearAll()
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
  }, [redo, onDeleteImageById, onClearGrid, onClearSidebar, onClearAll, toast])

  const handleUploadClick = useCallback(() => {
    if (imageUploaderRef.current) {
      imageUploaderRef.current.click()
    }
  }, [])

  return {
    // State
    mobileSheetOpen,
    setMobileSheetOpen,
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
    onAddImages,
    onMoveToGrid,
    onMoveToSidebar,
    onMoveAllToGrid,
    onMoveAllToSidebar,
    onShuffleSidebar,
    onUpdateImageOrder,
    onSwapImages,

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
