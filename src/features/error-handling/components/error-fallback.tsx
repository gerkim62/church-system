import { type FallbackProps } from 'react-error-boundary'
import { ERROR_CODES } from '~/convex/helpers/errorHelpers'
import { parseConvexError, type ErrorCode } from '../utils/parse-convex-error'
import { UnauthorizedError } from './unauthorized-error'
import { ForbiddenError } from './forbidden-error'
import { NotFoundError } from './not-found-error'
import { RedirectError } from './redirect-error'
import { GenericError } from './generic-error'

/**
 * Helper function to ensure exhaustiveness checking
 */
function assertUnreachable(value: never): never {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`)
}

/**
 * Type guard to check if code matches a specific ERROR_CODE
 */
function isErrorCodeType(
  code: ErrorCode,
  type: ErrorCode
): code is typeof type {
  return code === type
}

/**
 * Main error fallback component that routes to specific error UIs
 * based on the error code. Uses TypeScript exhaustiveness checking
 * to ensure all error codes are handled.
 */
export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const { code, url } = parseConvexError(error)

  // No code means it's a generic error
  if (!code) {
    return <GenericError error={error} resetErrorBoundary={resetErrorBoundary} />
  }

  // Handle errors based on code with exhaustiveness checking
  if (isErrorCodeType(code, ERROR_CODES.unauthorized)) {
    return <UnauthorizedError />
  }

  if (isErrorCodeType(code, ERROR_CODES.forbidden)) {
    return <ForbiddenError resetErrorBoundary={resetErrorBoundary} />
  }

  if (isErrorCodeType(code, ERROR_CODES.notFound)) {
    return <NotFoundError />
  }

  if (isErrorCodeType(code, ERROR_CODES.redirect)) {
    if (!url) {
      console.error('Redirect error missing URL')
      return <GenericError error={error} resetErrorBoundary={resetErrorBoundary} />
    }
    return <RedirectError url={url} />
  }

  // TypeScript exhaustiveness check - this will error if we miss a case
  // The assertUnreachable call ensures that all cases are covered
  return assertUnreachable(code)
}
