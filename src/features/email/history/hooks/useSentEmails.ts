import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { sentEmailKeys } from '../constants'
import { sentEmailService } from '../services/sentEmailService'

export const useSentEmails = () => {
  const queryClient = useQueryClient()

  const resendEmailMutation = useMutation({
    mutationFn: (id: string) => sentEmailService.resendEmail(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sentEmailKeys.sentEmails(),
      })
      toast.success('Email resent!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to resend email')
      console.error('Resend email error:', error)
    },
  })

  return {
    resendEmail: resendEmailMutation.mutate,
    resendEmailAsync: resendEmailMutation.mutateAsync,
    isResendingEmail: resendEmailMutation.isPending,
    resendEmailError: resendEmailMutation.error,
  }
}
