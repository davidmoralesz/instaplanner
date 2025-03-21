/**
 * Error handling system for the application
 */

/**
 * Custom application error class with error codes
 */
export class AppError extends Error {
  /**
   * Creates a new application error
   * @param message - Human-readable error message
   * @param code - Error code for programmatic handling
   */
  constructor(
    message: string,
    public code: string
  ) {
    super(message)
    this.name = "AppError"
  }
}

/**
 * Error codes used throughout the application
 */
export const ErrorCodes = {
  IMAGE_UPLOAD_FAILED: "IMAGE_UPLOAD_FAILED",
  IMAGE_DELETE_FAILED: "IMAGE_DELETE_FAILED",
  IMAGE_LOAD_FAILED: "IMAGE_LOAD_FAILED",
  IMAGE_UPDATE_FAILED: "IMAGE_UPDATE_FAILED",
  CLEAR_ALL_FAILED: "CLEAR_ALL_FAILED",
  MAINTENANCE_MODE_FAILED: "MAINTENANCE_MODE_FAILED",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const

/**
 * Type for error codes
 */
export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

/**
 * Creates an error handler function that logs errors and calls a callback
 * @param callback - Function to call with the error message
 * @returns An error handler function
 */
export function createErrorHandler(callback: (message: string) => void) {
  return (error: unknown) => {
    console.error("Error:", error)

    const errorMessage =
      error instanceof AppError ? error.message : "An unexpected error occurred"

    callback(errorMessage)
  }
}
