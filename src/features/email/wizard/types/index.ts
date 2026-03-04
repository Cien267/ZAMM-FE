import type { BaseEntity } from '@/types'
import type { RecipientType } from '@/features/email/history/types'
import { z } from 'zod'

export type EmailPreviewBatchStatusType = 'Draft' | 'Approved' | 'Cancelled'

export interface EmailPreviewItem {
  id: string
  recipientId: string
  recipientEmail: string
  recipientType: RecipientType
  subjectRendered: string
  firmNameSnapshot: string
}

export interface EmailPreviewBatch extends BaseEntity {
  templateId: string
  templateName: string
  status: EmailPreviewBatchStatusType
  items: EmailPreviewItem[]
}

export const RecipientSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Recipient name is required'),
  email: z.string().email('Invalid email address'),
  type: z.enum(['Person', 'Company']),
})

export const CreateEmailPreviewBatchSchema = z.object({
  templateId: z.string().uuid(),
  firmId: z.string().uuid(),
  recipients: z.array(RecipientSchema),
})

export type CreateRecipientInput = z.infer<typeof RecipientSchema>
export type CreateEmailPreviewBatchInput = z.infer<
  typeof CreateEmailPreviewBatchSchema
>
