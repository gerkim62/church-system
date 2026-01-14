import { v } from 'convex/values'
import { query } from './_generated/server'
import { paginationOptsValidator } from 'convex/server'
import { authComponent } from './auth'
import { Id } from './_generated/dataModel'

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Fetch church members with pagination
    const paginatedResults = await ctx.db
      .query('churchMembers')
      .filter((q) => q.eq(q.field('isVisitor'), false))
      .paginate(args.paginationOpts)

    const fullUsers: {
      _id: string
      _creationTime: number
      name: string
      email: string
      phoneNumber: string | null
      milestonesAchieved: Id<'milestones'>[]
      memberSince: number
      isVisitor: boolean
      organizationId: string
    }[] = []

    for (const member of paginatedResults.page) {
      const user = await authComponent.getAnyUserById(
        ctx,
        member.organizationMemberId,
      )
      if (!user) continue

      fullUsers.push({
        ...member,
        ...user,
        memberSince: member._creationTime,
        phoneNumber: user.phoneNumber ?? null,
      })
    }

    return {
      ...paginatedResults,
      page: fullUsers,
    }
  },
})
