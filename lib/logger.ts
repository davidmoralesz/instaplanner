type LogLevel = "debug" | "info" | "warn" | "error"

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: unknown
}

class Logger {
  private static instance: Logger
  private isProduction = process.env.NODE_ENV === "production"
  private logBuffer: LogEntry[] = []
  private maxBufferSize = 100

  private constructor() {
    // Initialize error tracking
    if (this.isProduction) {
      window.addEventListener("error", (event) => {
        this.error("Uncaught error:", {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error,
        })
      })

      window.addEventListener("unhandledrejection", (event) => {
        this.error("Unhandled promise rejection:", {
          reason: event.reason,
        })
      })
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    data?: unknown
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    }
  }

  private log(level: LogLevel, message: string, data?: unknown) {
    const logEntry = this.formatMessage(level, message, data)

    // In production, buffer logs and only show errors
    if (this.isProduction) {
      this.logBuffer.push(logEntry)
      if (this.logBuffer.length > this.maxBufferSize) {
        this.logBuffer.shift()
      }

      if (level === "error") {
        console.error(message, data)
        this.sendToServer(logEntry)
      }
      return
    }

    // In development, show all logs
    const consoleMethod = console[level] || console.log
    consoleMethod(`[${level.toUpperCase()}] ${message}`, data)
  }

  private async sendToServer(logEntry: LogEntry) {
    if (!this.isProduction) return

    try {
      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logEntry),
      })
    } catch (error) {
      console.error("Failed to send log to server:", error)
    }
  }

  debug(message: string, data?: unknown) {
    this.log("debug", message, data)
  }

  info(message: string, data?: unknown) {
    this.log("info", message, data)
  }

  warn(message: string, data?: unknown) {
    this.log("warn", message, data)
  }

  error(message: string, data?: unknown) {
    this.log("error", message, data)
  }

  // Performance monitoring
  startPerformanceTimer(label: string) {
    if (!this.isProduction) {
      console.time(label)
    }
  }

  endPerformanceTimer(label: string) {
    if (!this.isProduction) {
      console.timeEnd(label)
    }
  }

  // Get all logs (useful for debugging)
  getLogs(): LogEntry[] {
    return [...this.logBuffer]
  }

  // Clear logs
  clearLogs() {
    this.logBuffer = []
  }
}

export const logger = Logger.getInstance()
