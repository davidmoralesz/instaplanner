/**
 * Types for the drag and drop system
 */
import type { ImageItem, ContainerType } from "@/types"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"

/**
 * Props for the drag and drop hook
 */
export interface DragAndDropProps {
  /** Grid images */
  gridImages: ImageItem[]
  /** Sidebar images */
  sidebarImages: ImageItem[]
  /** Function to move an image to the grid */
  onMoveToGrid: (id: string) => Promise<void>
  /** Function to move an image to the sidebar */
  onMoveToSidebar: (id: string) => Promise<void>
  /** Function to update image order */
  onUpdateImageOrder: (
    container: ContainerType,
    oldIndex: number,
    newIndex: number,
    shouldSlide: boolean
  ) => Promise<void>
  /** Function to swap images between containers */
  onSwapImages: (sourceId: string, targetId: string) => Promise<void>
  /** Whether to slide images instead of swapping them */
  shouldSlide?: boolean
}

/**
 * State for swap animations
 */
export interface SwapAnimationState {
  /** Whether an animation is in progress */
  isAnimating: boolean
  /** ID of the source image */
  sourceId: string | null
  /** ID of the target image */
  targetId: string | null
  /** Bounding rectangle of the source image */
  sourceRect: DOMRect | null
  /** Bounding rectangle of the target image */
  targetRect: DOMRect | null
}

/**
 * Configuration for drag transition animations
 */
export interface DragTransitionConfig {
  /** Initial animation state */
  initial?: {
    opacity?: number
    scale?: number
    rotate?: number
  }
  /** Animation state during drag */
  animate?: {
    opacity?: number
    scale?: number
    rotate?: number
  }
  /** Animation state when exiting */
  exit?: {
    opacity?: number
    scale?: number
    rotate?: number
  }
  /** Animation transition configuration */
  transition: {
    type: string
    damping: number
    stiffness: number
  }
}

/**
 * Configuration for drag overlay animations
 */
export interface DragOverlayConfig {
  /** Initial animation state */
  initial?: {
    opacity?: number
    scale?: number
    rotate?: number
  }
  /** Animation state during drag */
  animate?: {
    opacity?: number
    scale?: number
    rotate?: number
  }
  /** Animation state when exiting */
  exit?: {
    opacity?: number
    scale?: number
    rotate?: number
  }
  /** Animation transition configuration */
  transition?: {
    duration?: number
  }
}

/**
 * Result of the useDragAndDrop hook
 */
export interface DragAndDropResult {
  /** ID of the active item being dragged */
  activeId: string | null
  /** Function to handle drag start */
  handleDragStart: (event: DragStartEvent) => void
  /** Function to handle drag end */
  handleDragEnd: (event: DragEndEvent) => void
  /** Function to get the active image */
  getActiveImage: () => ImageItem | null
  /** Whether to slide images instead of swapping them */
  shouldSlide: boolean
}
