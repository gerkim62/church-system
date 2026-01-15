import { ConvexError } from 'convex/values'

export const ERROR_CODES = {
  unauthorized: 'UNAUTHORIZED',
  forbidden: 'FORBIDDEN',
  notFound: 'NOT_FOUND',
  redirect: 'REDIRECT',
} as const

export function forbidden() {
  return new ConvexError(ERROR_CODES.forbidden)
}

export function notFound() {
  return new ConvexError(ERROR_CODES.notFound)
}

export function unauthorized() {
  return new ConvexError(ERROR_CODES.unauthorized)
}

export function redirect(url: string) {
  return new ConvexError({
    code: ERROR_CODES.redirect,
    url: url,
  })
}
