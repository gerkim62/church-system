import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import z from 'zod'
import Header from '../components/Header'
import { ErrorBoundary } from '@/features/error-handling'

import ConvexProvider from '../integrations/convex/provider'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({
  validateSearch: z.object({
    'sign-in-modal': z.literal('open').optional(),
    'redirect-url': z.string().optional(),
  }),
  component: () => (
    <>
      <ConvexProvider>
        <ErrorBoundary>
          <Header />
          <Outlet />
          <Toaster />
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </ErrorBoundary>
      </ConvexProvider>
    </>
  ),
})
