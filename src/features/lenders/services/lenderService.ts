import api from '@/services/api'
import type { ApiResponse } from '@/types/api.types'
import type {
  Lender,
  LenderQuery,
  CreateLenderInput,
  UpdateLenderInput,
} from '../types'
import type { PaginatedResponse } from '@/types'
import { API_ENDPOINTS } from '@/services/endpoints'

export const lenderService = {
  async getLenders(query: LenderQuery): Promise<PaginatedResponse<Lender>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Lender>>>(
      API_ENDPOINTS.LENDER.BASE,
      { params: query }
    )
    return response.data
  },

  async getLender(id: string): Promise<Lender> {
    const response = await api.get<ApiResponse<Lender>>(
      API_ENDPOINTS.LENDER.DETAIL(id)
    )
    return response.data
  },

  async createLender(data: CreateLenderInput): Promise<Lender> {
    const response = await api.post<ApiResponse<Lender>>(
      API_ENDPOINTS.LENDER.BASE,
      data
    )
    return response.data
  },

  async updateLender(data: UpdateLenderInput): Promise<Lender> {
    console.log([data])
    const response = await api.put<ApiResponse<Lender>>(
      API_ENDPOINTS.LENDER.DETAIL(data.id),
      data
    )
    return response.data
  },

  async deleteLender(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.LENDER.DETAIL(id))
  },
}
