import { z } from 'zod'
import type { BaseEntity, PaginationParams } from '@/types'

export interface EmailTemplate extends BaseEntity {
  name: string
  subject: string
  bodyHtml: string
  categoryId: string
  categoryName: string
  isActive: boolean
  brokerId: string
  brokerName: string
}

export interface EmailTemplateQuery extends PaginationParams {
  name?: string
  isActive?: boolean
  brokerId?: string
  categoryId?: string
}

export const CreateEmailTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  subject: z.string().min(1, 'Subject is required'),
  bodyHtml: z.string().min(1, 'Email body is required'),
  categoryId: z.string().uuid('Please select an category'),
  isActive: z.boolean().optional(),
})

export const UpdateEmailTemplateSchema = CreateEmailTemplateSchema.extend({
  id: z.string().uuid(),
})

export type CreateEmailTemplateInput = z.infer<typeof CreateEmailTemplateSchema>
export type UpdateEmailTemplateInput = z.infer<typeof UpdateEmailTemplateSchema>
