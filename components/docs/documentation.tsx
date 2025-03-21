"use client"

import { Breadcrumb } from "@/components/breadcrumb"
import { Footer } from "@/components/footer"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import { useMarkdownContent } from "@/hooks/use-markdown-content"

interface DocumentationProps {
  title: string
  fetch: string
  className?: string
  hasBorder?: boolean
}

/**
 * Renders a documentation page with optional border and breadcrumb navigation.
 * It fetches and displays the markdown content while showing a loading skeleton during the fetching process.
 * @param title - The title to be displayed in the breadcrumb and at the top of the page
 * @param fetch - A function or URL to fetch the markdown content
 * @param className - Optional additional CSS class to apply to the main content container
 * @param hasBorder - Optional flag to apply a border around the content, default is false
 * @returns The rendered documentation page component.
 */
export function Documentation({
  title,
  fetch,
  className,
  hasBorder = false,
}: DocumentationProps) {
  const { content, isLoading } = useMarkdownContent(fetch)

  return (
    <div className="min-h-screen max-w-2xl px-4 py-8 pb-16">
      <Breadcrumb items={[{ label: title }]} />

      {isLoading ? (
        <div className="h-[calc(100vh-170px)] animate-pulse rounded-md bg-foreground/5"></div>
      ) : (
        <div
          className={cn(
            "space-y-6",
            hasBorder && "rounded-lg border border-foreground/20 p-8",
            className
          )}
        >
          <div className="markdown">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
