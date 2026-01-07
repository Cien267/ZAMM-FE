import { z } from 'zod'
import type { BaseEntity, PaginationParams } from '@/types'

export interface EventFile {
  id: string
  eventId: string
  fileName: string
  fileUrl: string
  fileSize?: number
  fileType?: string
  uploadedAt?: string
}

export const EventFileSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileUrl: z.string().url('Invalid file URL'),
})

export type EventFileInput = z.infer<typeof EventFileSchema>

export interface Event extends BaseEntity {
  title: string
  description?: string
  type: string
  date: Date
  isSystem: boolean
  isRepeating: boolean
  repeatNumber?: number
  repeatUnit?: string
  isDismissed: boolean
  repeatingDateDismissed?: Date
  modifiedValuesJson?: string
  modifiedValuesObject?: string
  addedByUserId: string
  addedByUserName?: string
  liabilityId?: string
  liabilityName?: string
  personId?: string
  personName?: string
  companyId?: string
  companyName?: string
  files?: EventFile[]
}

export interface EventQuery extends PaginationParams {
  title?: string
  type?: string
  dateFrom?: Date | string
  dateTo?: Date | string
  isSystem?: boolean
  isRepeating?: boolean
  isDismissed?: boolean
  addedByUserId?: string
  liabilityId?: string
  personId?: string
  companyId?: string
}

export const CreateEventSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(500, 'Title must be less than 500 characters'),
  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),
  type: z.string().min(1, 'Type is required'),
  date: z.date({ message: 'Date is required' }),
  isSystem: z.boolean().optional(),
  isRepeating: z.boolean().optional(),
  repeatNumber: z.number().min(1).optional().nullable(),
  repeatUnit: z.string().optional(),
  isDismissed: z.boolean().optional(),
  repeatingDateDismissed: z.date().optional(),
  modifiedValuesJson: z.string().optional(),
  modifiedValuesObject: z.string().optional(),
  addedByUserId: z.string().uuid(),
  liabilityId: z.string().uuid().optional(),
  personId: z.string().uuid().optional(),
  companyId: z.string().uuid().optional(),
  files: z.any().optional(),
})

export const UpdateEventSchema = CreateEventSchema.extend({
  id: z.string().uuid(),
})

export type CreateEventInput = z.infer<typeof CreateEventSchema>
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>
