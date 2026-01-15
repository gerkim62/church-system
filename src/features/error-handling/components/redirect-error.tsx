import { useLayoutEffect } from 'react'
import { useRouter, useSearch } from '@tanstack/react-router'

interface RedirectErrorProps {
  url: string
  resetErrorBoundary?: () => void
}

/**
 * Handles redirect errors by immediately navigating to the specified URL.
 * Preserves the current search query parameters during navigation.
 * 
 * Uses useRouter to access the router instance and perform immediate navigation.
 * Resets the error boundary after navigation to ensure proper rendering.
 * 
 * @see https://react.dev/learn/you-might-not-need-an-effect
 */
export function RedirectError({ url, resetErrorBoundary }: RedirectErrorProps) {
  const router = useRouter()
  const currentSearch = useSearch({ strict: false })

  // Perform immediate navigation using router.navigate
  // Use replace: true to replace current entry and clear error boundary
  useLayoutEffect(() => {
    void router.navigate({
      to: url,
      search: {
        ...currentSearch,
        'redirect-url': currentSearch['redirect-url'] ?? window.location.pathname,
      },
      // replace: true, // Replace current entry to clear error boundary state
    })
    
    // Reset error boundary after navigation
    resetErrorBoundary?.()
  }, [router, url, currentSearch, resetErrorBoundary])

  return null
}
