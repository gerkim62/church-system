import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

interface RedirectErrorProps {
  url: string
}

/**
 * Handles redirect errors by automatically navigating to the specified URL
 */
export function RedirectError({ url }: RedirectErrorProps) {
  const navigate = useNavigate()

  useEffect(() => {
    void navigate({ to: url })
  }, [navigate, url])

  return null
}
