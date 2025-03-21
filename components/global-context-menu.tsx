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

/**
 * GlobalContextMenu component that renders a context menu with an option to show instructions.
 * @param children - The content inside the context menu trigger that will be displayed to the user
 * @param onShowInstructions - A function to handle the action when the "Show Instructions" menu item is clicked
 * @returns A context menu with a trigger and an option to show instructions.
 */
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
