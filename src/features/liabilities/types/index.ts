import type { BaseEntity, PaginationParams } from '@/types'
import { VALIDATION } from '../constants'
import { z } from 'zod'
import type { Loan } from '@/features/loans/types'

export interface LiabilityQuery extends PaginationParams {
  name?: string
  loanId?: string
  financePurpose?: string
  startDateFrom?: Date
  startDateTo?: Date
  personId?: string
  companyId?: string
}

export interface LiabilityPerson {
  id: string
  personId: string
  personName: string
  percent: number
}

export interface LiabilityCompany {
  id: string
  companyId: string
  companyName: string
  percent: number
}

export interface LiabilityAsset {
  id: string
  assetId: string
  assetName: string
}

export interface FixedRatePeriod {
  id: string
  startDate: string
  term: number
  customRate?: number
}

export interface Liability extends BaseEntity {
  name?: string
  loanTerm?: number
  interestOnlyTerm?: number
  startDate?: string
  financePurpose?: string
  amount?: number
  initialBalance?: number
  introRateYears?: number
  introRatePercent?: number
  repaymentAmount?: number
  repaymentFrequency?: string
  discountPercent?: number
  settlementRate?: number
  bankAccountName?: string
  bankAccountBsb?: string
  bankAccountNumber?: string
  offsetAccountBsb?: string
  offsetAccountNumber?: string
  loanId: string
  loan: Loan
  lenderName?: string
  liabilityPeople?: LiabilityPerson[]
  liabilityCompanies?: LiabilityCompany[]
  liabilityAssets?: LiabilityAsset[]
  fixedRatePeriods?: FixedRatePeriod[]
}

const LiabilityPersonSchema = z.object({
  personId: z.string().uuid('Please select a person'),
  percent: z
    .number()
    .min(0, 'Percentage must be at least 0')
    .max(100, 'Percentage cannot exceed 100'),
})

const LiabilityCompanySchema = z.object({
  companyId: z.string().uuid('Please select a company'),
  percent: z
    .number()
    .min(0, 'Percentage must be at least 0')
    .max(100, 'Percentage cannot exceed 100'),
})

const LiabilityAssetSchema = z.object({
  assetId: z.string().uuid('Please select an asset'),
})

const FixedRatePeriodSchema = z.object({
  startDate: z.string().min(1, 'Start date is required'),
  term: z.number(),
  customRate: z.number().optional().nullable(),
})

export const CreateLiabilitySchema = z.object({
  name: z
    .string()
    .max(
      VALIDATION.LIABILITY.NAME_MAX,
      `Name must not exceed ${VALIDATION.LIABILITY.NAME_MAX} characters`
    )
    .optional()
    .or(z.literal('')),

  loanTerm: z
    .number()
    .min(
      VALIDATION.LIABILITY.LOAN_TERM_MIN,
      `Loan term must be at least ${VALIDATION.LIABILITY.LOAN_TERM_MIN} month`
    )
    .max(
      VALIDATION.LIABILITY.LOAN_TERM_MAX,
      `Loan term cannot exceed ${VALIDATION.LIABILITY.LOAN_TERM_MAX} months`
    )
    .optional()
    .nullable(),

  interestOnlyTerm: z
    .number()
    .min(0, 'Interest only term must be positive')
    .max(
      VALIDATION.LIABILITY.INTEREST_ONLY_TERM_MAX,
      `Interest only term cannot exceed ${VALIDATION.LIABILITY.INTEREST_ONLY_TERM_MAX} months`
    )
    .optional()
    .nullable(),

  startDate: z.date().optional(),

  financePurpose: z
    .string()
    .max(VALIDATION.LIABILITY.FINANCE_PURPOSE_MAX)
    .optional()
    .or(z.literal('')),

  amount: z.number().optional().nullable(),

  initialBalance: z.number().optional().nullable(),

  introRateYears: z
    .number()
    .min(0, 'Intro rate years must be positive')
    .max(
      VALIDATION.LIABILITY.INTRO_RATE_YEARS_MAX,
      `Intro rate years cannot exceed ${VALIDATION.LIABILITY.INTRO_RATE_YEARS_MAX}`
    )
    .optional()
    .nullable(),

  introRatePercent: z.number().optional().nullable(),

  repaymentAmount: z.number().optional().nullable(),

  repaymentFrequency: z
    .string()
    .max(VALIDATION.LIABILITY.REPAYMENT_FREQUENCY_MAX)
    .optional()
    .or(z.literal('')),

  discountPercent: z.number().optional().nullable(),

  settlementRate: z.number().optional().nullable(),

  bankAccountName: z
    .string()
    .max(
      VALIDATION.LIABILITY.BANK_ACCOUNT_NAME_MAX,
      `Bank account name must not exceed ${VALIDATION.LIABILITY.BANK_ACCOUNT_NAME_MAX} characters`
    )
    .optional()
    .or(z.literal('')),

  bankAccountBsb: z
    .string()
    .max(
      VALIDATION.LIABILITY.BSB_MAX,
      `BSB must not exceed ${VALIDATION.LIABILITY.BSB_MAX} characters`
    )
    .regex(/^\d{0,6}$/, 'BSB must be 6 digits or less')
    .optional()
    .or(z.literal('')),

  bankAccountNumber: z
    .string()
    .max(
      VALIDATION.LIABILITY.ACCOUNT_NUMBER_MAX,
      `Account number must not exceed ${VALIDATION.LIABILITY.ACCOUNT_NUMBER_MAX} characters`
    )
    .optional()
    .or(z.literal('')),

  offsetAccountBsb: z
    .string()
    .max(
      VALIDATION.LIABILITY.BSB_MAX,
      `BSB must not exceed ${VALIDATION.LIABILITY.BSB_MAX} characters`
    )
    .regex(/^\d{0,6}$/, 'BSB must be 6 digits or less')
    .optional()
    .or(z.literal('')),

  offsetAccountNumber: z
    .string()
    .max(
      VALIDATION.LIABILITY.ACCOUNT_NUMBER_MAX,
      `Account number must not exceed ${VALIDATION.LIABILITY.ACCOUNT_NUMBER_MAX} characters`
    )
    .optional()
    .or(z.literal('')),

  loanId: z.string().uuid('Loan is required'),

  liabilityPeople: z.array(LiabilityPersonSchema).optional(),
  liabilityCompanies: z.array(LiabilityCompanySchema).optional(),
  liabilityAssets: z.array(LiabilityAssetSchema).optional(),
  fixedRatePeriods: z.array(FixedRatePeriodSchema).optional(),
})

export const UpdateLiabilitySchema = CreateLiabilitySchema.safeExtend({
  id: z.string().uuid(),
})

export type CreateLiabilityInput = z.infer<typeof CreateLiabilitySchema>
export type UpdateLiabilityInput = z.infer<typeof UpdateLiabilitySchema>
export type FixedRatePeriodInput = z.infer<typeof FixedRatePeriodSchema>
