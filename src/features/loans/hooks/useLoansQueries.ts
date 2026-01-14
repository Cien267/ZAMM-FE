import { useQuery } from '@tanstack/react-query'
import { loanService } from '../services/loanService'
import type { LoanQuery } from '../types'
import { loanKeys } from '../constants'

export const useLoansQueries = () => {
  const useLoansList = (query: LoanQuery) => {
    return useQuery({
      queryKey: loanKeys.loansList(query),
      queryFn: () => loanService.getLoans(query),
    })
  }

  const usePerson = (id: string, enabled = true) => {
    return useQuery({
      queryKey: loanKeys.loanDetail(id),
      queryFn: () => loanService.getLoan(id),
      enabled: enabled && !!id,
    })
  }

  return {
    useLoansList,
    usePerson,
  }
}
