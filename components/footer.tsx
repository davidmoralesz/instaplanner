"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { usePathname } from "next/navigation"
import { NavLink } from "@/types"

/**
 * Footer component that displays the footer section with links and copyright information.
 * @returns A footer section with current year, copyright notice, and optional links.
 */
export function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()

  const DEFAULT_NAV_LINKS: NavLink[] = [
    { path: "/terms", label: "Terms of Service" },
    { path: "/privacy", label: "Privacy Policy" },
    { path: "/releases", label: "Releases" },
  ]

  return (
    <footer className="fixed inset-x-0 bottom-0 z-40 h-12 border-t border-foreground/10 bg-background/80 px-3 backdrop-blur-sm md:h-10">
      <div className="flex h-full flex-wrap items-center justify-between gap-2 text-xs text-foreground/60">
        <div className="flex flex-wrap items-center gap-4">
          <span>© {currentYear} InstaPlanner</span>
          <a
            href="https://github.com/davidmoralesz"
            target="_blank"
            className="group text-foreground/40 transition-colors hover:text-foreground"
          >
            <span className="hidden items-center md:flex">
              Made with
              <Heart className="mx-1 size-3 group-hover:fill-foreground" />
              by David Morales
            </span>
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-4 px-3">
          {DEFAULT_NAV_LINKS.map(({ path, label }) => (
            <Link
              key={label}
              href={path}
              className={`transition-colors ${
                pathname === path ? "text-foreground" : ""
              } hover:text-foreground`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
