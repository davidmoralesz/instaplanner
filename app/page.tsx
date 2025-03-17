"use client"

import { ClearDialog } from "@/components/clear-dialog"
import { DropZone } from "@/components/drop-zone"
import { GlobalContextMenu } from "@/components/global-context-menu"
import { ImageGrid } from "@/components/image-grid"
import { ImageUploader } from "@/components/image-uploader"
import { InstructionsDialog } from "@/components/instructions-dialog"
import { MobileGallery } from "@/components/mobile-gallery"
import { MobileMaintenanceDialog } from "@/components/mobile-maintenance-dialog"
import { MobilePreviewDialog } from "@/components/mobile-preview-dialog"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { useDragAndDrop } from "@/hooks/use-drag-and-drop"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"
import { usePageHandlers } from "@/hooks/use-page-handlers"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"
import { AnimatePresence, motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Menu,
  Shuffle,
  Smartphone,
  Trash,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

const ThemeProviderNoSSR = dynamic(
  () => import("@/components/ui/theme-provider").then((m) => m.ThemeProvider),
  {
    ssr: false,
  }
)

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

  const [shouldSlide, setShouldSlide] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShouldSlide(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        setShouldSlide(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  const { handleDragStart, handleDragEnd, getActiveImage, isSwapAnimating } =
    useDragAndDrop({
      gridImages,
      sidebarImages,
      moveImageToGrid,
      moveImageToSidebar,
      updateImageOrder,
      swapImages,
      shouldSlide,
    })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    })
  )

  const activeImage = getActiveImage()

  const dragOverlayAnimation = {
    initial: { opacity: 0, rotate: 0 },
    animate: {
      opacity: isSwapAnimating ? 0 : 0.5,
      rotate: isSwapAnimating ? 0 : Math.random() < 0.5 ? -3 : 3,
    },
    exit: { opacity: 0, rotate: 0 },
    transition: {
      type: "tween",
      damping: 15,
      stiffness: 300,
    },
  }

  const dragDropAnimation = {
    duration: 250,
    easing: "ease",
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        dragOverlay: {
          transition: "all 250ms ease-out",
          opacity: "0",
        },
      },
    }),
  }

  return (
    <ThemeProviderNoSSR attribute="class" defaultTheme="dark">
      <main>
        <MobileMaintenanceDialog />

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
            <div className="flex min-h-screen flex-col md:flex-row">
              {/* Desktop Sidebar - Hidden on mobile */}
              <div className="fixed left-0 top-0 z-10 hidden h-screen w-80 flex-col overflow-hidden border-r border-foreground/10 md:flex">
                <div className="flex items-center justify-between border-b border-foreground/10 p-4">
                  <div className="flex items-center gap-4">
                    <h1 className="text-lg font-medium">InstaPlanner</h1>
                    <div className="h-4 w-px bg-foreground/10" />
                    <ImageUploader
                      onUpload={addImages}
                      ref={imageUploaderRef}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={shuffleSidebarImages}
                      title="Shuffle sidebar images"
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
                      disabled={sidebarImages.length === 0}
                    >
                      <ArrowRight className="size-5" />
                      <span className="sr-only">Move all to grid</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setClearDialogOpen(true)}
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
                        shouldSlide={shouldSlide}
                      />
                    </AnimatePresence>
                  </SortableContext>
                </div>
              </div>

              {/* Mobile Header - Visible only on mobile */}
              <div className="sticky top-0 z-20 border-b border-foreground/10 bg-background/90 backdrop-blur-sm md:hidden">
                <div className="flex h-16 items-center justify-between px-4">
                  <h1 className="text-lg font-medium">InstaPlanner</h1>
                  <div className="flex items-center gap-2">
                    <ImageUploader
                      onUpload={addImages}
                      ref={imageUploaderRef}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setClearDialogOpen(true)}
                    >
                      <Trash className="size-4" />
                      <span className="sr-only">Clear</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileGalleryOpen(true)}
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
                    <div className="mx-auto mb-1 flex max-w-3xl items-center justify-between px-5">
                      <h2 className="mr-3 text-lg font-medium">Grid</h2>
                      <div className="h-4 w-px bg-foreground/10" />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewOpen(true)}
                        className="mr-auto flex items-center gap-1 text-foreground/70 hover:text-foreground"
                      >
                        <Smartphone className="size-4" />
                        <span className="text-sm">Preview</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={moveAllToSidebar}
                        className="flex items-center gap-1 text-foreground/70 hover:text-foreground"
                        disabled={gridImages.length === 0}
                      >
                        <ArrowLeft className="size-5" />
                        <span className="text-sm">Move all to sidebar</span>
                      </Button>
                      <div className="h-4 w-px bg-foreground/10" />
                      <InstructionsDialog
                        open={instructionsOpen}
                        onOpenChange={setInstructionsOpen}
                      />
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
                          shouldSlide={shouldSlide}
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

              <DragOverlay dropAnimation={dragDropAnimation}>
                {activeImage ? (
                  <motion.div
                    {...dragOverlayAnimation}
                    className="relative aspect-[4/5] w-full overflow-hidden"
                    style={{
                      filter: "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))",
                      pointerEvents: "none",
                    }}
                  >
                    <Image
                      src={activeImage.data || ""}
                      alt="Dragging"
                      className="size-full object-cover"
                      fill={true}
                      priority
                    />
                    <div className="absolute inset-0 ring-2 ring-foreground/20" />
                  </motion.div>
                ) : null}
              </DragOverlay>
            </div>
          </DndContext>
        </DropZone>

        <MobilePreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          images={gridImages}
        />
      </main>
    </ThemeProviderNoSSR>
  )
}
