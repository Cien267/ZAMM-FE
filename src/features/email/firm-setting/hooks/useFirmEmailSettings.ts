import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { firmEmailSettingKeys } from '../constants'
import { firmEmailSettingService } from '../services/firmEmailSettingService'
import type {
  CreateFirmEmailSettingInput,
  TestSmtpConnectionInput,
  UpdateFirmEmailSettingInput,
} from '../types'

export const useFirmEmailSettings = () => {
  const queryClient = useQueryClient()

  const createFirmEmailSettingMutation = useMutation({
    mutationFn: (data: CreateFirmEmailSettingInput) =>
      firmEmailSettingService.createFirmEmailSetting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: firmEmailSettingKeys.firmEmailSettingDetailByBrokerage(),
      })
      toast.success('Firm Email Setting created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create Firm Email Setting')
      console.error('Create Firm Email Setting error:', error)
    },
  })

  const updateFirmEmailSettingMutation = useMutation({
    mutationFn: (data: UpdateFirmEmailSettingInput) =>
      firmEmailSettingService.updateFirmEmailSetting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: firmEmailSettingKeys.firmEmailSettingDetailByBrokerage(),
      })
      toast.success('Firm Email Setting updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update Firm Email Setting')
      console.error('Update Firm Email Setting error:', error)
    },
  })

  const deleteFirmEmailSettingMutation = useMutation({
    mutationFn: (id: string) =>
      firmEmailSettingService.deleteFirmEmailSetting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: firmEmailSettingKeys.firmEmailSettings(),
      })
      toast.success('Firm Email Setting deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete Firm Email Setting')
      console.error('Delete Firm Email Setting error:', error)
    },
  })

  const testSmtpConnectionSchema = useMutation({
    mutationFn: (data: TestSmtpConnectionInput) =>
      firmEmailSettingService.testSmtpConnection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: firmEmailSettingKeys.firmEmailSettings(),
      })
      toast.success('SMTP connection tested successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to test SMTP connection')
      console.error('Test SMTP connection error:', error)
    },
  })

  return {
    createFirmEmailSetting: createFirmEmailSettingMutation.mutate,
    createFirmEmailSettingAsync: createFirmEmailSettingMutation.mutateAsync,
    isCreatingFirmEmailSetting: createFirmEmailSettingMutation.isPending,
    createFirmEmailSettingError: createFirmEmailSettingMutation.error,

    updateFirmEmailSetting: updateFirmEmailSettingMutation.mutate,
    updateFirmEmailSettingAsync: updateFirmEmailSettingMutation.mutateAsync,
    isUpdatingFirmEmailSetting: updateFirmEmailSettingMutation.isPending,
    updateFirmEmailSettingError: updateFirmEmailSettingMutation.error,

    deleteFirmEmailSetting: deleteFirmEmailSettingMutation.mutate,
    deleteFirmEmailSettingAsync: deleteFirmEmailSettingMutation.mutateAsync,
    isDeletingFirmEmailSetting: deleteFirmEmailSettingMutation.isPending,
    deleteFirmEmailSettingError: deleteFirmEmailSettingMutation.error,

    testSmtpConnection: testSmtpConnectionSchema.mutate,
    testSmtpConnectionAsync: testSmtpConnectionSchema.mutateAsync,
    isTestingSmtpConnection: testSmtpConnectionSchema.isPending,
    testSmtpConnectionError: testSmtpConnectionSchema.error,
  }
}
