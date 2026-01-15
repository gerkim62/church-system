import { useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

interface GenericErrorProps {
  error: Error
  resetErrorBoundary: () => void
}

export function GenericError({ error, resetErrorBoundary }: GenericErrorProps) {
  const navigate = useNavigate()
  const router = useRouter()

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900/20">
          <AlertCircle className="h-8 w-8 text-gray-600 dark:text-gray-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Something went wrong
          </h2>
          <p className="text-muted-foreground">
            {error.message || 'An unexpected error occurred'}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              resetErrorBoundary()
              router.invalidate()
            }}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
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
