import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { assetKeys } from '../constants'
import { sharedKeys } from '@/hooks/useSharedData'
import { reportKeys } from '@/features/reports/constants'
import { assetService } from '../services/assetService'
import type { CreateAssetInput, UpdateAssetInput } from '../types'

export const useAssets = () => {
  const queryClient = useQueryClient()

  const createAssetMutation = useMutation({
    mutationFn: (data: CreateAssetInput) => assetService.createAsset(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.assets })
      queryClient.invalidateQueries({ queryKey: ['shared', 'assets-person'] })
      queryClient.invalidateQueries({ queryKey: ['shared', 'assets-company'] })
      queryClient.invalidateQueries({ queryKey: reportKeys.report() })
      toast.success('Asset created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create asset')
      console.error('Create asset error:', error)
    },
  })

  const updateAssetMutation = useMutation({
    mutationFn: (data: UpdateAssetInput) => assetService.updateAsset(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: assetKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.assets })
      queryClient.invalidateQueries({ queryKey: ['shared', 'assets-person'] })
      queryClient.invalidateQueries({ queryKey: ['shared', 'assets-company'] })
      queryClient.invalidateQueries({ queryKey: reportKeys.report() })
      queryClient.invalidateQueries({
        queryKey: assetKeys.detail(variables.id),
      })
      toast.success('Asset updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update asset')
      console.error('Update asset error:', error)
    },
  })

  const deleteAssetMutation = useMutation({
    mutationFn: (id: string) => assetService.deleteAsset(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assetKeys.lists() })
      queryClient.invalidateQueries({ queryKey: sharedKeys.assets })
      queryClient.invalidateQueries({ queryKey: ['shared', 'assets-person'] })
      queryClient.invalidateQueries({ queryKey: ['shared', 'assets-company'] })
      queryClient.invalidateQueries({ queryKey: reportKeys.report() })
      toast.success('Asset deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete asset')
      console.error('Delete asset error:', error)
    },
  })

  return {
    createAsset: createAssetMutation.mutate,
    createAssetAsync: createAssetMutation.mutateAsync,
    isCreatingAsset: createAssetMutation.isPending,
    createAssetError: createAssetMutation.error,

    updateAsset: updateAssetMutation.mutate,
    updateAssetAsync: updateAssetMutation.mutateAsync,
    isUpdatingAsset: updateAssetMutation.isPending,
    updateAssetError: updateAssetMutation.error,

    deleteAsset: deleteAssetMutation.mutate,
    deleteAssetAsync: deleteAssetMutation.mutateAsync,
    isDeletingAsset: deleteAssetMutation.isPending,
    deleteAssetError: deleteAssetMutation.error,
  }
}
