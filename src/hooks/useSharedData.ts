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

export const sharedKeys = {
  people: ['shared', 'people'] as const,
  peopleByCompanyId: (id: string) => ['shared', 'people-company', id] as const,
  companies: ['shared', 'companies'] as const,
  assets: ['shared', 'assets'] as const,
  assetsByPersonId: (id: string) => ['shared', 'assets-person', id] as const,
  assetsByCompanyId: (id: string) => ['shared', 'assets-company', id] as const,
  liabilities: ['shared', 'liabilities'] as const,
  liabilitiesByPersonId: (id: string) =>
    ['shared', 'liabilities-person', id] as const,
  liabilitiesByCompanyId: (id: string) =>
    ['shared', 'liabilities-company', id] as const,
  brokers: ['shared', 'brokers'] as const,
  lenders: ['shared', 'lenders'] as const,
  loans: ['shared', 'loans'] as const,
  loansByLenderId: (id: string) => ['shared', 'loans-lender', id] as const,
  lendersAssignedToBrokerage: ['shared', 'brokers', 'lenders'] as const,
  emailCategories: ['shared', 'email-categories'] as const,
  emailTemplates: ['shared', 'email-templates'] as const,
}

export const useAllPeople = () => {
  return useQuery({
    queryKey: sharedKeys.people,
    queryFn: () => peopleService.getAllPeople({}),
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

export const useAllCompanies = () => {
  return useQuery({
    queryKey: sharedKeys.companies,
    queryFn: () => companyService.getAllCompanies({}),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllAssets = () => {
  return useQuery({
    queryKey: sharedKeys.assets,
    queryFn: () => assetService.getAllAssets({}),
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

export const useAllLiabilities = () => {
  return useQuery({
    queryKey: sharedKeys.liabilities,
    queryFn: () => liabilityService.getAllLiabilities({}),
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

export const useAllLenders = () => {
  return useQuery({
    queryKey: sharedKeys.lenders,
    queryFn: () => lenderService.getAllLenders({}),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllLoans = () => {
  return useQuery({
    queryKey: sharedKeys.loans,
    queryFn: () => loanService.getAllLoans({}),
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
    queryKey: sharedKeys.emailCategories,
    queryFn: () => emailCategoryService.getAllEmailCategories(params),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllEmailTemplates = (params: EmailTemplateQuery = {}) => {
  return useQuery({
    queryKey: sharedKeys.emailTemplates,
    queryFn: () => emailTemplateService.getAllEmailTemplates(params),
    staleTime: 5 * 60 * 1000,
  })
}
