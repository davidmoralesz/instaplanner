"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Command,
  Upload,
  Shuffle,
  Trash2 as Trash,
  Grip,
} from "lucide-react"

const INSTRUCTIONS_KEY = "gallery-instructions-shown"

interface InstructionsDialogProps {
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function InstructionsDialog({
  className,
  open,
  onOpenChange,
}: InstructionsDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = open ?? internalOpen
  const handleOpenChange = onOpenChange ?? setInternalOpen

  useEffect(() => {
    const instructionsShown = localStorage.getItem(INSTRUCTIONS_KEY)
    if (!instructionsShown) {
      handleOpenChange(true)
      localStorage.setItem(INSTRUCTIONS_KEY, "true")
    }
  }, [handleOpenChange])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`text-white/70 hover:text-white ${className}`}
          onClick={() => handleOpenChange(true)}
        >
          <HelpCircle className="size-4" />
          <span className="sr-only">Show Instructions</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl bg-black border-white/10 overflow-y-auto max-h-screen my-1">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl text-white">
            Welcome to InstaPlanner
          </DialogTitle>
          <DialogDescription className="text-white/70">
            A simple way to organize and plan your Instagram posts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Usage */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Basic Usage</h3>
            <ul className="space-y-3 text-white/70">
              <li className="flex items-center gap-2 transition-colors hover:text-white/90">
                <Upload className="size-4 shrink-0" />
                Click the upload button or drag & drop images
              </li>
              <li className="flex items-center gap-2 transition-colors hover:text-white/90">
                <Grip className="size-4 shrink-0" />
                Drag images to reorder or move between sections
              </li>
              <li className="flex items-center gap-2 transition-colors hover:text-white/90">
                <Shuffle className="size-4 shrink-0" />
                Use shuffle to randomize sidebar images
              </li>
              <li className="flex items-center gap-2 transition-colors hover:text-white/90">
                <Trash className="size-4 shrink-0" />
                Delete individual images or clear sections
              </li>
            </ul>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">
              Keyboard Shortcuts
            </h3>
            <div className="grid gap-4 text-sm">
              <div className="grid grid-cols-2 items-center gap-y-3">
                <div className="flex items-center gap-1">
                  <div className="bg-white/10 p-1 rounded-md">
                    <Command className="size-4 text-white/70" />
                  </div>
                  <span className="text-white/70">+</span>
                  <kbd className="text-xs bg-white/10 px-2 py-1 rounded-md text-white/70 w-fit">
                    Shift
                  </kbd>
                  <span className="text-white/70">+</span>
                  <kbd className="text-xs bg-white/10 px-2 py-1 rounded-md text-white/70 w-fit">
                    Z
                  </kbd>
                  <span className="text-white/70">Redo</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="text-xs bg-white/10 px-2 py-1 rounded-md text-white/70 w-fit">
                    delete
                  </kbd>
                  <span className="text-white/70">Delete hovered image</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="bg-white/10 p-1 rounded-md">
                    <Command className="size-4 text-white/70" />
                  </div>
                  <span className="text-white/70">+</span>
                  <kbd className="text-xs bg-white/10 px-2 py-1 rounded-md text-white/70 w-fit">
                    Z
                  </kbd>
                  <span className="text-white/70">Undo</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="bg-white/10 p-1 rounded-md">
                    <ArrowRight className="size-4 text-white/70" />
                  </div>
                  <span className="text-white/70">Move to grid</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="bg-white/10 p-1 rounded-md">
                    <Command className="size-4 text-white/70" />
                  </div>
                  <span className="text-white/70">+</span>
                  <div className="bg-white/10 p-1 rounded-md">
                    <ArrowRight className="size-4 text-white/70" />
                  </div>
                  <span className="text-white/70">Move all to grid</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="bg-white/10 p-1 rounded-md">
                    <ArrowLeft className="size-4 text-white/70" />
                  </div>
                  <span className="text-white/70">Move to sidebar</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="bg-white/10 p-1 rounded-md">
                    <Command className="size-4 text-white/70" />
                  </div>
                  <span className="text-white/70">+</span>
                  <div className="bg-white/10 p-1 rounded-md">
                    <ArrowLeft className="size-4 text-white/70" />
                  </div>
                  <span className="text-white/70">Move all to sidebar</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Tips</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="transition-colors hover:text-white/90">
                • Hover over an image and use arrow keys to move it
              </li>
              <li className="transition-colors hover:text-white/90">
                • Right-click images for additional options
              </li>
              <li className="transition-colors hover:text-white/90">
                • Click this help icon
                <HelpCircle className="size-4 inline-block mx-1" />
                anytime to see these instructions again
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
