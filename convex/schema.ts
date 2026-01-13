import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  milestones: defineTable({
    title: v.string(),
    description: v.optional(v.string()),

    organizationId: v.id('organizations'),
    assignedTo: v.array(v.id('members')),
  }),

  churchMembers: defineTable({
    organizationId: v.id('organizations'),
    organizationMemberId: v.id('organizationMembers'),
    
  }),
})
