import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { emailCategoryKeys } from '../constants'
import { sharedKeys } from '@/hooks/useSharedData'
import { emailCategoryService } from '../services/emailCategoriesService'
import type {
  CreateEmailCategoryInput,
  UpdateEmailCategoryInput,
} from '../types'

export const useEmailCategories = () => {
  const queryClient = useQueryClient()

  const createEmailCategoryMutation = useMutation({
    mutationFn: (data: CreateEmailCategoryInput) =>
      emailCategoryService.createEmailCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: emailCategoryKeys.emailCategories(),
      })
      queryClient.invalidateQueries({
        queryKey: sharedKeys.emailCategories({}),
      })
      toast.success('Email Category created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create emailCategory')
      console.error('Create Email Category error:', error)
    },
  })

  const updateEmailCategoryMutation = useMutation({
    mutationFn: (data: UpdateEmailCategoryInput) =>
      emailCategoryService.updateEmailCategory(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: emailCategoryKeys.emailCategories(),
      })
      queryClient.invalidateQueries({
        queryKey: emailCategoryKeys.emailCategoryDetail(variables.id),
      })
      queryClient.invalidateQueries({
        queryKey: sharedKeys.emailCategories({}),
      })
      toast.success('Email Category updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update emailCategory')
      console.error('Update Email Category error:', error)
    },
  })

  const deleteEmailCategoryMutation = useMutation({
    mutationFn: (id: string) => emailCategoryService.deleteEmailCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: emailCategoryKeys.emailCategories(),
      })
      queryClient.invalidateQueries({
        queryKey: sharedKeys.emailCategories({}),
      })
      toast.success('Email Category deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(
        error.message || 'Failed to toggleDismissEmailCategory emailCategory'
      )
      console.error('Delete Email Category error:', error)
    },
  })

  return {
    createEmailCategory: createEmailCategoryMutation.mutate,
    createEmailCategoryAsync: createEmailCategoryMutation.mutateAsync,
    isCreatingEmailCategory: createEmailCategoryMutation.isPending,
    createEmailCategoryError: createEmailCategoryMutation.error,

    updateEmailCategory: updateEmailCategoryMutation.mutate,
    updateEmailCategoryAsync: updateEmailCategoryMutation.mutateAsync,
    isUpdatingEmailCategory: updateEmailCategoryMutation.isPending,
    updateEmailCategoryError: updateEmailCategoryMutation.error,

    deleteEmailCategory: deleteEmailCategoryMutation.mutate,
    deleteEmailCategoryAsync: deleteEmailCategoryMutation.mutateAsync,
    isDeletingEmailCategory: deleteEmailCategoryMutation.isPending,
    deleteEmailCategoryError: deleteEmailCategoryMutation.error,
  }
}
