"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Menu,
  Shuffle,
  Smartphone,
  Trash,
} from "lucide-react"
import { SortableContext } from "@dnd-kit/sortable"

// Components
import { ClearDialog } from "@/components/dialogs/clear-dialog"
import { DropZone } from "@/components/drop-zone"
import { GlobalContextMenu } from "@/components/global-context-menu"
import { ImageGrid } from "@/components/grid/image-grid"
import { InstructionsDialog } from "@/components/dialogs/instructions-dialog"
import { SidebarSheet, SidebarContent } from "@/components/sidebar"
import { MaintenanceDialog } from "@/components/dialogs/maintenance-dialog"
import { PreviewDialog } from "@/components/dialogs/preview-dialog"
import { Button } from "@/components/ui/button"
import { DndProvider } from "@/components/dnd/dnd-provider"
import { ImageUploader } from "@/components/image-uploader"
import { Footer } from "@/components/footer"

// Hooks
import { usePageHandlers } from "@/hooks/use-page-handlers"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"

// Load ThemeProvider dynamically to avoid SSR issues
const ThemeProviderNoSSR = dynamic(
  () => import("@/components/ui/theme-provider").then((m) => m.ThemeProvider),
  {
    ssr: false,
  }
)

/**
 * Page component for the InstaPlanner gallery.
 * Manages state and handlers for image organization, drag-and-drop functionality,
 * keyboard navigation, and UI interactions across different components.
 * @returns The gallery page layout with grid and sidebar image management.
 */
export default function GalleryPage() {
  const {
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
  } = usePageHandlers()

  const { hoveredImageId, setHoveredImageId, setHoveredContainer } =
    useKeyboardNavigation({
      onMoveToGrid: onMoveToGrid,
      onMoveToSidebar: onMoveToSidebar,
      onMoveAllToGrid: onMoveAllToGrid,
      onMoveAllToSidebar: onMoveAllToSidebar,
      onDelete: handleDeleteImage,
      onUndo: handleUndo,
      onRedo: handleRedo,
      canUndo,
      canRedo,
    })

  const [shouldSlide, setShouldSlide] = useState(false)

  /**
   * Tracks the shift key state to enable/disable sliding functionality.
   * Sets up event listeners for keydown and keyup events on the window.
   * Cleans up event listeners on component unmount.
   */
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

  return (
    <ThemeProviderNoSSR attribute="class" defaultTheme="dark">
      <main>
        <MaintenanceDialog />

        <DropZone onDrop={onAddImages}>
          <DndProvider
            gridImages={gridImages}
            sidebarImages={sidebarImages}
            onMoveToGrid={onMoveToGrid}
            onMoveToSidebar={onMoveToSidebar}
            onUpdateImageOrder={onUpdateImageOrder}
            onSwapImages={onSwapImages}
            shouldSlide={shouldSlide}
          >
            <div className="flex min-h-screen flex-col md:flex-row">
              {/* Desktop Sidebar - Hidden on mobile */}
              <div className="fixed left-0 top-0 z-10 hidden h-screen w-80 flex-col overflow-hidden border-r border-foreground/10 md:flex">
                <div className="flex items-center justify-between border-b border-foreground/10 p-4">
                  <div className="flex items-center gap-4">
                    <h1 className="text-lg font-medium">InstaPlanner</h1>
                    <div className="h-4 w-px bg-foreground/10" />
                    <ImageUploader
                      onUpload={onAddImages}
                      ref={imageUploaderRef}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onShuffleSidebar}
                      title="Shuffle sidebar images"
                      disabled={sidebarImages.length <= 1}
                    >
                      <Shuffle className="size-4" />
                      <span className="sr-only">Shuffle</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onMoveAllToGrid}
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

                <div className="h-screen overflow-y-auto">
                  <SortableContext items={sidebarImages.map((img) => img.id)}>
                    <AnimatePresence>
                      <SidebarContent
                        images={sidebarImages}
                        onDelete={(id) => handleDeleteImage(id, "sidebar")}
                        onMoveToGrid={onMoveToGrid}
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
                      onUpload={onAddImages}
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
                      onClick={() => setMobileSheetOpen(true)}
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
                <div className="h-screen flex-1 overflow-auto md:ml-80">
                  <div className="w-full px-4 pb-0 pt-4 md:px-6 md:pt-6">
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
                        onClick={onMoveAllToSidebar}
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
                          onMoveToSidebar={onMoveToSidebar}
                          onMoveAllToSidebar={onMoveAllToSidebar}
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
              <SidebarSheet
                open={mobileSheetOpen}
                onOpenChange={setMobileSheetOpen}
                images={sidebarImages}
                onDelete={(id) => handleDeleteImage(id, "sidebar")}
                onClearAll={() => setClearDialogOpen(true)}
                onMoveAllToGrid={onMoveAllToGrid}
                onShuffleSidebar={onShuffleSidebar}
                onMoveToGrid={onMoveToGrid}
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
            </div>
            <Footer />
          </DndProvider>
        </DropZone>

        <PreviewDialog
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          images={gridImages}
        />
      </main>
    </ThemeProviderNoSSR>
  )
}
