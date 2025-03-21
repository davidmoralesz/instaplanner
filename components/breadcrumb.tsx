"use client"

import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BreadcrumbProps {
  items: {
    label: string
    href?: string
  }[]
}

/**
 * Breadcrumb navigation component for displaying the current page's path.
 * @param items - An array of breadcrumb items, each containing a label and optional href
 * @returns A breadcrumb navigation with clickable links for each item, except the last one.
 */
export function Breadcrumb({ items }: BreadcrumbProps) {
  const router = useRouter()

  return (
    <nav className="mb-6 flex items-center space-x-1 text-sm text-foreground/70">
      <Button
        variant={"link"}
        onClick={() => router.push("/")}
        className="flex items-center pl-0 hover:text-foreground"
      >
        <span>InstaPlanner</span>
      </Button>

      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-5">
          <ChevronRight className="size-3" />
          {item.href ? (
            <Button
              variant={"link"}
              onClick={() => router.push(item.href!)}
              className="hover:text-foreground"
            >
              {item.label}
            </Button>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
