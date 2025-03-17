"\"use client"

import { useState, useEffect } from "react"

export function useMaintenanceMode() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Skip fetching in development environment
    if (process.env.NEXT_PUBLIC_SHOW_DIALOG === "true") {
      setIsLoading(false)
      return
    }

    async function fetchMaintenanceMode() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/maintenance")

        if (res.ok) {
          const isActive = await res.text()
          setMaintenanceMode(isActive === "true")
        } else {
          console.error("[ERROR] Failed to fetch maintenance mode status")
          setError(new Error("Failed to fetch maintenance mode status"))
        }
      } catch (error) {
        console.error('[ERROR] fetch("/api/maintenance")', error)
        setError(error instanceof Error ? error : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchMaintenanceMode()
  }, [])

  return { maintenanceMode, isLoading, error }
}
