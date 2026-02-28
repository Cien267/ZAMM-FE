import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { emailTemplateKeys } from '../constants'
import { emailTemplateService } from '../services/emailTemplatesService'
import type {
  CreateEmailTemplateInput,
  UpdateEmailTemplateInput,
} from '../types'

export const useEmailTemplates = () => {
  const queryClient = useQueryClient()

  const createEmailTemplateMutation = useMutation({
    mutationFn: (data: CreateEmailTemplateInput) =>
      emailTemplateService.createEmailTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: emailTemplateKeys.emailTemplates(),
      })
      toast.success('Email Template created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create emailTemplate')
      console.error('Create Email Template error:', error)
    },
  })

  const updateEmailTemplateMutation = useMutation({
    mutationFn: (data: UpdateEmailTemplateInput) =>
      emailTemplateService.updateEmailTemplate(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: emailTemplateKeys.emailTemplates(),
      })
      queryClient.invalidateQueries({
        queryKey: emailTemplateKeys.emailTemplateDetail(variables.id),
      })
      toast.success('Email Template updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update emailTemplate')
      console.error('Update Email Template error:', error)
    },
  })

  const deleteEmailTemplateMutation = useMutation({
    mutationFn: (id: string) => emailTemplateService.deleteEmailTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: emailTemplateKeys.emailTemplates(),
      })
      toast.success('Email Template deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(
        error.message || 'Failed to toggleDismissEmailTemplate emailTemplate'
      )
      console.error('Delete Email Template error:', error)
    },
  })

  return {
    createEmailTemplate: createEmailTemplateMutation.mutate,
    createEmailTemplateAsync: createEmailTemplateMutation.mutateAsync,
    isCreatingEmailTemplate: createEmailTemplateMutation.isPending,
    createEmailTemplateError: createEmailTemplateMutation.error,

    updateEmailTemplate: updateEmailTemplateMutation.mutate,
    updateEmailTemplateAsync: updateEmailTemplateMutation.mutateAsync,
    isUpdatingEmailTemplate: updateEmailTemplateMutation.isPending,
    updateEmailTemplateError: updateEmailTemplateMutation.error,

    deleteEmailTemplate: deleteEmailTemplateMutation.mutate,
    deleteEmailTemplateAsync: deleteEmailTemplateMutation.mutateAsync,
    isDeletingEmailTemplate: deleteEmailTemplateMutation.isPending,
    deleteEmailTemplateError: deleteEmailTemplateMutation.error,
  }
}
