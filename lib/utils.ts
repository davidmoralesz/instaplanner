import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function swapArrayElements<T>(array: T[], i: number, j: number): T[] {
  const newArray = [...array]
  ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  return newArray
}
