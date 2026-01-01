import api from "@/services/api"
import type { ApiResponse } from "@/types/api.types"
import type {
  Liability,
  LiabilityQuery,
  CreateLiabilityInput,
  UpdateLiabilityInput,
} from "../types"
import type { PaginatedResponse } from "@/types"
import { API_ENDPOINTS } from "@/services/endpoints"

export const liabilityService = {
  async getLiabilities(
    query: LiabilityQuery
  ): Promise<PaginatedResponse<Liability>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Liability>>>(
        API_ENDPOINTS.LIABILITY.BASE,
        { params: query }
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getLiability(id: string): Promise<Liability> {
    try {
      const response = await api.get<ApiResponse<Liability>>(
        API_ENDPOINTS.LIABILITY.DETAIL(id)
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async createLiability(data: CreateLiabilityInput): Promise<Liability> {
    try {
      const response = await api.post<ApiResponse<Liability>>(
        API_ENDPOINTS.LIABILITY.BASE,
        data
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateLiability(data: UpdateLiabilityInput): Promise<Liability> {
    try {
      const response = await api.put<ApiResponse<Liability>>(
        API_ENDPOINTS.LIABILITY.DETAIL(data.id),
        data
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteLiability(id: string): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.LIABILITY.DETAIL(id))
    } catch (error) {
      throw error
    }
  },
}
