import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  milestones: defineTable({
    title: v.string(),
    description: v.optional(v.string()),

    organizationId: v.string(),
  }),

  churchMembers: defineTable({
    organizationId: v.string(),
    organizationMemberId: v.string(),
    name: v.string(),
    milestonesAchieved: v.array(v.id('milestones')),
  }).searchIndex('byName', {
    searchField: 'name',
    filterFields: ['organizationId'],
  }),
})
