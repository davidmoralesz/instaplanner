"use client"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import type { ImageItem } from "@/types"
import { SortableContext } from "@dnd-kit/sortable"
import { AnimatePresence } from "framer-motion"
import { ChevronDown, MoveRight, Shuffle, Trash2 } from "lucide-react"

interface MobileGalleryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: ImageItem[]
  onDelete: (id: string) => void
  onClearAll: () => void
  onMoveAllToGrid: () => void
  onShuffleSidebar: () => void
  onMoveToGrid?: (id: string) => void
}

export function MobileGallery({
  open,
  onOpenChange,
  images,
  onDelete,
  onClearAll,
  onMoveAllToGrid,
  onShuffleSidebar,
  onMoveToGrid,
}: MobileGalleryProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[85vh] rounded-t-xl border-t border-foreground/10 bg-background p-0"
        closeClassName="absolute right-4 top-4 text-foreground/50 hover:text-foreground"
      >
        <div className="flex h-full flex-col">
          {/* Handle bar for dragging */}
          <div className="flex justify-center pb-2 pt-3">
            <div className="h-1 w-12 rounded-full bg-foreground/20" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium text-foreground">
                New Images
              </h2>
              <span className="text-sm text-foreground/50">
                {images.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onShuffleSidebar}
                title="Shuffle images"
                className="text-foreground/50 hover:text-foreground"
                disabled={images.length <= 1}
              >
                <Shuffle className="size-4" />
                <span className="sr-only">Shuffle</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onMoveAllToGrid}
                title="Move all to grid"
                className="text-foreground/50 hover:text-foreground"
                disabled={images.length === 0}
              >
                <MoveRight className="size-4" />
                <span className="sr-only">Move all to grid</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClearAll}
                className="text-foreground/50 hover:text-foreground"
              >
                <Trash2 className="size-4" />
                <span className="sr-only">Clear</span>
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <SortableContext items={images.map((img) => img.id)}>
              <AnimatePresence>
                <Sidebar
                  images={images}
                  onDelete={onDelete}
                  onMoveToGrid={onMoveToGrid}
                  onMoveAllToGrid={onMoveAllToGrid}
                  onDeleteAll={onClearAll}
                  onShuffle={onShuffleSidebar}
                />
              </AnimatePresence>
            </SortableContext>
          </div>

          {/* Close button at bottom */}
          <div className="border-t border-foreground/10 p-4">
            <Button
              variant="ghost"
              className="flex w-full items-center justify-center gap-2 text-foreground/50 hover:text-foreground"
              onClick={() => onOpenChange(false)}
            >
              Close
              <ChevronDown className="size-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
