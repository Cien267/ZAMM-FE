import { useQuery } from '@tanstack/react-query'
import { activityLogService } from '../services/activityLogService'
import type { ActivityLogQuery } from '../types'
import { activityLogKeys } from '../constants'

export const useActivityLogQueries = () => {
  const useAllActivityLogs = (query: ActivityLogQuery) => {
    return useQuery({
      queryKey: activityLogKeys.activityLogsList(query),
      queryFn: () => activityLogService.getAllActivityLogs(query),
    })
  }

  const useActivityLogList = (query: ActivityLogQuery) => {
    return useQuery({
      queryKey: activityLogKeys.activityLogsList(query),
      queryFn: () => activityLogService.getListActivityLogs(query),
    })
  }

  return {
    useAllActivityLogs,
    useActivityLogList,
  }
}
