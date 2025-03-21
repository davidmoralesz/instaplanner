"use client"

import { Avatar } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Clock } from "@/components/clock"
import { getRandomInRange } from "@/lib/utils"
import type { ImageItem } from "@/types"
import { Bookmark, ChevronLeft, Film, Grid, Link } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"

interface PreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: ImageItem[]
}

/**
 * Component for displaying a mobile preview dialog with images and navigation.
 * @param open - Determines if the dialog is open
 * @param onOpenChange - Callback to handle dialog open state changes
 * @param images - List of images to be displayed in the preview
 * @returns A mobile preview dialog with navigation, tabs, and image grid.
 */
export function PreviewDialog({
  open,
  onOpenChange,
  images,
}: PreviewDialogProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.debug("[PreviewDialog] Rendered with", {
        open,
        imageCount: images.length,
      })
    }
  }, [open, images.length])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[85vh] w-[390px] max-w-[90vw] gap-0 overflow-hidden border-foreground/10 p-0">
        {/* Status Bar */}
        <div className="p-4 text-xs text-foreground/70">
          <DialogTitle className="sr-only">Mobile Preview</DialogTitle>
          <DialogDescription className="sr-only">
            Preview your layout in a mobile interface
          </DialogDescription>
          <Clock />
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2">
          <div className="flex items-center gap-6">
            <DialogClose className="hover:text-foreground/70">
              <ChevronLeft className="size-7" />
              <span className="sr-only">Close preview</span>
            </DialogClose>
            <span className="font-semibold">instaplanner</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Profile Header */}
          <div className="space-y-4 p-4">
            {/* Avatar and Stats */}
            <div className="flex items-center gap-4 md:gap-8">
              <Avatar className="size-10 border-2 border-foreground/10 md:size-20">
                <Skeleton className="size-full rounded-full bg-foreground/10" />
              </Avatar>
              <div className="flex flex-col">
                <div className="text-sm font-semibold">InstaPlanner</div>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="font-semibold">{images.length}</div>
                    <div className="text-sm ">posts</div>
                  </div>
                  <div>
                    <div className="font-semibold">
                      {getRandomInRange(499, 999)}
                    </div>
                    <div className="text-sm ">followers</div>
                  </div>
                  <div>
                    <div className="font-semibold">
                      {getRandomInRange(199, 699)}
                    </div>
                    <div className="text-sm ">following</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-1 space-y-1 text-sm">
              <span>Organize and plan you Instagram posts</span>
              <div className="flex">
                <a
                  href="https://github.com/davidmoralesz/instaplanner"
                  className="transition-colors hover:text-foreground/70"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Link className="mr-1.5 inline size-4" />
                  gh.com/davidmoralesz/instaplanner
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="inline-block size-6 border-2 dark:border-white/10">
                  <Skeleton className="size-full rounded-full bg-black/10 dark:bg-white/10" />
                </Avatar>
                <span>
                  Followed by&nbsp;
                  <a
                    href="https://instagram.com/dmoralesz"
                    className="font-medium transition-colors hover:text-foreground/70"
                    target="_blank"
                    rel="noreferrer"
                  >
                    dmoralesz
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="h-auto w-full border-b border-foreground/10 bg-transparent p-0">
              <TabsTrigger
                value="posts"
                className="flex-1 rounded-none border-b-2 border-transparent py-3 
                text-foreground data-[state=active]:border-foreground data-[state=active]:text-foreground"
              >
                <Grid className="size-5" />
              </TabsTrigger>
              <TabsTrigger
                value="reels"
                className="flex-1 rounded-none border-b-2 border-transparent py-3 text-foreground"
                disabled
              >
                <Film className="size-5" />
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="flex-1 rounded-none border-b-2 border-transparent py-3 text-foreground"
                disabled
              >
                <Bookmark className="size-5" />
              </TabsTrigger>
            </TabsList>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-[2px]">
              {images.map((image) => (
                <div key={image.id} className="relative pb-[125%]">
                  <Image
                    src={image.data || ""}
                    alt=""
                    className="size-full object-cover"
                    draggable={false}
                    fill={true}
                  />
                </div>
              ))}
              {/* Fill empty spaces with skeletons */}
              {Array.from({ length: Math.max(0, 9 - images.length) }).map(
                (_, i) => (
                  <Skeleton
                    key={`skeleton-${i}`}
                    className="relative rounded-none bg-foreground/10 pb-[125%]"
                  />
                )
              )}
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
