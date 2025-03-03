"use client"

import { useEffect } from "react"
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import { motion, AnimatePresence } from "framer-motion"
import { ImageUploader } from "@/components/image-uploader"
import { ImageGrid } from "@/components/image-grid"
import { Sidebar } from "@/components/sidebar"
import { MobileGallery } from "@/components/mobile-gallery"
import { Button } from "@/components/ui/button"
import { Trash, Menu, ArrowRight, ArrowLeft, Shuffle } from "lucide-react"
import { DropZone } from "@/components/drop-zone"
import { ClearDialog } from "@/components/clear-dialog"
import { InstructionsDialog } from "@/components/instructions-dialog"
import { GlobalContextMenu } from "@/components/global-context-menu"
import { useDragAndDrop } from "@/hooks/use-drag-and-drop"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"
import { usePageHandlers } from "@/hooks/use-page-handlers"
import Image from "next/image"

export default function GalleryPage() {
  const {
    // State
    mobileGalleryOpen,
    setMobileGalleryOpen,
    clearDialogOpen,
    setClearDialogOpen,
    instructionsOpen,
    setInstructionsOpen,
    imageUploaderRef,

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
  } = usePageHandlers()

  const { hoveredImageId, setHoveredImageId, setHoveredContainer } =
    useKeyboardNavigation({
      onMoveToGrid: moveImageToGrid,
      onMoveToSidebar: moveImageToSidebar,
      onMoveAllToGrid: moveAllToGrid,
      onMoveAllToSidebar: moveAllToSidebar,
      onDelete: handleDeleteImage,
      onUndo: handleUndo,
      onRedo: handleRedo,
      canUndo,
      canRedo,
    })

  const { handleDragStart, handleDragEnd, getActiveImage } = useDragAndDrop({
    gridImages,
    sidebarImages,
    moveImageToGrid,
    moveImageToSidebar,
    updateImageOrder,
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    })
  )

  // Expose functions to window for global access
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.setHoveredImageId = (id: string | null) => setHoveredImageId(id)
      window.setHoveredContainer = (container: "grid" | "sidebar" | null) =>
        setHoveredContainer(container)
    }

    return () => {
      if (typeof window !== "undefined") {
        delete window.setHoveredImageId
        delete window.setHoveredContainer
      }
    }
  }, [setHoveredImageId, setHoveredContainer])

  const activeImage = getActiveImage()

  const dragOverlayAnimation = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.2 },
  }

  return (
    <div className="min-h-screen bg-black">
      <DropZone onDrop={addImages}>
        <DndContext
          sensors={sensors}
          collisionDetection={(args) => {
            const pointerCollisions = pointerWithin(args)
            const rectCollisions = rectIntersection(args)
            return [...pointerCollisions, ...rectCollisions]
          }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
            {/* Desktop Sidebar - Hidden on mobile */}
            <div className="hidden md:flex fixed top-0 left-0 w-80 h-screen border-r border-white/10 overflow-hidden flex-col bg-black z-10">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-lg font-medium">InstaPlanner</h1>
                  <div className="h-4 w-px bg-white/10" />
                  <ImageUploader onUpload={addImages} ref={imageUploaderRef} />
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={shuffleSidebarImages}
                    title="Shuffle sidebar images"
                    className="text-white/70 hover:text-white"
                    disabled={sidebarImages.length <= 1}
                  >
                    <Shuffle className="size-4" />
                    <span className="sr-only">Shuffle</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={moveAllToGrid}
                    title="Move all to grid"
                    className="text-white/70 hover:text-white"
                    disabled={sidebarImages.length === 0}
                  >
                    <ArrowRight className="size-5" />
                    <span className="sr-only">Move all to grid</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setClearDialogOpen(true)}
                    className="text-white/70 hover:text-white"
                  >
                    <Trash className="size-4" />
                    <span className="sr-only">Clear</span>
                  </Button>
                </div>
              </div>

              <div className="h-[calc(100vh-64px)] overflow-y-auto">
                <SortableContext items={sidebarImages.map((img) => img.id)}>
                  <AnimatePresence>
                    <Sidebar
                      images={sidebarImages}
                      onDelete={(id) => handleDeleteImage(id, "sidebar")}
                      onMoveToGrid={moveImageToGrid}
                      onMoveAllToGrid={moveAllToGrid}
                      onDeleteAll={() => setClearDialogOpen(true)}
                      onShuffle={shuffleSidebarImages}
                      onUpload={handleUploadClick}
                      hoveredImageId={hoveredImageId}
                      setHoveredImageId={setHoveredImageId}
                      setHoveredContainer={setHoveredContainer}
                    />
                  </AnimatePresence>
                </SortableContext>
              </div>
            </div>

            {/* Mobile Header - Visible only on mobile */}
            <div className="md:hidden sticky top-0 z-20 bg-black/80 backdrop-blur-sm border-b border-white/10">
              <div className="px-4 h-16 flex items-center justify-between">
                <h1 className="text-lg font-medium">InstaPlanner</h1>
                <div className="flex items-center gap-2">
                  <ImageUploader onUpload={addImages} ref={imageUploaderRef} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setClearDialogOpen(true)}
                    className="text-white/70 hover:text-white"
                  >
                    <Trash className="size-4" />
                    <span className="sr-only">Clear</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileGalleryOpen(true)}
                    className="text-white/70 hover:text-white"
                  >
                    <Menu className="size-4" />
                    <span className="sr-only">Open Gallery</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <GlobalContextMenu
              onShowInstructions={() => setInstructionsOpen(true)}
            >
              <div className="flex-1 overflow-auto md:ml-80">
                <div className="w-full p-4 md:p-6">
                  <div className="max-w-3xl mx-auto flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium mr-2">Grid</h2>
                    <InstructionsDialog
                      className="mr-auto"
                      open={instructionsOpen}
                      onOpenChange={setInstructionsOpen}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={moveAllToSidebar}
                      className="text-white/70 hover:text-white flex items-center gap-1"
                      disabled={gridImages.length === 0}
                    >
                      <ArrowLeft className="size-5" />
                      <span className="text-sm">Move all to sidebar</span>
                    </Button>
                  </div>

                  <SortableContext items={gridImages.map((img) => img.id)}>
                    <AnimatePresence>
                      <ImageGrid
                        images={gridImages}
                        onDelete={(id) => handleDeleteImage(id, "grid")}
                        onMoveToSidebar={moveImageToSidebar}
                        onMoveAllToSidebar={moveAllToSidebar}
                        onDeleteAll={() => setClearDialogOpen(true)}
                        onUpload={handleUploadClick}
                        isLoading={isLoading}
                        hoveredImageId={hoveredImageId}
                        setHoveredImageId={setHoveredImageId}
                        setHoveredContainer={setHoveredContainer}
                      />
                    </AnimatePresence>
                  </SortableContext>
                </div>
              </div>
            </GlobalContextMenu>
            <MobileGallery
              open={mobileGalleryOpen}
              onOpenChange={setMobileGalleryOpen}
              images={sidebarImages}
              onDelete={(id) => handleDeleteImage(id, "sidebar")}
              onClearAll={() => setClearDialogOpen(true)}
              onMoveAllToGrid={moveAllToGrid}
              onShuffleSidebar={shuffleSidebarImages}
              onMoveToGrid={moveImageToGrid}
            />

            <ClearDialog
              open={clearDialogOpen}
              onOpenChange={setClearDialogOpen}
              onClearSidebar={handleClearSidebar}
              onClearGrid={handleClearGrid}
              onClearAll={handleClearAll}
              sidebarCount={sidebarImages.length}
              gridCount={gridImages.length}
            />

            <DragOverlay dropAnimation={null}>
              {activeImage ? (
                <motion.div
                  {...dragOverlayAnimation}
                  className="w-full aspect-[4/5] overflow-hidden relative"
                  style={{
                    transformOrigin: "0 0",
                    filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))",
                    pointerEvents: "none",
                  }}
                >
                  <Image
                    src={activeImage.data || ""}
                    alt="Dragging"
                    className="w-full h-full object-cover"
                    fill={true}
                    priority
                  />
                  <div className="absolute inset-0 ring-2 ring-white/20" />
                </motion.div>
              ) : null}
            </DragOverlay>
          </div>
        </DndContext>
      </DropZone>
    </div>
  )
}
