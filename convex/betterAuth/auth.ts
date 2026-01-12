import { createAuth } from '../auth'

// Export a static instance for Better Auth schema generation
// @ts-expect-error: https://labs.convex.dev/better-auth/features/local-install#:~:text=export%20const%20auth%20%3D%20createAuth(%7B%7D%20as%20any)
export const auth = createAuth({})