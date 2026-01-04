import { useQuery } from '@tanstack/react-query'
import { brokerageService } from '../services/brokerageService'
import type { BrokerageQuery } from '../types'
import { brokeragesKeys } from '../constants'

export const useBrokeragesQueries = () => {
  const useBrokeragesList = (query: BrokerageQuery) => {
    return useQuery({
      queryKey: brokeragesKeys.brokeragesList(query),
      queryFn: () => brokerageService.getBrokerages(query),
    })
  }

  const useBrokerage = (id: string, enabled = true) => {
    return useQuery({
      queryKey: brokeragesKeys.brokerageDetail(id),
      queryFn: () => brokerageService.getBrokerage(id),
      enabled: enabled && !!id,
    })
  }

  return {
    useBrokeragesList,
    useBrokerage,
  }
}
