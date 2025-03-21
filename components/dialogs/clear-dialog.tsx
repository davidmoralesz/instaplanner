"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ClearDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onClearSidebar: () => void
  onClearGrid: () => void
  onClearAll: () => void
  sidebarCount: number
  gridCount: number
}

/**
 * Dialog component for clearing images from the sidebar, grid, or both.
 * @param open - Determines if the dialog is open
 * @param onOpenChange - Callback to handle dialog open state changes
 * @param onClearSidebar - Callback to clear images from the sidebar
 * @param onClearGrid - Callback to clear images from the grid
 * @param onClearAll - Callback to clear all images
 * @param sidebarCount - The number of images in the sidebar
 * @param gridCount - The number of images in the grid
 * @returns A dialog allowing users to choose which images to clear.
 */
export function ClearDialog({
  open,
  onOpenChange,
  onClearSidebar,
  onClearGrid,
  onClearAll,
  sidebarCount,
  gridCount,
}: ClearDialogProps) {
  const isSidebarEmpty = sidebarCount === 0
  const isGridEmpty = gridCount === 0
  const isLayoutEmpty = isSidebarEmpty && isGridEmpty
  const totalCount = sidebarCount + gridCount

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby="Clear Images"
        className="border-foreground/10 sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>Clear Images</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose which images you want to clear.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              onClick={() => {
                onClearSidebar()
                onOpenChange(false)
              }}
              disabled={isSidebarEmpty}
              className="flex justify-between"
            >
              <span>Clear Sidebar</span>
              <span className="text-foreground/70">{sidebarCount} images</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onClearGrid()
                onOpenChange(false)
              }}
              disabled={isGridEmpty}
              className="flex justify-between"
            >
              <span>Clear Grid</span>
              <span className="text-foreground/70">{gridCount} images</span>
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onClearAll()
                onOpenChange(false)
              }}
              disabled={isLayoutEmpty}
              className="flex justify-between"
            >
              <span>Clear All</span>
              <span className="text-foreground/70">{totalCount} images</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
