"use client"

import type React from "react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { HelpCircle } from "lucide-react"

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
      <ContextMenuTrigger className="w-full h-full">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-zinc-900 border-zinc-800 text-white">
        <ContextMenuItem
          onClick={onShowInstructions}
          className="flex items-center gap-2 cursor-pointer focus:bg-zinc-800 focus:text-white hover:bg-zinc-800"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Show Instructions</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
