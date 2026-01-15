import { useState } from 'react'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Church } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSwap } from '@/components/ui/loading-swap'
import { authClient } from '@/lib/auth-client'
import { generateSlug } from '@/lib/utils'

export const Route = createFileRoute('/_authed/ob/register-church')({
  component: RegisterChurchPage,
})

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

type FormValues = z.infer<typeof formSchema>


function RegisterChurchPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_authed/ob/register-church' })
  const redirectUrl = search['redirect-url'] ?? '/'
  
  const [isPending, setIsPending] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsPending(true)
    const slug = generateSlug(data.name)
    
    try {
      await authClient.organization.create(
        {
          name: data.name,
          slug: slug,
        },
        {
          onSuccess: () => {
            toast.success('Church registered successfully!')
            void navigate({ to: redirectUrl })
          },
          onError: (ctx) => {
            if (ctx.response.status === 401) {
              toast.error('You must be logged in to register a church')
              return
            }
            toast.error(ctx.error.message || 'Failed to register church')
            setIsPending(false)
          },
        }
      )
    } catch (error) {
      console.error(error)
      toast.error('An unexpected error occurred')
      setIsPending(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Church className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Register Your Church
          </h1>
          <p className="text-muted-foreground">
            Enter your church name to get started.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Church Name</Label>
            <Input
              id="name"
              placeholder="e.g. Grace Community Church"
              {...form.register('name')}
              disabled={isPending}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive font-medium">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            <LoadingSwap isLoading={isPending}>
              Register Church
            </LoadingSwap>
          </Button>
        </form>
      </div>
    </div>
  )
}
