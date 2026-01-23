import api from '@/services/api'
import type { ApiResponse } from '@/types/api.types'
import type {
  Asset,
  AssetQuery,
  CreateAssetInput,
  UpdateAssetInput,
} from '../types'
import type { PaginatedResponse } from '@/types'
import { API_ENDPOINTS } from '@/services/endpoints'

export const assetService = {
  async getAllAssets(query: AssetQuery): Promise<Asset[]> {
    const response = await api.get<ApiResponse<Asset[]>>(
      API_ENDPOINTS.ASSET.ALL,
      { params: query }
    )
    return response.data
  },

  async getAssets(query: AssetQuery): Promise<PaginatedResponse<Asset>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Asset>>>(
      API_ENDPOINTS.ASSET.BASE,
      { params: query }
    )
    return response.data
  },

  async getAsset(id: string): Promise<Asset> {
    const response = await api.get<ApiResponse<Asset>>(
      API_ENDPOINTS.ASSET.DETAIL(id)
    )
    return response.data
  },

  async createAsset(data: CreateAssetInput): Promise<Asset> {
    const response = await api.post<ApiResponse<Asset>>(
      API_ENDPOINTS.ASSET.BASE,
      data
    )
    return response.data
  },

  async updateAsset(data: UpdateAssetInput): Promise<Asset> {
    const response = await api.put<ApiResponse<Asset>>(
      API_ENDPOINTS.ASSET.DETAIL(data.id),
      data
    )
    return response.data
  },

  async deleteAsset(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.ASSET.DETAIL(id))
  },
}
