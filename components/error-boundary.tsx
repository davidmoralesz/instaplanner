"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", { error, errorInfo })
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
            <div className="space-y-4 text-center">
              <h2 className="text-xl font-semibold">Something went wrong</h2>
              <p className="text-foreground/70">
                Please refresh the page to try again
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

    return this.props.children
  }
}
