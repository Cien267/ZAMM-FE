import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type {
  CreateEmailPreviewBatchInput,
  EmailPreviewBatchStatusType,
} from '../types'
import { emailPreviewBatchKeys } from '../constants'
import { sentEmailKeys } from '@/features/email/history/constants'
import { emailPreviewBatchService } from '../services/emailPreviewBatchService'

export const useEmailPreviewBatches = () => {
  const queryClient = useQueryClient()

  const createEmailPreviewBatchMutation = useMutation({
    mutationFn: (data: CreateEmailPreviewBatchInput) =>
      emailPreviewBatchService.createEmailPreviewBatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: emailPreviewBatchKeys.emailPreviewBatches(),
      })
      toast.success('Email preview created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create email preview')
      console.error('Create email preview batch error:', error)
    },
  })

  const updateEmailPreviewBatchStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: EmailPreviewBatchStatusType
    }) => emailPreviewBatchService.updateEmailPreviewBatchStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: emailPreviewBatchKeys.emailPreviewBatches(),
      })
      toast.success('Email preview batch status updated successfully!')
    },
    onError: (error: any) => {
      toast.error(
        error.message || 'Failed to update email preview batch status'
      )
      console.error('Update email preview batch status error:', error)
    },
  })

  const approveEmailPreviewBatchMutation = useMutation({
    mutationFn: (id: string) =>
      emailPreviewBatchService.approveEmailPreviewBatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: emailPreviewBatchKeys.emailPreviewBatches(),
      })
      queryClient.invalidateQueries({
        queryKey: sentEmailKeys.sentEmails(),
      })
      toast.success('Email preview approved!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to approve email preview')
      console.error('Approve email preview error:', error)
    },
  })

  const deleteEmailPreviewBatchMutation = useMutation({
    mutationFn: (id: string) =>
      emailPreviewBatchService.deleteEmailPreviewBatch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: emailPreviewBatchKeys.emailPreviewBatches(),
      })
      toast.success('Email preview deleted!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete email preview')
      console.error('Delete email preview batch error:', error)
    },
  })

  return {
    createEmailPreviewBatch: createEmailPreviewBatchMutation.mutate,
    createEmailPreviewBatchAsync: createEmailPreviewBatchMutation.mutateAsync,
    isCreatingEmailPreviewBatch: createEmailPreviewBatchMutation.isPending,
    createEmailPreviewBatchError: createEmailPreviewBatchMutation.error,

    updateEmailPreviewBatchStatus: updateEmailPreviewBatchStatusMutation.mutate,
    updateEmailPreviewBatchStatusAsync:
      updateEmailPreviewBatchStatusMutation.mutateAsync,
    isUpdatingEmailPreviewBatchStatus:
      updateEmailPreviewBatchStatusMutation.isPending,
    updateEmailPreviewBatchStatusError:
      updateEmailPreviewBatchStatusMutation.error,

    approveEmailPreviewBatch: approveEmailPreviewBatchMutation.mutate,
    approveEmailPreviewBatchAsync: approveEmailPreviewBatchMutation.mutateAsync,
    isApprovingEmailPreviewBatch: approveEmailPreviewBatchMutation.isPending,
    approveEmailPreviewBatchError: approveEmailPreviewBatchMutation.error,

    deleteEmailPreviewBatch: deleteEmailPreviewBatchMutation.mutate,
    deleteEmailPreviewBatchAsync: deleteEmailPreviewBatchMutation.mutateAsync,
    isDeletingEmailPreviewBatch: deleteEmailPreviewBatchMutation.isPending,
    deleteEmailPreviewBatchError: deleteEmailPreviewBatchMutation.error,
  }
}
