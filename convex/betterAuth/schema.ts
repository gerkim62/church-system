import { defineSchema } from 'convex/server'
import { tables } from './generatedSchema'

const schema = defineSchema({
  ...tables,
  // Add custom indexes that persist across schema regeneration
  user: tables.user,
  member: tables.member.index('organizationId_userId', [
    'organizationId',
    'userId',
  ]),
})

export default schema
