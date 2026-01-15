import { ConvexError } from 'convex/values'
import { ERROR_CODES } from '~/convex/helpers/errors-helpers'

// Create a type from ERROR_CODES values for exhaustiveness checking
export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

export interface ParsedConvexError {
  code?: ErrorCode
  url?: string
  message?: string
}

/**
 * Parses a ConvexError to extract error code, URL, and message
 */
export function parseConvexError(error: Error): ParsedConvexError {
  if (error instanceof ConvexError) {
    const data = error.data
    
    // Handle string data (simple error codes)
    if (typeof data === 'string') {
      return { code: data as ErrorCode }
    }
    
    // Handle object data (complex errors with metadata)
    if (typeof data === 'object' && data !== null) {
      const parsedError: ParsedConvexError = {}
      
      if ('code' in data && data.code !== undefined) {
        parsedError.code = String(data.code) as ErrorCode
      }
      
      if ('url' in data && data.url !== undefined) {
        parsedError.url = String(data.url)
      }
      
      if ('message' in data && data.message !== undefined) {
        parsedError.message = String(data.message)
      }
      
      return parsedError
    }
  }
  
  return {}
}
