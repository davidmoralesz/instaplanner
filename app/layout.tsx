import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import type React from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "InstaPlanner",
  description: "A modern image gallery application",
  icons: {
    icon: "/instaplanner.png",
  },
}

/**
 * Root layout component for the application.
 * Provides global metadata, error handling, and UI components.
 * @param children - React nodes to be rendered inside the layout.
 * @returns The root layout structure.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        <ErrorBoundary>
          {children}
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  )
}
