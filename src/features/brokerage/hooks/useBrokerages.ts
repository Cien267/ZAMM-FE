import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { brokeragesKeys } from '../constants'
import { authKeys } from '@/features/auth/hooks/useAuth'
import { brokerageService } from '../services/brokerageService'
import type { CreateBrokerageInput, UpdateBrokerageInput } from '../types'

export const useBrokerage = () => {
  const queryClient = useQueryClient()

  const createBrokerageMutation = useMutation({
    mutationFn: (data: CreateBrokerageInput) =>
      brokerageService.createBrokerage(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokeragesKeys.brokerages() })
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
      toast.success('Brokerage created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create brokerage')
      console.error('Create brokerage error:', error)
    },
  })

  const updateBrokerageMutation = useMutation({
    mutationFn: (data: UpdateBrokerageInput) =>
      brokerageService.updateBrokerage(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: brokeragesKeys.brokerages() })
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
      queryClient.invalidateQueries({
        queryKey: brokeragesKeys.brokerageDetail(variables.id),
      })
      toast.success('Brokerage updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update brokerage')
      console.error('Update brokerage error:', error)
    },
  })

  const deleteBrokerageMutation = useMutation({
    mutationFn: (id: string) => brokerageService.deleteBrokerage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokeragesKeys.brokerages() })
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
      toast.success('Brokerage deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete brokerage')
      console.error('Delete brokerage error:', error)
    },
  })

  return {
    createBrokerage: createBrokerageMutation.mutate,
    createBrokerageAsync: createBrokerageMutation.mutateAsync,
    isCreatingBrokerage: createBrokerageMutation.isPending,
    createBrokerageError: createBrokerageMutation.error,

    updateBrokerage: updateBrokerageMutation.mutate,
    updateBrokerageAsync: updateBrokerageMutation.mutateAsync,
    isUpdatingBrokerage: updateBrokerageMutation.isPending,
    updateBrokerageError: updateBrokerageMutation.error,

    deleteBrokerage: deleteBrokerageMutation.mutate,
    deleteBrokerageAsync: deleteBrokerageMutation.mutateAsync,
    isDeletingBrokerage: deleteBrokerageMutation.isPending,
    deleteBrokerageError: deleteBrokerageMutation.error,
  }
}
