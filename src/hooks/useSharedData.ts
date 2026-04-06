import { useQuery } from '@tanstack/react-query'
import { peopleService } from '@/features/people/services/peopleService'
import { companyService } from '@/features/companies/services/companyService'
import { assetService } from '@/features/assets/services/assetService'
import { liabilityService } from '@/features/liabilities/services/liabilityService'
import { lenderService } from '@/features/lenders/services/lenderService'
import { loanService } from '@/features/loans/services/loanService'
import { brokerageService } from '@/features/brokerages/services/brokerageService'
import { emailCategoryService } from '@/features/email/categories/services/emailCategoriesService'
import type { EmailCategoryQuery } from '@/features/email/categories/types'
import type { EmailTemplateQuery } from '@/features/email/templates/types'
import { emailTemplateService } from '@/features/email/templates/services/emailTemplatesService'
import type { LiabilityQuery } from '@/features/liabilities/types'
import type { AssetQuery } from '@/features/assets/types'
import type { CompanyQuery } from '@/features/companies/types'
import type { PersonQuery } from '@/features/people/types'
import type { LenderQuery } from '@/features/lenders/types'
import type { LoanQuery } from '@/features/loans/types'

export const sharedKeys = {
  people: (query: PersonQuery) => ['shared', 'people', query] as const,
  peopleByCompanyId: (id: string) => ['shared', 'people-company', id] as const,
  companies: (query: CompanyQuery) => ['shared', 'companies', query] as const,
  assets: (query: AssetQuery) => ['shared', 'assets', query] as const,
  assetsByPersonId: (id: string) => ['shared', 'assets-person', id] as const,
  assetsByCompanyId: (id: string) => ['shared', 'assets-company', id] as const,
  liabilities: (query: LiabilityQuery) =>
    ['shared', 'liabilities', query] as const,
  liabilitiesByPersonId: (id: string) =>
    ['shared', 'liabilities-person', id] as const,
  liabilitiesByCompanyId: (id: string) =>
    ['shared', 'liabilities-company', id] as const,
  brokers: ['shared', 'brokers'] as const,
  lenders: (query: LenderQuery) => ['shared', 'lenders', query] as const,
  loans: (query: LoanQuery) => ['shared', 'loans', query] as const,
  loansByLenderId: (id: string) => ['shared', 'loans-lender', id] as const,
  lendersAssignedToBrokerage: ['shared', 'brokers', 'lenders'] as const,
  emailCategories: (query: EmailCategoryQuery) =>
    ['shared', 'email-categories', query] as const,
  emailTemplates: (query: EmailTemplateQuery) =>
    ['shared', 'email-templates', query] as const,
}

export const useAllPeople = (query: PersonQuery) => {
  return useQuery({
    queryKey: sharedKeys.people(query),
    queryFn: () => peopleService.getAllPeople(query),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllPeopleByCompanyId = (id: string, enabled = true) => {
  return useQuery({
    queryKey: sharedKeys.peopleByCompanyId(id),
    queryFn: () => peopleService.getAllPeople({ companyId: id }),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!id,
  })
}

export const useAllCompanies = (query: CompanyQuery = {}) => {
  return useQuery({
    queryKey: sharedKeys.companies(query),
    queryFn: () => companyService.getAllCompanies(query),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllAssets = (query: AssetQuery = {}) => {
  return useQuery({
    queryKey: sharedKeys.assets(query),
    queryFn: () => assetService.getAllAssets(query),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllAssetsByPersonId = (id: string, enabled = true) => {
  return useQuery({
    queryKey: sharedKeys.assetsByPersonId(id),
    queryFn: () => assetService.getAllAssets({ personId: id }),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!id,
  })
}

export const useAllAssetsByCompanyId = (id: string, enabled = true) => {
  return useQuery({
    queryKey: sharedKeys.assetsByCompanyId(id),
    queryFn: () => assetService.getAllAssets({ companyId: id }),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!id,
  })
}

export const useAllLiabilities = (params: LiabilityQuery = {}) => {
  return useQuery({
    queryKey: sharedKeys.liabilities(params),
    queryFn: () => liabilityService.getAllLiabilities(params),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllLiabilitiesByPersonId = (id: string, enabled = true) => {
  return useQuery({
    queryKey: sharedKeys.liabilitiesByPersonId(id),
    queryFn: () => liabilityService.getAllLiabilities({ personId: id }),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!id,
  })
}

export const useAllLiabilitiesByCompanyId = (id: string, enabled = true) => {
  return useQuery({
    queryKey: sharedKeys.liabilitiesByCompanyId(id),
    queryFn: () => liabilityService.getAllLiabilities({ companyId: id }),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!id,
  })
}

export const useAllBrokers = (brokerageId: string) => {
  return useQuery({
    queryKey: sharedKeys.brokers,
    queryFn: () => brokerageService.getAllBrokers(brokerageId),
    staleTime: 5 * 60 * 1000,
  })
}

export const useLendersAssignedToBrokerage = (brokerageId: string) => {
  return useQuery({
    queryKey: sharedKeys.lendersAssignedToBrokerage,
    queryFn: () => brokerageService.getLendersAssignedToBrokerage(brokerageId),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllLenders = (query: LenderQuery = {}) => {
  return useQuery({
    queryKey: sharedKeys.lenders(query),
    queryFn: () => lenderService.getAllLenders(query),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllLoans = (query: LoanQuery = {}) => {
  return useQuery({
    queryKey: sharedKeys.loans(query),
    queryFn: () => loanService.getAllLoans(query),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllLoansByLenderId = (id: string, enabled = true) => {
  return useQuery({
    queryKey: sharedKeys.loansByLenderId(id),
    queryFn: () => loanService.getAllLoans({ lenderId: id }),
    staleTime: 5 * 60 * 1000,
    enabled: enabled && !!id,
  })
}

export const useAllEmailCategories = (params: EmailCategoryQuery = {}) => {
  return useQuery({
    queryKey: sharedKeys.emailCategories(params),
    queryFn: () => emailCategoryService.getAllEmailCategories(params),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllEmailTemplates = (params: EmailTemplateQuery = {}) => {
  return useQuery({
    queryKey: sharedKeys.emailTemplates(params),
    queryFn: () => emailTemplateService.getAllEmailTemplates(params),
    staleTime: 5 * 60 * 1000,
  })
}
