import { z } from 'zod'
import type { BaseEntity, PaginationParams } from '@/types'

export interface EmailCategory extends BaseEntity {
  name: string
  description: string
  isActive: boolean
  brokerId?: string
  brokerName?: string
}

export interface EmailCategoryQuery extends PaginationParams {
  name?: string
  isActive?: string
  brokerId?: string
}

export const CreateEmailCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
})

export const UpdateEmailCategorySchema = CreateEmailCategorySchema.extend({
  id: z.string().uuid(),
})

export type CreateEmailCategoryInput = z.infer<typeof CreateEmailCategorySchema>
export type UpdateEmailCategoryInput = z.infer<typeof UpdateEmailCategorySchema>
