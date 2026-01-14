import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { loanKeys } from '../constants'
import { sharedKeys } from '@/hooks/useSharedData'
import { lenderKeys } from '@/features/lenders/constants'
import { loanService } from '../services/loanService'
import type { CreateLoanInput, UpdateLoanInput } from '../types'

export const useLoans = () => {
  const queryClient = useQueryClient()

  const createLoanMutation = useMutation({
    mutationFn: (data: CreateLoanInput) => loanService.createLoan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.loans() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.loans })
      queryClient.invalidateQueries({ queryKey: lenderKeys.all })
      toast.success('Loan created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create loan')
      console.error('Create loan error:', error)
    },
  })

  const updateLoanMutation = useMutation({
    mutationFn: (data: UpdateLoanInput) => loanService.updateLoan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.loans() })
      toast.success('Loan updated successfully!')
      queryClient.invalidateQueries({ queryKey: lenderKeys.all })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update loan')
      console.error('Update loan error:', error)
    },
  })

  const deleteLoanMutation = useMutation({
    mutationFn: (id: string) => loanService.deleteLoan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.loans() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.loans })
      queryClient.invalidateQueries({ queryKey: lenderKeys.all })
      toast.success('Loan deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete loan')
      console.error('Delete loan error:', error)
    },
  })

  return {
    createLoan: createLoanMutation.mutate,
    createLoanAsync: createLoanMutation.mutateAsync,
    isCreatingLoan: createLoanMutation.isPending,
    createLoanError: createLoanMutation.error,

    updateLoan: updateLoanMutation.mutate,
    updateLoanAsync: updateLoanMutation.mutateAsync,
    isUpdatingLoan: updateLoanMutation.isPending,
    updateLoanError: updateLoanMutation.error,

    deleteLoan: deleteLoanMutation.mutate,
    deleteLoanAsync: deleteLoanMutation.mutateAsync,
    isDeletingLoan: deleteLoanMutation.isPending,
    deleteLoanError: deleteLoanMutation.error,
  }
}
