import { v } from 'convex/values'
import { internalMutation } from './_generated/server'

/**
 * Internal mutation to create a churchMember record.
 * This is called from the Better Auth organizationHooks.afterCreateOrganization hook.
 *
 * We need this as an internal mutation because Better Auth hooks run in an action context,
 * which doesn't have direct database access via ctx.db.
 */
export const createChurchMemberInternal = internalMutation({
  args: {
    organizationId: v.string(),
    organizationMemberId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("createChurchMemberInternal")
    await ctx.db.insert('churchMembers', {
      organizationId: args.organizationId,
      organizationMemberId: args.organizationMemberId,
      name: args.name,
      milestonesAchieved: [],
    })
  },
})

