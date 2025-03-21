/**
 * Utility functions used throughout the application
 */
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using `clsx` and `tailwind-merge`
 * @param inputs - Class values to be merged
 * @returns A single string with merged class names
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Swaps two elements in an array
 * @param array - The array containing elements to be swapped
 * @param i - The index of the first element
 * @param j - The index of the second element
 * @returns A new array with the elements swapped
 */
export function swapArrayElements<T>(array: T[], i: number, j: number): T[] {
  const newArray = [...array]
  ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  return newArray
}

/**
 * Gets the current time formatted as "00:00 AM/PM"
 * @returns A formatted time string
 */
export function getFormattedTime(): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date())
}

/**
 * Generates a random number between min and max (inclusive)
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns A random number
 */
export function getRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Computes the SHA-256 hash of the given content.
 * @param content - The string content to hash
 * @returns A promise that resolves to the SHA-256 hash as a hexadecimal string.
 */
export async function computeHash(content: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(content)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}
