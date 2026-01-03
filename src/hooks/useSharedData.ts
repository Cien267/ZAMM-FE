import { useQuery } from '@tanstack/react-query'
import { peopleService } from '@/features/people/services/peopleService'
import { companyService } from '@/features/company/services/companyService'
import { assetService } from '@/features/assets/services/assetService'
import { authService } from '@/features/auth/services/authService'
import { liabilityService } from '@/features/liabilities/services/liabilityService'
import { lenderService } from '@/features/lenders/services/lenderService'
import { loanService } from '@/features/lenders/services/loanService'

export const sharedKeys = {
  people: ['shared', 'people'] as const,
  companies: ['shared', 'companies'] as const,
  assets: ['shared', 'assets'] as const,
  liabilities: ['shared', 'liabilities'] as const,
  users: ['shared', 'users'] as const,
  lenders: ['shared', 'lenders'] as const,
  loans: ['shared', 'loans'] as const,
}

export const useAllPeople = () => {
  return useQuery({
    queryKey: sharedKeys.people,
    queryFn: () => peopleService.getPeople({ pageSize: 1000 }),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllCompanies = () => {
  return useQuery({
    queryKey: sharedKeys.companies,
    queryFn: () => companyService.getCompanies({ pageSize: 1000 }),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllAssets = () => {
  return useQuery({
    queryKey: sharedKeys.assets,
    queryFn: () => assetService.getAssets({ pageSize: 1000 }),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllLiabilities = () => {
  return useQuery({
    queryKey: sharedKeys.liabilities,
    queryFn: () => liabilityService.getLiabilities({ pageSize: 1000 }),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllUsers = () => {
  return useQuery({
    queryKey: sharedKeys.users,
    queryFn: () => authService.getAllUser(),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllLenders = () => {
  return useQuery({
    queryKey: sharedKeys.lenders,
    queryFn: () => lenderService.getLenders({ pageSize: 1000 }),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAllLoans = () => {
  return useQuery({
    queryKey: sharedKeys.loans,
    queryFn: () => loanService.getLoans({ pageSize: 1000 }),
    staleTime: 5 * 60 * 1000,
  })
}
