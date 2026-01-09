import api from '@/services/api'
import type { ApiResponse } from '@/types/api.types'
import type {
  Brokerage,
  BrokerageQuery,
  CreateBrokerageInput,
  UpdateBrokerageInput,
} from '../types'
import type { PaginatedResponse } from '@/types'
import type { User } from '@/features/auth/types/auth.types'
import { API_ENDPOINTS } from '@/services/endpoints'

export const brokerageService = {
  async getBrokerages(
    query: BrokerageQuery
  ): Promise<PaginatedResponse<Brokerage>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Brokerage>>>(
      API_ENDPOINTS.BROKERAGE.BASE,
      { params: query }
    )
    return response.data
  },

  async getBrokerage(id: string): Promise<Brokerage> {
    const response = await api.get<ApiResponse<Brokerage>>(
      API_ENDPOINTS.BROKERAGE.DETAIL(id)
    )
    return response.data
  },

  async createBrokerage(data: CreateBrokerageInput): Promise<Brokerage> {
    const response = await api.post<ApiResponse<Brokerage>>(
      API_ENDPOINTS.BROKERAGE.BASE,
      data
    )
    return response.data
  },

  async updateBrokerage(data: UpdateBrokerageInput): Promise<Brokerage> {
    const response = await api.put<ApiResponse<Brokerage>>(
      API_ENDPOINTS.BROKERAGE.DETAIL(data.id),
      data
    )
    return response.data
  },

  async deleteBrokerage(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.BROKERAGE.DETAIL(id))
  },

  async getAllBrokers(brokerageId: string): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>(
      API_ENDPOINTS.BROKERAGE.GET_ALL_BROKERS(brokerageId)
    )
    return response.data
  },
}
