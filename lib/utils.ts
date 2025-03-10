import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using `clsx` and `tailwind-merge`.
 *
 * @param inputs - An array of class values to be merged.
 * @returns A single string with merged class names.
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

/**
 * Swaps two elements in an array.
 *
 * @template T - The type of elements in the array.
 * @param array - The array containing elements to be swapped.
 * @param i - The index of the first element to be swapped.
 * @param j - The index of the second element to be swapped.
 * @returns A new array with the elements at index `i` and `j` swapped.
 */
export const swapArrayElements = <T>(array: T[], i: number, j: number): T[] => {
  const newArray = [...array]
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  return newArray
}

/**
 * Gets the current time formatted as "00:00 AM/PM".
 *
 * @returns A string representing the current time in "00:00 AM/PM" format.
 */
export const getFormattedTime = (): string =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  }).format(new Date())

/**
 * Generates a random number between min and max.
 *
 * @param max - The maximum value (inclusive)
 * @param min - The minimum value (inclusive)
 * @returns A random number between min and max.
 */
export const getRandomInRange = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min
