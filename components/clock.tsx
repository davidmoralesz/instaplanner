import { getFormattedTime } from "@/lib/utils"
import { useState, useEffect } from "react"

/**
 * Clock component that displays the current time and updates every minute.
 * @returns A span element displaying the formatted time.
 */
export function Clock() {
  const [clock, setTime] = useState(getFormattedTime())

  useEffect(() => {
    const interval = 60 * 1000
    const now = new Date()
    const delay = interval - (now.getSeconds() * 1000 + now.getMilliseconds())

    const updateTime = () => setTime(getFormattedTime())

    const intervalId = setInterval(updateTime, interval)
    const timerId = setTimeout(() => {
      updateTime()
      setInterval(updateTime, interval)
    }, delay)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timerId)
    }
  }, [])

  return <span>{clock}</span>
}
