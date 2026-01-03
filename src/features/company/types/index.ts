import type { PaginationParams, BaseEntity } from '@/types'
// import { z } from 'zod'
// import { VALIDATION } from '../constants'
import type { Address, CreateAddressInput } from '@/features/address/types'

export type ClientType = 'people' | 'company'

// COMPANY
export interface CompanyPerson extends BaseEntity {
  personId: string
  personName: string
}
export interface CreateCompanyPersonInput {
  personId: string
}

export interface Company extends BaseEntity {
  name: string
  tradingName?: string
  type?: string
  abn?: string
  acn?: string
  registrationDate?: string
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

export interface CreateCompanyInput {
  name: string
  tradingName?: string
  type?: string
  abn?: string
  acn?: string
  registrationDate?: string
  phoneWork?: string
  website?: string
  email?: string
  industry?: string
  actingOnTrust?: boolean
  trustName?: string
  externalContactName?: string
  externalContactEmail?: string
  externalContactPhone?: string
  isContactExistingPerson?: boolean
  brokerId: string
  address?: CreateAddressInput
  companyPeople?: CreateCompanyPersonInput[]
}

export interface UpdateCompanyInput extends CreateCompanyInput {
  id: string
}
