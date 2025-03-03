"use client"

import type { ImageItem } from "@/types"
import { SortableContext } from "@dnd-kit/sortable"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Trash2, MoveRight, Shuffle, ChevronDown } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { AnimatePresence } from "framer-motion"

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
        className="h-[85vh] p-0 bg-black border-t border-white/10 rounded-t-xl"
        closeClassName="absolute right-4 top-4 text-white/50 hover:text-white"
      >
        <div className="flex flex-col h-full">
          {/* Handle bar for dragging */}
          <div className="pt-3 pb-2 flex justify-center">
            <div className="w-12 h-1 rounded-full bg-white/20" />
          </div>

          {/* Header */}
          <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-medium text-white">New Images</h2>
              <span className="text-sm text-white/50">{images.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onShuffleSidebar}
                title="Shuffle images"
                className="text-white/50 hover:text-white"
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
                className="text-white/50 hover:text-white"
                disabled={images.length === 0}
              >
                <MoveRight className="size-4" />
                <span className="sr-only">Move all to grid</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClearAll}
                className="text-white/50 hover:text-white"
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
          <div className="p-4 border-t border-white/10">
            <Button
              variant="ghost"
              className="w-full text-white/50 hover:text-white flex items-center justify-center gap-2"
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
