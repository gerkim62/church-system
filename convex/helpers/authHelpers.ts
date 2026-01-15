import { APIError } from 'better-auth'
import { forbidden, redirect, unauthorized } from './errorHelpers'
import type { Statements } from 'better-auth/plugins'
import type { authComponent, createAuth } from '../auth'

// New type for auth context - must specify the generic to get correct return type
type AuthContext = Awaited<
  ReturnType<typeof authComponent.getAuth<typeof createAuth>>
>

export type StatementsInput = Partial<{
  [K in keyof Statements]: ReadonlyArray<Statements[K][number]>
}>

export async function assertAuthenticated(authCtx: AuthContext) {
  const session = await getServerSession(authCtx)

  if (!session) {
    throw unauthorized()
  }

  return session
}

export async function assertActiveOrganization(authCtx: AuthContext) {
  await assertAuthenticated(authCtx) // First: ensure authenticated
  const org = await getActiveMember(authCtx) // Then: get active member

  return org ?? handleNoActiveOrg(authCtx)
}

export async function assertPermitted({
  authCtx,
  statements,
}: {
  authCtx: AuthContext
  statements: StatementsInput
}) {
  // IMPORTANT: Assert active organization FIRST, before checking permissions
  // getHasPermission requires an active organization to be set
  const activeMember = await assertActiveOrganization(authCtx)

  const hasPermission = await getHasPermission({
    authCtx,
    statements: statements,
  })

  if (!hasPermission) {
    throw forbidden()
  }

  return activeMember
}

export const getServerSession = async (authCtx: AuthContext) => {
  console.log('getServerSession called')
  try {
    const { auth, headers } = authCtx

    const result = await auth.api.getSession({
      headers,
    })
    console.log('getServerSession result:', result)
    return result
  } catch (error) {
    console.error('Error getting server session:', error)
    throw error
  }
}

export const getHasPermission = async ({
  authCtx,
  statements,
}: {
  authCtx: AuthContext
  statements: StatementsInput
}) => {
  const { auth, headers } = authCtx
  const hasPermission = await auth.api.hasPermission({
    headers,
    body: {
      permissions: statements,
    },
  })

  return hasPermission.success
}

export const getActiveMember = async (authCtx: AuthContext) => {
  try {
    const { auth, headers } = authCtx
    const activeMember = await auth.api.getActiveMember({
      headers,
    })
    return activeMember
  } catch (error) {
    if (error instanceof APIError) {
      return null
    }
    throw error
  }
}

// Fetch organizations server-side
export const getOrganizations = async (authCtx: AuthContext) => {
  const { auth, headers } = authCtx
  const result = await auth.api.listOrganizations({ headers })
  return result ?? []
}

export async function handleNoActiveOrg(authCtx: AuthContext) {
  const { auth, headers } = authCtx
  const orgs = await getOrganizations(authCtx)

  console.log('handleNoActiveOrg found orgs:', orgs)

  // No organizations - redirect to create one
  if (orgs.length === 0) {
    console.log('No organizations found, redirecting to new hire shop modal')
   throw redirect(`/ob/no-church`)
  }

  // Single organization - automatically set it as active and refetch
  if (orgs.length === 1) {
    console.log('Single organization found, setting it as active')
    await auth.api.setActiveOrganization({
      body: { organizationId: orgs[0]?.id },
      headers,
    })

    const activeMember = await getActiveMember(authCtx)

    if (activeMember) {
      return activeMember
    }

    console.error(
      'Failed to set active organization. Redirecting to select organization',
    )
  }

  // Multiple organizations - let user choose
 throw redirect(`/ob/select-church`)
}

// USAGE EXAMPLE:
// In your handler/endpoint:
// const authCtx = await authComponent.getAuth( createAuth, ctx)
// await assertPermitted({ authCtx, statements: { user: ["read"] } });
