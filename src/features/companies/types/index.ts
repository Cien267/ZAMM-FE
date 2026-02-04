import type { PaginationParams, BaseEntity } from '@/types'
import { z } from 'zod'
import { type Address, CreateAddressSchema } from '@/features/address/types'
import { type Person } from '@/features/people/types'

export type ClientType = 'people' | 'company'

export interface CompanyPerson extends BaseEntity {
  personId: string
  personName: string
}

export interface Company extends BaseEntity {
  name: string
  tradingName?: string
  type?: string
  abn?: string
  acn?: string
  registrationDate?: Date
  phoneWork?: string
  website?: string
  email?: string
  industry?: string
  actingOnTrust: boolean
  trustName?: string
  externalContactName?: string
  externalContactEmail?: string
  externalContactPhone?: string
  isContactExistingPerson: boolean
  brokerId: string
  brokerName?: string
  address?: Address
  companyPeople?: CompanyPerson[]
  contactPersonId: string | null
  referrerId: string | null
  contactPerson: Person | null
  referrer: Person | null
}

export interface CompanyQuery extends PaginationParams {
  name?: string
  tradingName?: string
  type?: string
  abn?: string
  acn?: string
  email?: string
  industry?: string
  brokerId?: string
}

const CompanyPersonSchema = z.object({
  personId: z.string().uuid('Please select a person'),
})

export const CreateCompanySchema = z.object({
  name: z
    .string()
    .min(1, 'Company name is required')
    .max(200, 'Name must not exceed 200 characters'),
  tradingName: z.string().max(200).optional().or(z.literal('')),
  type: z.string().max(100).optional().or(z.literal('')),
  abn: z
    .string()
    .regex(/^\d{11}$/, 'ABN must be 11 digits')
    .optional()
    .or(z.literal('')),
  acn: z
    .string()
    .regex(/^\d{9}$/, 'ACN must be 9 digits')
    .optional()
    .or(z.literal('')),
  registrationDate: z.date().optional(),
  phoneWork: z.string().max(20).optional().or(z.literal('')),
  website: z.string().url('Invalid URL').max(500).optional().or(z.literal('')),
  email: z
    .string()
    .email('Invalid email address')
    .max(256)
    .optional()
    .or(z.literal('')),
  industry: z.string().max(100).optional().or(z.literal('')),
  actingOnTrust: z.boolean(),
  trustName: z.string().max(200).optional().or(z.literal('')),
  externalContactName: z.string().max(200).optional().or(z.literal('')),
  externalContactEmail: z
    .string()
    .email('Invalid email address')
    .max(256)
    .optional()
    .or(z.literal('')),
  externalContactPhone: z.string().max(20).optional().or(z.literal('')),
  isContactExistingPerson: z.boolean(),
  contactPersonId: z.string().uuid().optional().nullable(),
  referrerId: z.string().uuid().optional().nullable(),
  brokerId: z.string().min(1, 'Broker is required'),
  addressText: z.string().optional(),
  address: CreateAddressSchema.optional(),
  companyPeople: z.array(CompanyPersonSchema).optional(),
})

export const UpdateCompanySchema = CreateCompanySchema.extend({
  id: z.string().uuid(),
})

export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>
export type UpdateCompanyInput = z.infer<typeof UpdateCompanySchema>
