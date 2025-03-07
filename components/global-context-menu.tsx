"use client"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { HelpCircle } from "lucide-react"
import type React from "react"

interface GlobalContextMenuProps {
  children: React.ReactNode
  onShowInstructions: () => void
}

export function GlobalContextMenu({
  children,
  onShowInstructions,
}: GlobalContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="size-full">{children}</ContextMenuTrigger>
      <ContextMenuContent className="border-zinc-800 bg-zinc-900 text-white">
        <ContextMenuItem
          onClick={onShowInstructions}
          className="flex cursor-pointer items-center gap-2 hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white"
        >
          <HelpCircle className="size-4" />
          <span>Show Instructions</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
