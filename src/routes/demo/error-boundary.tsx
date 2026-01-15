import { createFileRoute } from '@tanstack/react-router'
import { ConvexError } from 'convex/values'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ERROR_CODES } from '~/convex/helpers/errorHelpers'

function ErrorBoundaryDemo() {
  const [shouldThrow, setShouldThrow] = useState<string | null>(null)

  // Throw error when state changes
  if (shouldThrow) {
    switch (shouldThrow) {
      case 'unauthorized':
        throw new ConvexError(ERROR_CODES.unauthorized)
      case 'forbidden':
        throw new ConvexError(ERROR_CODES.forbidden)
      case 'notFound':
        throw new ConvexError(ERROR_CODES.notFound)
      case 'redirect':
        throw new ConvexError({
          code: ERROR_CODES.redirect,
          url: '/',
        })
      case 'generic':
        throw new Error('This is a generic error for testing purposes')
      default:
        break
    }
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8 p-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Error Boundary Demo</h1>
        <p className="text-muted-foreground">
          Click any button below to test different error states handled by the
          ErrorBoundary component. Each error type displays a unique UI with
          appropriate actions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-3 rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Unauthorized (401)</h3>
          <p className="text-sm text-muted-foreground">
            Shows a login button and redirect functionality
          </p>
          <Button
            onClick={() => setShouldThrow('unauthorized')}
            className="w-full"
            variant="outline"
          >
            Trigger Unauthorized
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Forbidden (403)</h3>
          <p className="text-sm text-muted-foreground">
            Shows access denied with retry option
          </p>
          <Button
            onClick={() => setShouldThrow('forbidden')}
            className="w-full"
            variant="outline"
          >
            Trigger Forbidden
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Not Found (404)</h3>
          <p className="text-sm text-muted-foreground">
            Shows resource not found with navigation options
          </p>
          <Button
            onClick={() => setShouldThrow('notFound')}
            className="w-full"
            variant="outline"
          >
            Trigger Not Found
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Redirect</h3>
          <p className="text-sm text-muted-foreground">
            Automatically redirects to specified URL
          </p>
          <Button
            onClick={() => setShouldThrow('redirect')}
            className="w-full"
            variant="outline"
          >
            Trigger Redirect
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Generic Error</h3>
          <p className="text-sm text-muted-foreground">
            Shows generic error with retry functionality
          </p>
          <Button
            onClick={() => setShouldThrow('generic')}
            className="w-full"
            variant="outline"
          >
            Trigger Generic Error
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-muted/50 p-6">
        <h2 className="mb-3 text-xl font-semibold">How it works</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• The ErrorBoundary component wraps the entire application</li>
          <li>
            • It catches errors from Convex queries, mutations, and React
            components
          </li>
          <li>• Different error codes trigger different UI responses</li>
          <li>
            • Unauthorized errors show a login button that opens the sign-in
            modal
          </li>
          <li>• Redirect errors automatically navigate to the specified URL</li>
          <li>• All error UIs are responsive and styled consistently</li>
        </ul>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/demo/error-boundary')({
  component: ErrorBoundaryDemo,
})
