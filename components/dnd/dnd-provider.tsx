"use client"

import { type ReactNode, useState, useEffect } from "react"
import {
  DndContext,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import { snapCenterToCursor } from "@dnd-kit/modifiers"
import { DragOverlay } from "@/components/dnd/drag-overlay"
import { useDragAndDrop } from "@/hooks/use-drag-and-drop"
import type { ImageItem, ContainerType } from "@/types"
import { DRAG_DISTANCE_CONSTRAINT } from "@/config/constants"

interface DndProviderProps {
  gridImages: ImageItem[]
  sidebarImages: ImageItem[]
  onMoveToGrid: (id: string) => Promise<void>
  onMoveToSidebar: (id: string) => Promise<void>
  onUpdateImageOrder: (
    container: ContainerType,
    oldIndex: number,
    newIndex: number,
    shouldSlide: boolean
  ) => Promise<void>
  onSwapImages: (sourceId: string, targetId: string) => Promise<void>
  shouldSlide: boolean
  children: ReactNode
}

/**
 * Component that provides drag-and-drop functionality for images within a grid or sidebar.
 * @param gridImages - Array of images in the grid
 * @param sidebarImages - Array of images in the sidebar
 * @param onMoveToGrid - Callback for moving an image to the grid
 * @param onMoveToSidebar - Callback for moving an image to the sidebar
 * @param onUpdateImageOrder - Function to update the order of images
 * @param onSwapImages - Function to swap images between grid and sidebar
 * @param shouldSlide - Whether images should slide during drag-and-drop
 * @param children - The child components to be rendered inside the DndContext
 * @returns A DndContext providing drag-and-drop functionality and a drag overlay.
 */
export function DndProvider({
  gridImages,
  sidebarImages,
  onMoveToGrid,
  onMoveToSidebar,
  onUpdateImageOrder,
  onSwapImages,
  shouldSlide,
  children,
}: DndProviderProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  const { handleDragStart, handleDragEnd, getActiveImage } = useDragAndDrop({
    gridImages,
    sidebarImages,
    onMoveToGrid,
    onMoveToSidebar,
    onUpdateImageOrder,
    onSwapImages,
    shouldSlide,
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: DRAG_DISTANCE_CONSTRAINT },
    })
  )

  if (!isReady) {
    return <>{children}</>
  }

  try {
    const activeImage = getActiveImage()
    const allImages = [...gridImages, ...sidebarImages].map((img) => img.id)

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={(args) => {
          const pointerCollisions = pointerWithin(args)
          const rectCollisions = rectIntersection(args)
          return [...pointerCollisions, ...rectCollisions]
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[snapCenterToCursor]}
      >
        <SortableContext items={allImages}>{children}</SortableContext>

        {activeImage && <DragOverlay activeImage={activeImage} />}
      </DndContext>
    )
  } catch (error) {
    console.error("Error in DndProvider:", error)
    return <>{children}</>
  }
}
