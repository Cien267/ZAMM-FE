import api from '@/services/api'
import type { ApiResponse } from '@/types/api.types'
import type {
  Brokerage,
  BrokerageQuery,
  CreateBrokerageInput,
  UpdateBrokerageInput,
  CreateBrokerageResult,
} from '../types'
import type { PaginatedResponse } from '@/types'
import type { User } from '@/features/auth/types/auth.types'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { Lender } from '@/features/lenders/types'

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

  async createBrokerage(
    data: CreateBrokerageInput
  ): Promise<CreateBrokerageResult> {
    const response = await api.post<ApiResponse<CreateBrokerageResult>>(
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

  async getLendersAssignedToBrokerage(brokerageId: string): Promise<Lender[]> {
    const response = await api.get<ApiResponse<Lender[]>>(
      API_ENDPOINTS.BROKERAGE.GET_LENDERS_ASSIGNED_TO_BROKERAGE(brokerageId)
    )
    return response.data
  },
}
