import { paginationOptsValidator } from 'convex/server'
import { v } from 'convex/values'
import { components } from './_generated/api'
import { query } from './_generated/server'
import { authComponent, createAuth } from './auth'
import { assertActiveOrganization } from './helpers/authHelpers'

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {

    const {
      organizationId,
    } = await assertActiveOrganization(await authComponent.getAuth(createAuth, ctx))
    // Fetch church members with pagination
    const searchTerm = args.search ?? ''
    console.log("searchTerm", searchTerm)
    console.log("organizationId", organizationId)
    const paginatedResults = await ctx.db
      .query('churchMembers')
      .withSearchIndex('byName', (q) =>
        q.search('name', searchTerm).eq('organizationId', organizationId),
      )
      .paginate(args.paginationOpts)

    console.log("paginatedResults", paginatedResults)

    const memberDetailsPromises = paginatedResults.page.map((churchMember) =>
      ctx.runQuery(components.betterAuth.auth.getMember, {
        memberId: churchMember.organizationMemberId,
        organizationId: organizationId,
      }),
    )

    const memberDetailsResults = await Promise.all(memberDetailsPromises)

    const fullUsers = paginatedResults.page
      .map((churchMember, index) => {
        const memberDetails = memberDetailsResults[index]
        if (!memberDetails) return null
        return {
          ...memberDetails,
          milestonesAchieved: churchMember.milestonesAchieved,
          name: churchMember.name,
          id: churchMember._id,
          memberSince: churchMember._creationTime,
        }
      })
      .filter(Boolean)

    return {
      ...paginatedResults,
      page: fullUsers,
    }
  },
})
