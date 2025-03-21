"use client"

import { useEffect, useState } from "react"
import { MOBILE_BREAKPOINT } from "@/config/constants"

/**
 * Custom hook for detecting mobile devices based on user agent and screen width.
 * @returns An object with the following properties:
 * @property isMobile - Boolean indicating if the user is on a mobile device
 * @property isReady - Boolean indicating if the detection process is complete
 */
export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        const userAgent =
          navigator.userAgent || navigator.vendor || (window as any).opera
        const mobileRegex =
          /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
        const isMobileWidth = window.innerWidth < MOBILE_BREAKPOINT
        const isMobileDevice = mobileRegex.test(userAgent.toLowerCase())

        setIsMobile(isMobileWidth || isMobileDevice)
        setIsReady(true)
      }

      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return { isMobile, isReady }
}
