"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
      <DialogContent className="border-white/10 bg-black text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Clear Images</DialogTitle>
          <DialogDescription className="text-white/70">
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
              className="justify-start hover:bg-white/10 hover:text-white"
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
              className="justify-start hover:bg-white/10 hover:text-white"
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
              className="justify-start"
            >
              Clear All – {sidebarCount + gridCount} images
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
