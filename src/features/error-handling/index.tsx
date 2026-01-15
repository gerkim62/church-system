import { type ReactNode } from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './components/error-fallback'

/**
 * Logs errors caught by the error boundary
 */
function logError(error: Error, info: { componentStack?: string | null }) {
  console.error('Error caught by boundary:', error, info)
}

/**
 * Main ErrorBoundary component that wraps the application
 * and handles all errors with appropriate fallback UIs
 */
export function ErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logError}
      onReset={() => {
        console.log('Error boundary reset')
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}

// Re-export for convenience
export { ErrorFallback } from './components/error-fallback'
export { parseConvexError } from './utils/parse-convex-error'
export type { ErrorCode, ParsedConvexError } from './utils/parse-convex-error'
