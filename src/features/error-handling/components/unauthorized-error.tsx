import { useLayoutEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useErrorBoundary } from 'react-error-boundary'
import { Button } from '@/components/ui/button'
import { LogIn, Home } from 'lucide-react'
import SignInModal from '@/features/auth/signin-modal'
import { authClient } from '@/lib/auth-client'

/**
 * Shows unauthorized error and automatically refreshes when session becomes available.
 * Monitors auth state and triggers error boundary reset upon successful login.
 */
export function UnauthorizedError() {
  const navigate = useNavigate()
  const { resetBoundary } = useErrorBoundary()
  const session = authClient.useSession()
  const hasCheckedInitialSession = useRef(false)

  // Monitor session state and reset error boundary when user logs in
  // Uses useLayoutEffect to reset immediately before paint
  useLayoutEffect(() => {
    // Skip the first render to avoid false positive (session was already null)
    if (!hasCheckedInitialSession.current) {
      hasCheckedInitialSession.current = true
      return
    }

    // When session becomes available after being null, reset the error boundary
    // This will re-render the protected component with the new session
    if (session.data) {
      resetBoundary()
    }
  }, [session.data, resetBoundary])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
          <LogIn className="h-8 w-8 text-yellow-600 dark:text-yellow-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Authentication Required
          </h2>
          <p className="text-muted-foreground">
            You need to be logged in to access this page.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <SignInModal>
            <Button className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </SignInModal>
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/' })}
            className="w-full"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  )
}
