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

export function ClearDialog({
  open,
  onOpenChange,
  onClearSidebar,
  onClearGrid,
  onClearAll,
  sidebarCount,
  gridCount,
}: ClearDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-foreground/10 sm:max-w-md">
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
              disabled={sidebarCount === 0}
            >
              Clear Sidebar – {sidebarCount} images
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onClearGrid()
                onOpenChange(false)
              }}
              disabled={gridCount === 0}
            >
              Clear Grid – {gridCount} images
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onClearAll()
                onOpenChange(false)
              }}
              disabled={sidebarCount === 0 && gridCount === 0}
            >
              Clear All – {sidebarCount + gridCount} images
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
