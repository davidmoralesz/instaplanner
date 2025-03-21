import { useEffect, useState } from "react"

/**
 * Custom hook to fetch and manage markdown content.
 * @param docKey - Path to the markdown file relative to the public directory
 * @returns An object containing the markdown content and loading state.
 */
export function useMarkdownContent(docKey: string): {
  content: string
  isLoading: boolean
} {
  const [content, setContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchMarkdownContent = async () => {
      try {
        const response = await fetch(`/api/docs/${docKey}`)
        if (!response.ok) {
          throw new Error(
            `Error fetching /api/docs/${docKey}: ${response.statusText}`
          )
        }
        const text = await response.text()
        setContent(text)
      } catch (error) {
        console.error(error)
        setContent("Content could not be loaded. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarkdownContent()
  }, [docKey])

  return { content, isLoading }
}
