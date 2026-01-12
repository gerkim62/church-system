import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'
import authSchema from './betterAuth/schema'

export default defineSchema({
  user: defineTable({
    ...authSchema.tables.user,
    
  })
})
