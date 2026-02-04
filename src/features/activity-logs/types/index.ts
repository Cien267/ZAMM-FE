import type { PaginationParams, BaseEntity } from '@/types'
import { z } from 'zod'

export interface ActivityLog extends BaseEntity {
  brokerId: string
  brokerName: string
  actionType: string
  entityType: string
  entityId: string
  description?: string
  metadata?: string
}

export interface ActivityLogQuery extends PaginationParams {
  brokerId?: string
}

export const CreateActivityLogSchema = z.object({
  brokerId: z.string().uuid('Broker ID is required'),
  brokerageId: z.string().uuid('Broker ID is required'),
  actionType: z
    .string()
    .min(1, 'Action type is required')
    .max(100, 'Action type must not exceed 100 characters'),
  entityType: z
    .string()
    .min(1, 'Entity type is required')
    .max(100, 'Entity type must not exceed 100 characters'),
  entityId: z.string().uuid('Entity ID is required'),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .optional(),
  metadata: z.string().optional(),
})

export type CreateActivityLogInput = z.infer<typeof CreateActivityLogSchema>
