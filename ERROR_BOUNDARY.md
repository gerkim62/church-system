# Error Boundary Implementation

## Overview

This project uses the [`react-error-boundary`](https://www.npmjs.com/package/react-error-boundary) library with a modular, feature-based architecture located in `src/features/error-handling/`. 

**Key Features:**
- ✅ Separate components for each error type
- ✅ TypeScript exhaustiveness checking
- ✅ Single source of truth for error codes
- ✅ Kebab-case file naming
- ✅ Feature-based organization

For detailed documentation, see [`src/features/error-handling/README.md`](src/features/error-handling/README.md).

## Quick Start

The ErrorBoundary is already integrated at the root level. To use in your Convex functions:

```typescript
import { unauthorized, forbidden, notFound, redirect } from '@/helpers/errors-helpers'

throw unauthorized()  // Triggers login UI
throw forbidden()     // Shows permission denied
throw notFound()      // Shows 404 UI
throw redirect('/path') // Redirects automatically
```

## Files

- `src/components/ErrorBoundary.tsx` - Main error boundary component
- `convex/helpers/errors-helpers.ts` - Backend error helper functions
- `src/routes/__root.tsx` - Root route with ErrorBoundary integration
- `src/routes/demo/error-boundary.tsx` - Interactive demo page

## Usage

### In Convex Functions

Use the error helper functions to throw properly formatted errors:

```typescript
import {
  forbidden,
  notFound,
  unauthorized,
  redirect,
} from '@/helpers/errors-helpers'

// Unauthorized - user needs to log in
throw unauthorized()

// Forbidden - user doesn't have permission
throw forbidden()

// Not Found - resource doesn't exist
throw notFound()

// Redirect - redirect to another page
throw redirect('/onboarding')
```

### Error Handling Flow

1. Error is thrown from Convex function or React component
2. ErrorBoundary catches the error
3. Error code is parsed from ConvexError
4. Appropriate UI is displayed based on error type
5. User can take action (login, go home, retry, etc.)

### Unauthorized Error Example

When a user tries to access a protected resource without being authenticated:

```typescript
// In your Convex query/mutation
export const getProtectedData = query({
  handler: async (ctx) => {
    const authCtx = await authComponent.getAuth(createAuth, ctx)
    const session = await assertAuthenticated(authCtx) // Throws unauthorized()

    // ... rest of your logic
  },
})
```

The ErrorBoundary will catch this and display:

- A yellow warning icon
- "Authentication Required" heading
- "Sign In" button that opens the sign-in modal
- "Go Home" button

### Forbidden Error Example

When a user doesn't have permission:

```typescript
export const deleteUser = mutation({
  handler: async (ctx, args) => {
    const authCtx = await authComponent.getAuth(createAuth, ctx)
    await assertPermitted({
      authCtx,
      statements: { user: ['delete'] },
    }) // Throws forbidden() if no permission

    // ... rest of your logic
  },
})
```

The ErrorBoundary will display:

- A red lock icon
- "Access Forbidden" heading
- "Go Home" and "Try Again" buttons

### Redirect Error Example

Automatically redirect users to onboarding:

```typescript
export const ensureOnboarded = query({
  handler: async (ctx) => {
    const authCtx = await authComponent.getAuth(createAuth, ctx)
    const activeMember = await getActiveMember(authCtx)

    if (!activeMember) {
      throw redirect('/onboarding')
    }

    // ... rest of your logic
  },
})
```

The ErrorBoundary will automatically navigate to `/onboarding`.

### Not Found Error Example

```typescript
export const getProduct = query({
  args: { id: v.id('products') },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id)

    if (!product) {
      throw notFound()
    }

    return product
  },
})
```

### Generic Error Handling

Any other errors (React errors, unexpected errors) will be caught and displayed with a generic error UI showing the error message and retry/home options.

## Advanced Usage

### Using `useErrorHandler` Hook

The `react-error-boundary` library provides a `useErrorHandler` hook for imperatively triggering the error boundary:

```typescript
import { useErrorHandler } from 'react-error-boundary'

function MyComponent() {
  const handleError = useErrorHandler()

  const fetchData = async () => {
    try {
      const result = await someAsyncOperation()
      return result
    } catch (error) {
      // This will trigger the ErrorBoundary
      handleError(error)
    }
  }

  return <button onClick={fetchData}>Fetch Data</button>
}
```

### Using `resetBoundary` in Custom Components

You can access the reset function via the `FallbackProps`:

```typescript
import { type FallbackProps } from 'react-error-boundary'

function CustomErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div>
      <h1>Error: {error.message}</h1>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}
```

### Nested Error Boundaries

You can nest error boundaries for more granular error handling:

```tsx
<ErrorBoundary>
  <Header />
  <ErrorBoundary FallbackComponent={CustomSidebarError}>
    <Sidebar />
  </ErrorBoundary>
  <Main />
</ErrorBoundary>
```

## Testing

Visit `/demo/error-boundary` to test all error types interactively.

## Customization

You can customize the error UI by:

1. **Custom Fallback**: Pass a custom fallback component

```tsx
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

;<ReactErrorBoundary FallbackComponent={CustomErrorFallback} onError={logError}>
  <YourComponent />
</ReactErrorBoundary>
```

2. **Inline Render Function**: Use the `fallbackRender` prop

```tsx
<ReactErrorBoundary
  fallbackRender={({ error, resetErrorBoundary }) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={resetErrorBoundary}>Reset</button>
    </div>
  )}
>
  <YourComponent />
</ReactErrorBoundary>
```

3. **Styling**: Modify the `ErrorFallback` component in `ErrorBoundary.tsx`

4. **Add New Error Types**:
   - Add new error code to `convex/helpers/errors-helpers.ts`
   - Add new helper function
   - Add new case in `ErrorFallback` component

## Integration

The ErrorBoundary is already integrated at the root level in `src/routes/__root.tsx`, so it will catch errors throughout your entire application. No additional setup needed!

### react-error-boundary Features Used

- ✅ `FallbackComponent` - Custom error UI for different error types
- ✅ `onError` - Error logging function
- ✅ `onReset` - Cleanup logic when error boundary resets
- ✅ TypeScript support with proper types
- ✅ Hook-friendly functional components

For more advanced features, see the [react-error-boundary documentation](https://github.com/bvaughn/react-error-boundary).
