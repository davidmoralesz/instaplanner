"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { DragOverlay as DndKitDragOverlay } from "@dnd-kit/core"
import type { ImageItem } from "@/types"
import { dragOverlayAnimation, dropAnimation } from "@/lib/dnd/animation"

interface DragOverlayProps {
  activeImage: ImageItem | null
  animation?: typeof dragOverlayAnimation
}

/**
 * Component for rendering a drag overlay.
 * @param activeImage - The image being dragged
 * @param animation - The animation settings for the overlay
 * @returns A drag overlay component or null if no image is active.
 */
export function DragOverlay({
  activeImage,
  animation = dragOverlayAnimation,
}: DragOverlayProps) {
  if (!activeImage) return null

  return (
    <DndKitDragOverlay dropAnimation={dropAnimation}>
      <motion.div
        initial={animation.initial}
        animate={animation.animate}
        exit={animation.exit}
        transition={animation.transition}
        className="relative aspect-[4/5] w-48 overflow-hidden"
        style={{ pointerEvents: "none" }}
      >
        <Image
          src={activeImage.data || ""}
          alt="Dragging"
          className="size-full object-cover"
          fill={true}
          priority
        />
        <div className="absolute inset-0 ring-2 ring-foreground/20" />
      </motion.div>
    </DndKitDragOverlay>
  )
}
