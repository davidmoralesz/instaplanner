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
      <ContextMenuContent className="border-foreground/25 text-foreground/70">
        <ContextMenuItem
          onClick={onShowInstructions}
          className="flex cursor-pointer items-center gap-2 transition-all focus:bg-foreground/10 focus:text-foreground"
        >
          <HelpCircle className="size-4" />
          <span>Show Instructions</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
