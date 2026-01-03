import { useQuery } from '@tanstack/react-query'
import { companyService } from '../services/companyService'
import type { CompanyQuery } from '../types'
import { companyKeys } from '../constants'

export const useCompanyQueries = () => {
  const useCompaniesList = (query: CompanyQuery) => {
    return useQuery({
      queryKey: companyKeys.companiesList(query),
      queryFn: () => companyService.getCompanies(query),
    })
  }

  const useCompany = (id: string, enabled = true) => {
    return useQuery({
      queryKey: companyKeys.companyDetail(id),
      queryFn: () => companyService.getCompany(id),
      enabled: enabled && !!id,
    })
  }

  return {
    useCompaniesList,
    useCompany,
  }
}
