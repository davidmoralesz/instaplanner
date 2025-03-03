export interface ImageItem {
  id: string
  data: string
}

declare global {
  interface Window {
    setHoveredImageId?: (id: string | null) => void
    setHoveredContainer?: (container: "grid" | "sidebar" | null) => void
  }
}
