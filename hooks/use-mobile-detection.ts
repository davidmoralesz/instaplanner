"use client"

import { useEffect, useState } from "react"

export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      // Function to check if device is mobile
      const checkMobile = () => {
        const userAgent =
          navigator.userAgent || navigator.vendor || (window as any).opera
        const mobileRegex =
          /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i

        // Check if screen width is less than 768px (typical mobile breakpoint)
        const isMobileWidth = window.innerWidth < 768
        const isMobileDevice = mobileRegex.test(userAgent.toLowerCase())

        setIsMobile(isMobileWidth || isMobileDevice)
        setIsReady(true)
      }

      // Check immediately
      checkMobile()

      // Check on resize
      window.addEventListener("resize", checkMobile)

      // Cleanup
      return () => window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return { isMobile, isReady }
}
