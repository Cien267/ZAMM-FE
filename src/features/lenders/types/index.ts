import type { BaseEntity, PaginationParams } from '@/types'
import { z } from 'zod'
import { VALIDATION } from '../constants'
import type { Loan } from '@/features/loans/types'

export interface Lender extends BaseEntity {
  name: string
  slug: string
  loans?: Loan[]
  logoUrl?: string
}

export interface LenderQuery extends PaginationParams {
  name?: string
  slug?: string
}

export const CreateLenderSchema = z.object({
  name: z
    .string()
    .min(1, 'Lender name is required')
    .max(
      VALIDATION.LENDER.NAME_MAX,
      `Name must not exceed ${VALIDATION.LENDER.NAME_MAX} characters`
    ),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(
      VALIDATION.LENDER.SLUG_MAX,
      `Slug must not exceed ${VALIDATION.LENDER.SLUG_MAX} characters`
    )
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens only'
    ),
  logoUrl: z.string().optional(),
})

export const UpdateLenderSchema = CreateLenderSchema.extend({
  id: z.string().uuid(),
})

export type CreateLenderInput = z.infer<typeof CreateLenderSchema>
export type UpdateLenderInput = z.infer<typeof UpdateLenderSchema>
