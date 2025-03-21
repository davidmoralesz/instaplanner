/**
 * Application-wide constants
 */

/** Maximum number of images allowed in the application */
export const MAX_IMAGES = 100

/**
 * Maximum file size for uploaded images (in bytes)
 * Use 1 * 1024 * 1024 for 1 MB
 * Use 1 * 1024 for 1 KB
 */
export const MAX_FILE_SIZE = 3 * 1024 * 1024 // 3 MB

/** Maximum number of files to process at once */
export const MAX_FILES_TO_PROCESS = 20

/** Maximum dimension for compressed images */
export const MAX_IMAGE_DIMENSION = 1200

/** Image compression quality (0-1) */
export const IMAGE_COMPRESSION_QUALITY = 0.7

/** Animation duration for animations */
export const ANIMATION_DURATION_MS = 250
export const ANIMATION_DURATION_SEC = 0.25

/** Local storage key for instructions dialog */
export const INSTRUCTIONS_STORAGE_KEY = "gallery-instructions-shown"

/** IndexedDB configuration */
export const DB = {
  NAME: "instaplanner-db",
  STORE_NAME: "images" as const,
  VERSION: 2,
}

/** Toast configuration */
export const TOAST = {
  LIMIT: 1,
  REMOVE_DELAY: 1 * 1000,
}

/** Mobile breakpoint (in px) */
export const MOBILE_BREAKPOINT = 768

/**
 * [dndkit] The distance property represents the distance,
 * in pixels, by which the mouse needs to be moved before
 * a drag start event is emitted
 */
export const DRAG_DISTANCE_CONSTRAINT = 2
