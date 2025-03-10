"use client"

import { Avatar } from "@/components/ui/avatar"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock } from "@/components/clock"
import { getRandomInRange } from "@/lib/utils"
import type { ImageItem } from "@/types"
import {
  Bell,
  Bookmark,
  ChevronLeft,
  Ellipsis,
  Film,
  Grid,
  Link,
} from "lucide-react"
import Image from "next/image"

interface MobilePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: ImageItem[]
}

export function MobilePreviewDialog({
  open,
  onOpenChange,
  images,
}: MobilePreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[85vh] max-w-[390px] gap-0 overflow-hidden border-white/10 bg-black p-0">
        {/* Status Bar */}
        <div className="flex items-center justify-between p-4 text-xs text-white/70">
          <Clock />
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <div className="flex items-center gap-6">
            <ChevronLeft className="size-6 text-white" />
            <span className="font-semibold">instaplanner</span>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="size-6 text-white" />
            <Ellipsis className="size-6 text-white" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Profile Header */}
          <div className="space-y-4 p-4">
            {/* Avatar and Stats */}
            <div className="flex items-center gap-8">
              <Avatar className="size-20 border-2 border-white/10">
                <Skeleton className="size-full rounded-full bg-white/10" />
              </Avatar>
              <div className="flex flex-col">
                <div className="text-sm font-semibold">InstaPlanner</div>
                <div className="flex items-center gap-10">
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
                  className="transition-colors hover:text-white/70"
                  target="_blank"
                >
                  <Link className="mr-1.5 inline size-4" />
                  github.com/davidmoralesz/instaplanner
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="inline-block size-6 border-2 border-white/10">
                  <Skeleton className="size-full rounded-full bg-white/10" />
                </Avatar>
                Followed by
                <a
                  href="https://instagram.com/dmoralesz"
                  className="font-medium transition-colors hover:text-white/70"
                  target="_blank"
                >
                  dmoralesz
                </a>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="h-auto w-full border-b border-white/10 bg-transparent p-0">
              <TabsTrigger
                value="posts"
                className="flex-1 rounded-none border-b-2 border-transparent py-3 text-white data-[state=active]:border-white data-[state=active]:text-white"
              >
                <Grid className="size-5" />
              </TabsTrigger>
              <TabsTrigger
                value="reels"
                className="flex-1 rounded-none border-b-2 border-transparent py-3 text-white"
                disabled
              >
                <Film className="size-5" />
              </TabsTrigger>
              <TabsTrigger
                value="saved"
                className="flex-1 rounded-none border-b-2 border-transparent py-3 text-white"
                disabled
              >
                <Bookmark className="size-5" />
              </TabsTrigger>
            </TabsList>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-px bg-black">
              {images.map((image) => (
                <div key={image.id} className="relative bg-black pb-[125%]">
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
                    className="relative rounded-none bg-white/10 pb-[125%]"
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
