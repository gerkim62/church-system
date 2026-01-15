import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home } from 'lucide-react'

export function NotFoundError() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
          <FileQuestion className="h-8 w-8 text-blue-600 dark:text-blue-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Not Found</h2>
          <p className="text-muted-foreground">
            The resource you're looking for doesn't exist.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate({ to: '/' })} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}
