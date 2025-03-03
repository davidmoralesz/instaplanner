"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Trash2 as Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface ImageCardProps {
  image: { id: string; data: string }
  onDelete: (id: string) => void
}

export function ImageCard({ image, onDelete }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms cubic-bezier(0.2, 0, 0, 1)",
    opacity: isDragging ? 0 : 1,
    scale: isDragging ? 0.95 : 1,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`group relative bg-gray-900/50 backdrop-blur-sm border-white/10 cursor-move 
        hover:border-white/20 transition-all duration-200 will-change-transform
        ${isDragging ? "shadow-2xl ring-2 ring-white/20" : "hover:shadow-xl"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...attributes}
      {...listeners}
    >
      <CardContent className="p-0">
        <div className="relative pb-[125%]">
          <Image
            src={image.data || ""}
            alt="Gallery item"
            className="absolute inset-0 w-full h-full object-cover"
            width={100}
            height={100}
          />

          {/* Delete button overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-b from-black/60 to-transparent
              transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
          >
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                transition-all duration-200 scale-90 group-hover:scale-100
                bg-red-500/80 hover:bg-red-600/80"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(image.id)
              }}
            >
              <Trash className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
