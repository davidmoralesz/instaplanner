import { openDB, type DBSchema, type IDBPDatabase } from "idb"
import { AppError, ErrorCodes } from "@/lib/errors"
import type { ImageItem } from "@/types"

interface GalleryDB extends DBSchema {
  images: {
    key: string
    value: {
      id: string
      data: string
      position: number
      timestamp: number
      container: "grid" | "sidebar"
    }
    indexes: {
      "by-position": number
    }
  }
}

const DB_NAME = "gallery-db"
const STORE_NAME = "images"
const DB_VERSION = 1

/**
 * Initializes the IndexedDB database
 * @returns A promise that resolves to the database instance
 */
export async function initDB() {
  try {
    return await openDB<GalleryDB>(DB_NAME, DB_VERSION, {
      upgrade(db: IDBPDatabase<GalleryDB>, oldVersion) {
        if (oldVersion < 1) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" })
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
 * Saves images to the database
 * @param images The images to save
 * @param container The container to save the images to (grid or sidebar)
 */
export async function saveImages(
  images: ImageItem[],
  container: "grid" | "sidebar"
) {
  try {
    const db = await initDB()
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)

    // Get the current max position for the container
    const allImages = await store.getAll()
    const containerImages = allImages.filter(
      (img) => img.container === container
    )
    const maxPosition = containerImages.reduce(
      (max, img) => Math.max(max, img.position || 0),
      -1
    )

    await Promise.all(
      images.map((image, index) =>
        store.put({
          ...image,
          position: maxPosition + 1 + index, // Preserve order
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
 * Loads all images from the database
 * @returns A promise that resolves to an object containing grid and sidebar images
 */
export async function loadImages() {
  try {
    const db = await initDB()
    const images = await db.getAll(STORE_NAME)

    // Sort by position before grouping
    const sortedImages = images.sort((a, b) => a.position - b.position)

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
 * Updates the positions of images in the database
 * @param images The images to update
 * @param container The container the images are in (grid or sidebar)
 */
export async function updatePositions(
  images: ImageItem[],
  _container: "grid" | "sidebar"
) {
  try {
    const db = await initDB()
    const tx = db.transaction(STORE_NAME, "readwrite")
    const store = tx.objectStore(STORE_NAME)

    await Promise.all(
      images.map(async (image, index) => {
        const existing = await store.get(image.id)
        if (existing) {
          await store.put({
            ...existing,
            position: index,
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
 * Deletes an image from the database
 * @param id The ID of the image to delete
 */
export async function deleteImage(id: string) {
  try {
    const db = await initDB()
    await db.delete(STORE_NAME, id)
  } catch (error) {
    console.error("Failed to delete image:", error)
    throw new AppError("Failed to delete image", ErrorCodes.IMAGE_DELETE_FAILED)
  }
}

/**
 * Clears all images from the database
 */
export async function clearAllImages() {
  try {
    const db = await initDB()
    const tx = db.transaction(STORE_NAME, "readwrite")
    await tx.objectStore(STORE_NAME).clear()
    await tx.done
  } catch (error) {
    console.error("Failed to clear all images:", error)
    throw new AppError(
      "Failed to clear all images",
      ErrorCodes.CLEAR_ALL_FAILED
    )
  }
}
