import z from 'zod'

// Pagination metadata output schema
export const PaginationMetaSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
})

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>
// Utility function to create pagination metadata
export const createPaginationMeta = ({
  page,
  limit,
  total,
}: {
  page: number
  limit: number
  total: number
}): PaginationMeta => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
  hasNext: page < Math.ceil(total / limit),
  hasPrev: page > 1,
})
