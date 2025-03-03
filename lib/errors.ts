export class AppError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message)
    this.name = "AppError"
  }
}

export const ErrorCodes = {
  IMAGE_UPLOAD_FAILED: "IMAGE_UPLOAD_FAILED",
  IMAGE_DELETE_FAILED: "IMAGE_DELETE_FAILED",
  IMAGE_LOAD_FAILED: "IMAGE_LOAD_FAILED",
  IMAGE_UPDATE_FAILED: "IMAGE_UPDATE_FAILED",
  CLEAR_ALL_FAILED: "CLEAR_ALL_FAILED",
} as const
