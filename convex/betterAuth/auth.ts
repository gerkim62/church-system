import { createAuth } from '../auth'
import { query } from './_generated/server'
import { v } from 'convex/values'

// Export a static instance for Better Auth schema generation
// @ts-expect-error: https://labs.convex.dev/better-auth/features/local-install#:~:text=export%20const%20auth%20%3D%20createAuth(%7B%7D%20as%20any)
export const auth = createAuth({})

// Public query to get member details by memberId
export const getMember = query({
  args: { memberId: v.id('member'), organizationId: v.id('organizations') },
  async handler(ctx, args) {
    // Get member from the component's member table
    const member = await ctx.db
      .query('member')
      .filter((q) => q.eq(q.field('_id'), args.memberId))
      .filter((q) => q.eq(q.field('organizationId'), args.organizationId))
      .first()

    if (!member) {
      return null
    }

    // Get user details
    const user = await ctx.db
      .query('user')
      .filter((q) => q.eq(q.field('_id'), member.userId))
      .first()

    if (!user) {
      return null
    }

    return {
      email: user.email,
      phoneNumber: user.phoneNumber ?? null,
      role: member.role,
    }
  },
  returns: v.nullable(v.object({
    email: v.string(),
    phoneNumber: v.union(v.string(), v.null()),
    role: v.string(),
  })),
})

