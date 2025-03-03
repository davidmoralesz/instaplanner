import { NextResponse } from "next/server"
import type { LogEntry } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    const logEntry: LogEntry = await request.json()

    // Here you would typically:
    // 1. Validate the log entry
    // 2. Store it in your database
    // 3. Send it to a logging service like Datadog, LogRocket, etc.

    console.error(
      `[SERVER] ${logEntry.level}: ${logEntry.message}`,
      logEntry.data
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("An error occurred:", error)
    return NextResponse.json(
      { error: "Failed to process log" },
      { status: 500 }
    )
  }
}
