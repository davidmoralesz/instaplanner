"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

/**
 * ErrorBoundary component that catches JavaScript errors in its child components and displays a fallback UI.
 * @param children - The content to render if no error occurs
 * @param fallback - An optional custom fallback UI to display in case of an error
 * @returns A fallback UI when an error is caught or the children when no error occurs.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to the console
    console.error("Uncaught error:", { error, errorInfo })
  }

  public render() {
    if (this.state.hasError) {
      // Render fallback UI or default error message
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
            <div className="max-w-3xl space-y-4 text-balance text-center">
              <h2 className="text-xl font-semibold">Something went wrong</h2>
              <p className="text-foreground/70">
                {this.state.error?.message ||
                  "Please refresh the page to try again"}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-md bg-foreground/10 px-4 py-2 transition-colors hover:bg-foreground/20"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      )
    }

    // If no error, render children normally
    return this.props.children
  }
}
