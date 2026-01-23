import { useQuery } from '@tanstack/react-query'
import { lenderService } from '../services/lenderService'
import type { LenderQuery } from '../types'
import { lenderKeys } from '../constants'

export const useLendersQueries = () => {
  const useAllLenders = (query: LenderQuery) => {
    return useQuery({
      queryKey: lenderKeys.lendersList(query),
      queryFn: () => lenderService.getAllLenders(query),
    })
  }

  const useLendersList = (query: LenderQuery) => {
    return useQuery({
      queryKey: lenderKeys.lendersList(query),
      queryFn: () => lenderService.getLenders(query),
    })
  }

  const useLender = (id: string, enabled = true) => {
    return useQuery({
      queryKey: lenderKeys.lenderDetail(id),
      queryFn: () => lenderService.getLender(id),
      enabled: enabled && !!id,
    })
  }

  return {
    useAllLenders,
    useLendersList,
    useLender,
  }
}
