"use client"

import { useState, useEffect } from "react"
import { AppError, ErrorCodes } from "@/lib/errors"

/**
 * Custom hook for managing maintenance mode state by fetching its status from an API.
 * @returns An object with the following properties:
 * @property maintenanceMode - Boolean indicating if maintenance mode is active
 * @property isLoading - Boolean indicating if the maintenance mode status is being fetched
 * @property error - Error object if fetching the maintenance mode status fails
 */
export function useMaintenanceMode() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Skip fetching in development environment
    if (process.env.NEXT_PUBLIC_SHOW_DIALOG === "true") {
      setMaintenanceMode(Boolean(process.env.NEXT_PUBLIC_SHOW_DIALOG))
      setIsLoading(false)
      return
    }

    /**
     * Fetches the maintenance mode status from the API
     */
    async function fetchMaintenanceMode() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/maintenance")

        if (res.ok) {
          const isActive = await res.text()
          setMaintenanceMode(isActive === "true")
        } else {
          console.error("[ERROR] Failed to fetch maintenance mode status")
          setError(
            new AppError(
              "Failed to fetch maintenance mode status",
              ErrorCodes.MAINTENANCE_MODE_FAILED
            )
          )
        }
      } catch (error) {
        console.error('[ERROR] fetch("/api/maintenance")', error)
        setError(
          error instanceof Error
            ? error
            : new AppError("Unknown error", ErrorCodes.UNKNOWN_ERROR)
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaintenanceMode()
  }, [])

  return { maintenanceMode, isLoading, error }
}
