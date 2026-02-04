import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activityLogKeys } from '../constants'
import { activityLogService } from '../services/activityLogService'
import type { CreateActivityLogInput } from '../types'

export const useActivityLogs = () => {
  const queryClient = useQueryClient()

  const createActivityLogMutation = useMutation({
    mutationFn: (data: CreateActivityLogInput) =>
      activityLogService.createActivityLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: activityLogKeys.activityLogs(),
      })
    },
    onError: (error: any) => {
      console.error('Create activity log error:', error)
    },
  })

  const deleteActivityLogMutation = useMutation({
    mutationFn: (id: string) => activityLogService.deleteActivityLog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: activityLogKeys.activityLogs(),
      })
    },
    onError: (error: any) => {
      console.error('Delete activityLog error:', error)
    },
  })

  return {
    createActivityLog: createActivityLogMutation.mutate,
    createActivityLogAsync: createActivityLogMutation.mutateAsync,
    isCreatingActivityLog: createActivityLogMutation.isPending,
    createActivityLogError: createActivityLogMutation.error,

    deleteActivityLog: deleteActivityLogMutation.mutate,
    deleteActivityLogAsync: deleteActivityLogMutation.mutateAsync,
    isDeletingActivityLog: deleteActivityLogMutation.isPending,
    deleteActivityLogError: deleteActivityLogMutation.error,
  }
}
