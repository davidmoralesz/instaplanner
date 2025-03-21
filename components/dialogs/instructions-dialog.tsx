"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  ArrowRight,
  Command,
  Grip,
  HelpCircle,
  Shuffle,
  Trash,
  Upload,
} from "lucide-react"
import { useEffect, useState } from "react"
import { INSTRUCTIONS_STORAGE_KEY } from "@/config/constants"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface InstructionsDialogProps {
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * InstructionsDialog component displays a modal with usage instructions for InstaPlanner.
 * @param className - Custom additional class names to be applied to the component
 * @param open - Determines if the dialog is open (optional)
 * @param onOpenChange - Callback to handle dialog open state changes (optional)
 * @returns A dialog component containing app instructions and tips.
 */
export function InstructionsDialog({
  open,
  onOpenChange,
}: InstructionsDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = open ?? internalOpen
  const handleOpenChange = onOpenChange ?? setInternalOpen

  useEffect(() => {
    const instructionsShown = localStorage.getItem(INSTRUCTIONS_STORAGE_KEY)
    if (!instructionsShown) {
      handleOpenChange(true)
      localStorage.setItem(INSTRUCTIONS_STORAGE_KEY, "true")
    }
  }, [handleOpenChange])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground/70 hover:text-foreground"
          onClick={() => handleOpenChange(true)}
        >
          <HelpCircle className="size-4" />
          <span className="sr-only">Show Instructions</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="my-1 max-h-screen overflow-y-auto border-foreground/10 sm:max-w-xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-xl">Welcome to InstaPlanner</DialogTitle>
          <DialogDescription className="text-foreground/70">
            A simple way to organize and plan your Instagram posts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Basic Usage */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Usage</h3>
            <ul className="space-y-3 text-foreground/70">
              <li className="flex items-center gap-2 transition-colors hover:text-foreground/90">
                <Upload className="size-4" />
                Click the upload button or drag & drop images
              </li>
              <li className="flex items-center gap-2 transition-colors hover:text-foreground/90">
                <Grip className="size-4" />
                Drag images to reorder or move between sections
              </li>
              <li className="flex items-center gap-2 transition-colors hover:text-foreground/90">
                <Shuffle className="size-4" />
                Use shuffle to randomize sidebar images
              </li>
              <li className="flex items-center gap-2 transition-colors hover:text-foreground/90">
                <Trash className="size-4" />
                Delete individual images or clear sections
              </li>
            </ul>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Keyboard Shortcuts</h3>
            <div className="grid gap-4 text-sm">
              <div className="grid grid-cols-2 items-center gap-y-3">
                <div className="flex items-center gap-1">
                  <div className="rounded-md bg-foreground/10 p-1">
                    <Command className="size-4 text-foreground/70" />
                  </div>
                  <span className="text-foreground/70">+</span>
                  <kbd className="w-fit rounded-md bg-foreground/10 px-2 py-1 text-xs text-foreground/70">
                    shift
                  </kbd>
                  <span className="text-foreground/70">+</span>
                  <kbd className="w-fit rounded-md bg-foreground/10 px-2 py-1 text-xs text-foreground/70">
                    Z
                  </kbd>
                  <span className="text-foreground/70">Redo</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="w-fit rounded-md bg-foreground/10 px-2 py-1 text-xs text-foreground/70">
                    delete
                  </kbd>
                  <span className="text-foreground/70">
                    Delete hovered image
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="rounded-md bg-foreground/10 p-1">
                    <Command className="size-4 text-foreground/70" />
                  </div>
                  <span className="text-foreground/70">+</span>
                  <kbd className="w-fit rounded-md bg-foreground/10 px-2 py-1 text-xs text-foreground/70">
                    Z
                  </kbd>
                  <span className="text-foreground/70">Undo</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="w-fit rounded-md bg-foreground/10 px-2 py-1 text-xs text-foreground/70">
                    shift
                  </kbd>
                  <span className="text-foreground/70">
                    While dragging to slide
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="rounded-md bg-foreground/10 p-1">
                    <ArrowRight className="size-4 text-foreground/70" />
                  </div>
                  <span className="text-foreground/70">Move to grid</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="rounded-md bg-foreground/10 p-1">
                    <Command className="size-4 text-foreground/70" />
                  </div>
                  <span className="text-foreground/70">+</span>
                  <div className="rounded-md bg-foreground/10 p-1">
                    <ArrowRight className="size-4 text-foreground/70" />
                  </div>
                  <span className="text-foreground/70">Move all to grid</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="rounded-md bg-foreground/10 p-1">
                    <ArrowLeft className="size-4 text-foreground/70" />
                  </div>
                  <span className="text-foreground/70">Move to sidebar</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="rounded-md bg-foreground/10 p-1">
                    <Command className="size-4 text-foreground/70" />
                  </div>
                  <span className="text-foreground/70">+</span>
                  <div className="rounded-md bg-foreground/10 p-1">
                    <ArrowLeft className="size-4 text-foreground/70" />
                  </div>
                  <span className="text-foreground/70">
                    Move all to sidebar
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-md border border-foreground/10 bg-foreground/5 py-4">
            <Carousel
              className="mx-auto max-w-md"
              opts={{
                align: "center",
                loop: true,
              }}
            >
              <CarouselContent className="text-xs text-foreground/70">
                <CarouselItem>
                  <span className="font-medium">TIP:&nbsp;</span>
                  Hover over an image and use arrow keys to move it
                </CarouselItem>
                <CarouselItem>
                  <span className="font-medium">TIP:&nbsp;</span>
                  Hold
                  <kbd className="text-foreground">&nbsp;shift&nbsp;</kbd>
                  while dragging to slide an image instead of swapping it
                </CarouselItem>
                <CarouselItem>
                  <span className="font-medium">TIP:&nbsp;</span>
                  Drag an image directly onto another image to swap their
                  positions
                </CarouselItem>
                <CarouselItem>
                  <span className="font-medium">TIP:&nbsp;</span>
                  Drag an image directly onto another image to swap their
                  positions
                </CarouselItem>
                <CarouselItem>
                  <span className="font-medium">TIP:&nbsp;</span>
                  Right-click images for additional options
                </CarouselItem>
                <CarouselItem>
                  <span className="font-medium">TIP:&nbsp;</span>
                  Click the help icon
                  <HelpCircle className="mx-1 inline-block size-4" />
                  anytime to see these instructions again
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious variant={"ghost"} />
              <CarouselNext variant={"ghost"} />
            </Carousel>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
