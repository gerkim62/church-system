import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { components } from './_generated/api'
import { Id } from './_generated/dataModel'
import { query } from './_generated/server'

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const organizationId = '' as any
    // Fetch church members with pagination
    const searchTerm = args.search ?? ""
    const paginatedResults = await ctx.db
      .query('churchMembers')
      .withSearchIndex("byName", (q) =>
        q.search("name", searchTerm).eq("organizationId", organizationId)
      )
      .paginate(args.paginationOpts)

    const fullUsers: {
      email: string
      memberSince: number
      phoneNumber: string | null
      role: string,
      milestonesAchieved: Id<'milestones'>[],
      name: string,
      id: Id<'churchMembers'>,
    }[] = []

    for (const churchMember of paginatedResults.page) {
      const memberDetails = await ctx.runQuery(
        components.betterAuth.auth.getMember,
        {
          memberId: churchMember.organizationMemberId,
          organizationId: organizationId,
        },
      )
      if (memberDetails) {
        fullUsers.push({
          ...memberDetails,
          milestonesAchieved: churchMember.milestonesAchieved,
          name: churchMember.name,
          id: churchMember._id,
          memberSince: churchMember._creationTime,
        })
      }
    }

    return {
      ...paginatedResults,
      page: fullUsers,
    }
  },
})
