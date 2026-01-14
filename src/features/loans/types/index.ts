import type { BaseEntity, PaginationParams } from '@/types'
import { z } from 'zod'
import { VALIDATION } from '../constants'

export interface Loan extends BaseEntity {
  name: string
  lenderId: string
  lenderName: string
  interestRatesCount: number
  interestRates?: InterestRate[]
  liabilitiesCount: number
}

export interface LoanQuery extends PaginationParams {
  name?: string
  lenderId?: string
}

// Interest Rate types
export interface InterestRate extends BaseEntity {
  rateType: string
  rate: number
  loanId: string
}

const InterestRateSchema = z.object({
  rateType: z
    .string()
    .min(1, 'Rate type is required')
    .max(VALIDATION.INTEREST_RATE.RATE_TYPE_MAX),
  rate: z
    .number()
    .min(VALIDATION.INTEREST_RATE.RATE_MIN, 'Rate must be positive')
    .max(
      VALIDATION.INTEREST_RATE.RATE_MAX,
      `Rate cannot exceed ${VALIDATION.INTEREST_RATE.RATE_MAX}%`
    ),
})

export const CreateLoanSchema = z.object({
  name: z
    .string()
    .min(1, 'Loan name is required')
    .max(
      VALIDATION.LOAN.NAME_MAX,
      `Name must not exceed ${VALIDATION.LOAN.NAME_MAX} characters`
    ),
  lenderId: z.string().uuid('Lender is required'),
  interestRates: z.array(InterestRateSchema).optional(),
})

export const UpdateLoanSchema = CreateLoanSchema.extend({
  id: z.string().uuid(),
})

export type CreateLoanInput = z.infer<typeof CreateLoanSchema>
export type UpdateLoanInput = z.infer<typeof UpdateLoanSchema>
export type CreateInterestRateInput = z.infer<typeof InterestRateSchema>

export const BatchCreateLoanSchema = z.object({
  loans: z.array(CreateLoanSchema),
})
