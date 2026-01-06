import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { companyKeys } from '../constants'
import { sharedKeys } from '@/hooks/useSharedData'
import { reportKeys } from '@/features/reports/constants'
import { companyService } from '../services/companyService'
import type { CreateCompanyInput, UpdateCompanyInput } from '../types'

export const useCompanies = () => {
  const queryClient = useQueryClient()

  const createCompanyMutation = useMutation({
    mutationFn: (data: CreateCompanyInput) =>
      companyService.createCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.companies() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.companies })
      queryClient.invalidateQueries({ queryKey: reportKeys.report() })
      toast.success('Company created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create company')
      console.error('Create company error:', error)
    },
  })

  const updateCompanyMutation = useMutation({
    mutationFn: (data: UpdateCompanyInput) =>
      companyService.updateCompany(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: companyKeys.companies() })
      queryClient.invalidateQueries({
        queryKey: companyKeys.companyDetail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: reportKeys.report() })
      toast.success('Company updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update company')
      console.error('Update company error:', error)
    },
  })

  const deleteCompanyMutation = useMutation({
    mutationFn: (id: string) => companyService.deleteCompany(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: companyKeys.companies() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.companies })
      queryClient.invalidateQueries({ queryKey: reportKeys.report() })
      toast.success('Company deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete company')
      console.error('Delete company error:', error)
    },
  })

  return {
    createCompany: createCompanyMutation.mutate,
    createCompanyAsync: createCompanyMutation.mutateAsync,
    isCreatingCompany: createCompanyMutation.isPending,
    createCompanyError: createCompanyMutation.error,

    updateCompany: updateCompanyMutation.mutate,
    updateCompanyAsync: updateCompanyMutation.mutateAsync,
    isUpdatingCompany: updateCompanyMutation.isPending,
    updateCompanyError: updateCompanyMutation.error,

    deleteCompany: deleteCompanyMutation.mutate,
    deleteCompanyAsync: deleteCompanyMutation.mutateAsync,
    isDeletingCompany: deleteCompanyMutation.isPending,
    deleteCompanyError: deleteCompanyMutation.error,
  }
}
