import { useQuery } from '@tanstack/react-query'
import { assetKeys } from '../constants'
import { assetService } from '../services/assetService'
import type { AssetQuery } from '../types'

export const useAssetQueries = () => {
  const useAllAssets = (query: AssetQuery) => {
    return useQuery({
      queryKey: assetKeys.list(query),
      queryFn: () => assetService.getAllAssets(query),
    })
  }

  const useAssetsList = (query: AssetQuery) => {
    return useQuery({
      queryKey: assetKeys.list(query),
      queryFn: () => assetService.getAssets(query),
    })
  }

  const useAsset = (id: string, enabled = true) => {
    return useQuery({
      queryKey: assetKeys.detail(id),
      queryFn: () => assetService.getAsset(id),
      enabled: enabled && !!id,
    })
  }

  return {
    useAllAssets,
    useAssetsList,
    useAsset,
  }
}
