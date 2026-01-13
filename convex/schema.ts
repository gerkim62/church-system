import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  todos:defineTable({
    userId:v.id("user"),
    name:v.string()
  })
})
