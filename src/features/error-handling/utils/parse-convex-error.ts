import { ConvexError } from 'convex/values'
import { ERROR_CODES } from '~/convex/helpers/errorHelpers'

// Create a type from ERROR_CODES values for exhaustiveness checking
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]

export interface ParsedConvexError {
  code?: ErrorCode
  url?: string
  message?: string
}

/**
 * Type guard to check if a string is a valid ErrorCode
 */
function isErrorCode(value: string): value is ErrorCode {
  const validCodes = Object.values(ERROR_CODES)
  return validCodes.includes(value)
}

/**
 * Type guard to check if value is a non-null object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/**
 * Safely get a string property from an object
 */
function getStringProperty(
  obj: Record<string, unknown>,
  key: string
): string | undefined {
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    const value = obj[key]
    if (typeof value === 'string') {
      return value
    }
  }
  return undefined
}

/**
 * Parses a ConvexError to extract error code, URL, and message
 */
export function parseConvexError(error: Error): ParsedConvexError {
  if (!(error instanceof ConvexError)) {
    return {}
  }

  const { data } = error

  // Handle string data (simple error codes)
  if (typeof data === 'string') {
    if (isErrorCode(data)) {
      return { code: data }
    }
    return {}
  }

  // Handle object data (complex errors with metadata)
  if (isObject(data)) {
    const parsedError: ParsedConvexError = {}

    const codeValue = getStringProperty(data, 'code')
    if (codeValue !== undefined && isErrorCode(codeValue)) {
      parsedError.code = codeValue
    }

    const urlValue = getStringProperty(data, 'url')
    if (urlValue !== undefined) {
      parsedError.url = urlValue
    }

    const messageValue = getStringProperty(data, 'message')
    if (messageValue !== undefined) {
      parsedError.message = messageValue
    }

    return parsedError
  }

  return {}
}

