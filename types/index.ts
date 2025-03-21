/**
 * Core application types used throughout the application
 */

/**
 * Represents an image item with a unique identifier and data.
 * @interface ImageItem
 * @property "id" - Unique identifier for the image
 * @property "data" - Base64 or URL data for the image
 */
export interface ImageItem {
  id: string
  data: string
}

/**
 * Represents a navigation link item with a unique path and label
 * @interface NavLink
 * @property "path" - Unique path
 * @property "label" - Label for the path
 */
export interface NavLink {
  path: string
  label: string
}

/**
 * Represents the type of container where the images are stored.
 * @type ContainerType
 * @property "grid" - The grid container for images
 * @property "sidebar" - The sidebar container for images
 * @property "all" - Represents both grid and sidebar containers
 */
export type ContainerType = "grid" | "sidebar" | "all"
