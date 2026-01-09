import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { liabilityKeys } from '../constants'
import { sharedKeys } from '@/hooks/useSharedData'
import { reportKeys } from '@/features/reports/constants'
import { eventKeys } from '@/features/events/constants'
import { liabilityService } from '../services/liabilityService'
import type { CreateLiabilityInput, UpdateLiabilityInput } from '../types'

export const useLiabilities = () => {
  const queryClient = useQueryClient()

  const createLiabilityMutation = useMutation({
    mutationFn: (data: CreateLiabilityInput) =>
      liabilityService.createLiability(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: liabilityKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.liabilities })
      queryClient.invalidateQueries({ queryKey: reportKeys.report() })
      queryClient.invalidateQueries({ queryKey: eventKeys.events() })
      queryClient.invalidateQueries({
        queryKey: ['shared', 'liabilities-person'],
      })
      queryClient.invalidateQueries({
        queryKey: ['shared', 'liabilities-company'],
      })
      toast.success('Liability created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create liability')
      console.error('Create liability error:', error)
    },
  })

  const updateLiabilityMutation = useMutation({
    mutationFn: (data: UpdateLiabilityInput) =>
      liabilityService.updateLiability(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: liabilityKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.liabilities })
      queryClient.invalidateQueries({ queryKey: reportKeys.report() })
      queryClient.invalidateQueries({ queryKey: eventKeys.events() })
      queryClient.invalidateQueries({
        queryKey: ['shared', 'liabilities-person'],
      })
      queryClient.invalidateQueries({
        queryKey: ['shared', 'liabilities-company'],
      })
      queryClient.invalidateQueries({
        queryKey: liabilityKeys.detail(variables.id),
      })
      toast.success('Liability updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update liability')
      console.error('Update liability error:', error)
    },
  })

  const deleteLiabilityMutation = useMutation({
    mutationFn: (id: string) => liabilityService.deleteLiability(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: liabilityKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.liabilities })
      queryClient.invalidateQueries({ queryKey: reportKeys.report() })
      queryClient.invalidateQueries({
        queryKey: ['shared', 'liabilities-person'],
      })
      queryClient.invalidateQueries({
        queryKey: ['shared', 'liabilities-company'],
      })
      toast.success('Liability deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete liability')
      console.error('Delete liability error:', error)
    },
  })

  return {
    createLiability: createLiabilityMutation.mutate,
    createLiabilityAsync: createLiabilityMutation.mutateAsync,
    isCreatingLiability: createLiabilityMutation.isPending,
    createLiabilityError: createLiabilityMutation.error,

    updateLiability: updateLiabilityMutation.mutate,
    updateLiabilityAsync: updateLiabilityMutation.mutateAsync,
    isUpdatingLiability: updateLiabilityMutation.isPending,
    updateLiabilityError: updateLiabilityMutation.error,

    deleteLiability: deleteLiabilityMutation.mutate,
    deleteLiabilityAsync: deleteLiabilityMutation.mutateAsync,
    isDeletingLiability: deleteLiabilityMutation.isPending,
    deleteLiabilityError: deleteLiabilityMutation.error,
  }
}
