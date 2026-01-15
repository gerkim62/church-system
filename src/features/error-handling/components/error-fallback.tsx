import { type FallbackProps } from 'react-error-boundary'
import { ERROR_CODES } from '~/convex/helpers/errors-helpers'
import { parseConvexError } from '../utils/parse-convex-error'
import { UnauthorizedError } from './unauthorized-error'
import { ForbiddenError } from './forbidden-error'
import { NotFoundError } from './not-found-error'
import { RedirectError } from './redirect-error'
import { GenericError } from './generic-error'

/**
 * Helper function to ensure exhaustiveness checking
 */
function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${String(value)}`)
}

/**
 * Main error fallback component that routes to specific error UIs
 * based on the error code. Uses TypeScript exhaustiveness checking
 * to ensure all error codes are handled.
 */
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const { code, url } = parseConvexError(error)

  // Handle errors based on code with exhaustiveness checking
  if (code) {
    switch (code as typeof ERROR_CODES[keyof typeof ERROR_CODES]) {
      case ERROR_CODES.unauthorized:
        return <UnauthorizedError />

      case ERROR_CODES.forbidden:
        return <ForbiddenError resetErrorBoundary={resetErrorBoundary} />

      case ERROR_CODES.notFound:
        return <NotFoundError />

      case ERROR_CODES.redirect:
        if (!url) {
          console.error('Redirect error missing URL')
          return <GenericError error={error} resetErrorBoundary={resetErrorBoundary} />
        }
        return <RedirectError url={url} />

      default:
        // TypeScript exhaustiveness check - this will error if we miss a case
        assertNever(code as never)
    }
  }

  // No code means it's a generic error
  return <GenericError error={error} resetErrorBoundary={resetErrorBoundary} />
}
