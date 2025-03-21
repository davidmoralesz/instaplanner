/**
 * Storage system for persisting images using IndexedDB
 */
import { openDB, type DBSchema, type IDBPDatabase } from "idb"
import { AppError, ErrorCodes } from "@/lib/errors"
import { DB } from "@/config/constants"
import type { ImageItem, ContainerType } from "@/types"

/**
 * Database schema for the gallery
 */
interface GalleryDB extends DBSchema {
  images: {
    key: string
    value: {
      id: string
      data: string
      position: number
      timestamp: number
      container: ContainerType
    }
    indexes: {
      "by-position": number
    }
  }
}

/**
 * Initializes and upgrades the IndexedDB database for storing gallery images.
 * @returns A promise resolving to the initialized database instance
 * @throws {AppError} If the database initialization fails
 */
export async function initDB(): Promise<IDBPDatabase<GalleryDB>> {
  try {
    return await openDB<GalleryDB>(DB.NAME, DB.VERSION, {
      upgrade(db: IDBPDatabase<GalleryDB>, oldVersion) {
        if (oldVersion < 1) {
          const store = db.createObjectStore(DB.STORE_NAME, { keyPath: "id" })
          store.createIndex("by-position", "position")
        }
      },
    })
  } catch (error) {
    console.error("Failed to initialize database:", error)
    throw new AppError(
      "Failed to initialize database",
      ErrorCodes.IMAGE_LOAD_FAILED
    )
  }
}

/**
 * Saves an array of images to the specified container in IndexedDB.
 * @param images - Array of image objects to be saved
 * @param container - The container type where the images should be stored
 * @param positions - Optional array of positions for each image
 * @throws {AppError} If the image saving process fails
 */
export async function saveImages(
  images: ImageItem[],
  container: ContainerType,
  positions?: number[]
): Promise<void> {
  try {
    const db = await initDB()
    const tx = db.transaction(DB.STORE_NAME, "readwrite")
    const store = tx.objectStore(DB.STORE_NAME)

    // Get the current max position for the container if positions aren't provided
    let maxPosition = -1
    if (!positions) {
      const allImages = await store.getAll()
      const containerImages = allImages.filter(
        (img) => img.container === container
      )
      maxPosition = containerImages.reduce(
        (max, img) => Math.max(max, img.position || 0),
        -1
      )
    }

    // Save each image with its position
    await Promise.all(
      images.map((image, index) =>
        store.put({
          ...image,
          position: positions ? positions[index] : maxPosition + 1 + index, // Use provided position or append
          timestamp: Date.now(),
          container,
        })
      )
    )

    await tx.done
  } catch (error) {
    console.error("Failed to save images:", error)
    throw new AppError("Failed to save images", ErrorCodes.IMAGE_UPDATE_FAILED)
  }
}

/**
 * Gets the positions of images in the database.
 * @param imageIds - Array of image IDs to get positions for
 * @returns A promise resolving to an array of positions
 * @throws {AppError} If getting positions fails
 */
export async function getPositions(imageIds: string[]): Promise<number[]> {
  try {
    const db = await initDB()
    const positions = await Promise.all(
      imageIds.map(async (id) => {
        const image = await db.get(DB.STORE_NAME, id)
        return image ? image.position : -1
      })
    )
    return positions
  } catch (error) {
    console.error("Failed to get image positions:", error)
    throw new AppError(
      "Failed to get image positions",
      ErrorCodes.IMAGE_LOAD_FAILED
    )
  }
}

/**
 * Loads images from the IndexedDB database and organizes them by container.
 * @returns A promise resolving to an object containing arrays of grid and sidebar images.
 * @throws {AppError} If loading images fails
 */
export async function loadImages(): Promise<{
  gridImages: ImageItem[]
  sidebarImages: ImageItem[]
}> {
  try {
    const db = await initDB()
    const images = await db.getAll(DB.STORE_NAME)

    // Sort by position before grouping
    const sortedImages = images.sort((a, b) => a.position - b.position)

    // Group images by container
    return sortedImages.reduce(
      (acc, img) => {
        if (img.container === "grid") {
          acc.gridImages.push({ id: img.id, data: img.data })
        } else {
          acc.sidebarImages.push({ id: img.id, data: img.data })
        }
        return acc
      },
      { gridImages: [] as ImageItem[], sidebarImages: [] as ImageItem[] }
    )
  } catch (error) {
    console.error("Failed to load images:", error)
    throw new AppError("Failed to load images", ErrorCodes.IMAGE_LOAD_FAILED)
  }
}

/**
 * Updates the positions of images in the IndexedDB database.
 * @param images - Array of images with updated positions
 * @param container - The container type
 * @returns A promise that resolves when positions are updated.
 * @throws {AppError} If updating positions fails
 */
export async function updatePositions(
  images: ImageItem[],
  container: ContainerType
): Promise<void> {
  try {
    const db = await initDB()
    const tx = db.transaction(DB.STORE_NAME, "readwrite")
    const store = tx.objectStore(DB.STORE_NAME)

    await Promise.all(
      images.map(async (image, index) => {
        const existing = await store.get(image.id)
        if (existing) {
          await store.put({
            ...existing,
            position: index,
            container, // Ensure container is updated
          })
        }
      })
    )

    await tx.done
  } catch (error) {
    console.error("Failed to update positions:", error)
    throw new AppError(
      "Failed to update image positions",
      ErrorCodes.IMAGE_UPDATE_FAILED
    )
  }
}

/**
 * Deletes an image from the IndexedDB database.
 * @param id - The unique identifier of the image to delete
 * @returns A promise that resolves when the image is deleted.
 * @throws {AppError} If deleting the image fails
 */
export async function deleteImage(id: string): Promise<void> {
  try {
    const db = await initDB()
    await db.delete(DB.STORE_NAME, id)
  } catch (error) {
    console.error("Failed to delete image:", error)
    throw new AppError("Failed to delete image", ErrorCodes.IMAGE_DELETE_FAILED)
  }
}

/**
 * Clears all images from the IndexedDB database.
 * @returns A promise that resolves when all images are cleared.
 * @throws {AppError} If clearing all images fails
 */
export async function clearAllImages(): Promise<void> {
  try {
    const db = await initDB()
    const tx = db.transaction(DB.STORE_NAME, "readwrite")
    await tx.objectStore(DB.STORE_NAME).clear()
    await tx.done
  } catch (error) {
    console.error("Failed to clear all images:", error)
    throw new AppError(
      "Failed to clear all images",
      ErrorCodes.CLEAR_ALL_FAILED
    )
  }
}
