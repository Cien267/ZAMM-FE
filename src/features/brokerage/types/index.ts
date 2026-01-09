import { z } from 'zod'
import type { BaseEntity, PaginationParams } from '@/types'

export interface BrokerageQuery extends PaginationParams {
  name?: string
  slug?: string
  IsMasterAccount?: boolean
}

export interface Brokerage extends BaseEntity {
  id: string
  name: string
  slug: string
  authorisedDomain?: string | null
  isMasterAccount: boolean
  logos?: { url: string }[]
  usersCount: number
  invitationsCount: number
}

export const CreateBrokerageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase, numbers, and hyphens only'
    ),
  authorisedDomain: z
    .string()
    .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid domain format')
    .optional()
    .or(z.literal('')),
  isMasterAccount: z.boolean(),
  logos: z
    .array(
      z.object({
        url: z.string().url('Must be a valid URL').optional(),
      })
    )
    .optional(),
})

export const UpdateBrokerageSchema = CreateBrokerageSchema.extend({
  id: z.string().uuid(),
})

export type CreateBrokerageInput = z.infer<typeof CreateBrokerageSchema>
export type UpdateBrokerageInput = z.infer<typeof UpdateBrokerageSchema>
