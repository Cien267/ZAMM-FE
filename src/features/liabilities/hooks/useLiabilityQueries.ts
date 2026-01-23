import { useQuery } from '@tanstack/react-query'
import { liabilityKeys } from '../constants'
import { liabilityService } from '../services/liabilityService'
import type { LiabilityQuery } from '../types'

export const useLiabilityQueries = () => {
  const useAllLiabilities = (query: LiabilityQuery) => {
    return useQuery({
      queryKey: liabilityKeys.list(query),
      queryFn: () => liabilityService.getAllLiabilities(query),
    })
  }

  const useLiabilitiesList = (query: LiabilityQuery) => {
    return useQuery({
      queryKey: liabilityKeys.list(query),
      queryFn: () => liabilityService.getLiabilities(query),
    })
  }

  const useLiability = (id: string, enabled = true) => {
    return useQuery({
      queryKey: liabilityKeys.detail(id),
      queryFn: () => liabilityService.getLiability(id),
      enabled: enabled && !!id,
    })
  }

  return {
    useAllLiabilities,
    useLiabilitiesList,
    useLiability,
  }
}
