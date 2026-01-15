# Error Handling Feature

## Overview

The error handling feature uses the [`react-error-boundary`](https://www.npmjs.com/package/react-error-boundary) library with a modular, component-based architecture. Error codes are imported from the source of truth (`convex/helpers/errors-helpers.ts`), and TypeScript exhaustiveness checking ensures all error codes are properly handled.

## Architecture

### File Structure

```
src/features/error-handling/
├── components/
│   ├── error-fallback.tsx       # Main router with exhaustiveness checking
│   ├── unauthorized-error.tsx   # 401 - Login required
│   ├── forbidden-error.tsx      # 403 - Permission denied
│   ├── not-found-error.tsx      # 404 - Resource not found
│   ├── redirect-error.tsx       # Automatic redirect handler
│   └── generic-error.tsx        # Fallback for unknown errors
├── utils/
│   └── parse-convex-error.ts    # Error parsing utility
└── index.tsx                    # Public API exports
```

### Design Principles

1. **Single Source of Truth**: ERROR_CODES imported from `~/convex/helpers/errors-helpers.ts`
2. **TypeScript Safety**: Exhaustiveness checking ensures all error codes are handled
3. **Separation of Concerns**: Each error type has its own component
4. **Naming Convention**: All files use kebab-case (e.g., `error-fallback.tsx`)
5. **Feature-Based**: Organized under `@/features/error-handling`

## Error Types

| Error Code | Component | Description |
|------------|-----------|-------------|
| `UNAUTHORIZED` | `UnauthorizedError` | User needs to log in |
| `FORBIDDEN` | `ForbiddenError` | User lacks permission |
| `NOT_FOUND` | `NotFoundError` | Resource doesn't exist |
| `REDIRECT` | `RedirectError` | Automatic navigation |
| _Any other_ | `GenericError` | Unexpected errors |

## TypeScript Exhaustiveness Checking

The `ErrorFallback` component uses TypeScript's exhaustiveness checking to ensure all error codes are handled:

```typescript
switch (code as typeof ERROR_CODES[keyof typeof ERROR_CODES]) {
  case ERROR_CODES.unauthorized:
    return <UnauthorizedError />
  case ERROR_CODES.forbidden:
    return <ForbiddenError resetErrorBoundary={resetErrorBoundary} />
  case ERROR_CODES.notFound:
    return <NotFoundError />
  case ERROR_CODES.redirect:
    return <RedirectError url={url} />
  default:
    // This will cause a TypeScript error if we miss any case
    assertNever(code as never)
}
```

If you add a new error code to `ERROR_CODES`, TypeScript will force you to add a corresponding case in the switch statement.

## Usage

### Basic Usage

The ErrorBoundary is already integrated at the root level:

```tsx
import { ErrorBoundary } from '@/features/error-handling'

<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

### Throwing Errors in Convex Functions

```typescript
import { unauthorized, forbidden, notFound, redirect } from '@/helpers/errors-helpers'

// User not logged in
throw unauthorized()

// User doesn't have permission
throw forbidden()

// Resource not found
throw notFound()

// Redirect to another page
throw redirect('/onboarding')
```

### Using the Error Handler Hook

```typescript
import { useErrorHandler } from 'react-error-boundary'

function MyComponent() {
  const handleError = useErrorHandler()

  const fetchData = async () => {
    try {
      const result = await someAsyncOperation()
      return result
    } catch (error) {
      handleError(error) // Triggers ErrorBoundary
    }
  }
}
```

## Adding New Error Types

1. **Add error code** to `convex/helpers/errors-helpers.ts`:
   ```typescript
   export const ERROR_CODES = {
     // ... existing codes
     maintenance: 'MAINTENANCE',
   }
   ```

2. **Create helper function**:
   ```typescript
   export function maintenance() {
     return new ConvexError(ERROR_CODES.maintenance)
   }
   ```

3. **Create component** at `src/features/error-handling/components/maintenance-error.tsx`:
   ```tsx
   export function MaintenanceError() {
     return <div>We're under maintenance...</div>
   }
   ```

4. **Add to switch statement** in `error-fallback.tsx`:
   ```typescript
   case ERROR_CODES.maintenance:
     return <MaintenanceError />
   ```

TypeScript will warn you if you forget step 4!

## Component Props

### ErrorFallback
- Uses `FallbackProps` from `react-error-boundary`
- Receives: `error`, `resetErrorBoundary`

### ForbiddenError, GenericError
- `resetErrorBoundary: () => void` - Function to reset error state

### RedirectError
- `url: string` - Destination URL for redirect

### UnauthorizedError, NotFoundError
- No props required

## Testing

Visit `/demo/error-boundary` to interactively test all error types.

## Integration

The ErrorBoundary is integrated in `src/routes/__root.tsx`:

```tsx
import { ErrorBoundary } from '@/features/error-handling'

<ErrorBoundary>
  <Header />
  <Outlet />
  {/* ... */}
</ErrorBoundary>
```

## Benefits

✅ **Type-Safe**: TypeScript ensures all error codes are handled  
✅ **Modular**: Each error type is a separate component  
✅ **Maintainable**: Single source of truth for error codes  
✅ **Testable**: Components can be tested in isolation  
✅ **Scalable**: Easy to add new error types  
✅ **Standard**: Uses industry-standard `react-error-boundary`  

## API Reference

### Exported from `@/features/error-handling`

- `ErrorBoundary` - Main wrapper component
- `ErrorFallback` - Error routing component
- `parseConvexError` - Utility function
- `ErrorCode` - TypeScript type
- `ParsedConvexError` - TypeScript type
