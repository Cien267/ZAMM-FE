import { z } from 'zod'
import type { BaseEntity, PaginationParams } from '@/types'

export interface Note extends BaseEntity {
  text: string
  authorId: string
  authorName: string
  editedById?: string
  editedByName?: string
  liabilityId?: string
  liabilityName?: string
  eventId?: string
  eventTitle?: string
  personId?: string
  personName?: string
  companyId?: string
  companyName?: string
}

export interface NoteQuery extends PaginationParams {
  text?: string
  authorId?: string
  liabilityId?: string
  eventId?: string
  personId?: string
  companyId?: string
  createdFrom?: Date
  createdTo?: Date
}

export const CreateNoteSchema = z.object({
  text: z
    .string()
    .min(1, 'Note content is required')
    .max(500, 'Title must be less than 500 characters'),
  authorId: z.string().uuid().optional(),
  liabilityId: z.string().uuid().optional(),
  eventId: z.string().uuid().optional(),
  personId: z.string().uuid().optional(),
  companyId: z.string().uuid().optional(),
})

export const UpdateNoteSchema = CreateNoteSchema.extend({
  id: z.string().uuid(),
})

export type CreateNoteInput = z.infer<typeof CreateNoteSchema>
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>
