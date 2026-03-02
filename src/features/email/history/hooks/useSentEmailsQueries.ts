import { useQuery } from '@tanstack/react-query'
import { sentEmailService } from '../services/sentEmailService'
import type { FirmEmailStatsQuery, SentEmailQuery } from '../types'
import { sentEmailKeys } from '../constants'

export const useSentEmailQueries = () => {
  const useSentEmailsList = (query: SentEmailQuery) => {
    return useQuery({
      queryKey: sentEmailKeys.sentEmailsList(query),
      queryFn: () => sentEmailService.getSentEmails(query),
    })
  }

  const useSentEmail = (id: string, enabled = true) => {
    return useQuery({
      queryKey: sentEmailKeys.sentEmailDetail(id),
      queryFn: () => sentEmailService.getSentEmail(id),
      enabled: enabled && !!id,
    })
  }

  const useSentEmailAnalytics = (query: FirmEmailStatsQuery) => {
    return useQuery({
      queryKey: sentEmailKeys.sentEmailsList(query),
      queryFn: () => sentEmailService.getAnalytics(query),
    })
  }

  return {
    useSentEmailsList,
    useSentEmail,
    useSentEmailAnalytics,
  }
}
