import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { lenderKeys } from '../constants'
import { sharedKeys } from '@/hooks/useSharedData'
import { lenderService } from '../services/lenderService'
import type { CreateLenderInput, UpdateLenderInput } from '../types'

export const useLenders = () => {
  const queryClient = useQueryClient()

  const createLenderMutation = useMutation({
    mutationFn: (data: CreateLenderInput) => lenderService.createLender(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lenderKeys.lenders() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.lenders })
      toast.success('Lender created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create lender')
      console.error('Create lender error:', error)
    },
  })

  const updateLenderMutation = useMutation({
    mutationFn: (data: UpdateLenderInput) => lenderService.updateLender(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lenderKeys.lenders() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.lenders })
      toast.success('Lender updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update lender')
      console.error('Update lender error:', error)
    },
  })

  const deleteLenderMutation = useMutation({
    mutationFn: (id: string) => lenderService.deleteLender(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lenderKeys.lenders() })
      toast.success('Lender deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete lender')
      console.error('Delete lender error:', error)
    },
  })

  return {
    createLender: createLenderMutation.mutate,
    createLenderAsync: createLenderMutation.mutateAsync,
    isCreatingLender: createLenderMutation.isPending,
    createLenderError: createLenderMutation.error,

    updateLender: updateLenderMutation.mutate,
    updateLenderAsync: updateLenderMutation.mutateAsync,
    isUpdatingLender: updateLenderMutation.isPending,
    updateLenderError: updateLenderMutation.error,

    deleteLender: deleteLenderMutation.mutate,
    deleteLenderAsync: deleteLenderMutation.mutateAsync,
    isDeletingLender: deleteLenderMutation.isPending,
    deleteLenderError: deleteLenderMutation.error,
  }
}
