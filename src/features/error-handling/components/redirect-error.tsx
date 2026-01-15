import { useLayoutEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'

interface RedirectErrorProps {
  url: string
}

/**
 * Handles redirect errors by immediately navigating to the specified URL.
 * Preserves the current search query parameters during navigation.
 * 
 * Uses useLayoutEffect instead of useEffect to ensure synchronous navigation
 * before browser paint, following React best practices for immediate actions
 * that are consequences of rendering (not external system synchronization).
 * 
 * @see https://react.dev/learn/you-might-not-need-an-effect
 */
export function RedirectError({ url }: RedirectErrorProps) {
  const navigate = useNavigate()
  const currentSearch = useSearch({ strict: false })

  // This is event-specific logic (error occurred → redirect immediately)
  // not external synchronization, so useLayoutEffect is appropriate
  useLayoutEffect(() => {
    void navigate({ 
      to: url,
      search: {
        ...currentSearch,
        "redirect-url": currentSearch["redirect-url"] ?? window.location.pathname
      } // Preserve existing search parameters
    })
  }, [navigate, url, currentSearch])

  return <p>
    Redirecting...
  </p>
}
