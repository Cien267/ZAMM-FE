import api from "@/services/api"
import type { ApiResponse } from "@/types/api.types"
import type {
  Asset,
  AssetQuery,
  CreateAssetInput,
  UpdateAssetInput,
} from "../types"
import type { PaginatedResponse } from "@/types"
import { API_ENDPOINTS } from "@/services/endpoints"

export const assetService = {
  async getAssets(query: AssetQuery): Promise<PaginatedResponse<Asset>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Asset>>>(
        API_ENDPOINTS.ASSET.BASE,
        { params: query }
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getAsset(id: string): Promise<Asset> {
    try {
      const response = await api.get<ApiResponse<Asset>>(
        API_ENDPOINTS.ASSET.DETAIL(id)
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async createAsset(data: CreateAssetInput): Promise<Asset> {
    try {
      const response = await api.post<ApiResponse<Asset>>(
        API_ENDPOINTS.ASSET.BASE,
        data
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateAsset(data: UpdateAssetInput): Promise<Asset> {
    try {
      const response = await api.put<ApiResponse<Asset>>(
        API_ENDPOINTS.ASSET.DETAIL(data.id),
        data
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteAsset(id: string): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.ASSET.DETAIL(id))
    } catch (error) {
      throw error
    }
  },
}
