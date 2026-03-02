import api from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type { FirmEmailStatsQuery, SentEmail, SentEmailQuery } from '../types'
import type { PaginatedResponse } from '@/types'

export const sentEmailService = {
  async getSentEmails(
    query: SentEmailQuery
  ): Promise<PaginatedResponse<SentEmail>> {
    const response = await api.get<ApiResponse<PaginatedResponse<SentEmail>>>(
      API_ENDPOINTS.EMAIL.HISTORY.BASE,
      { params: query }
    )
    return response.data
  },

  async getSentEmail(id: string): Promise<SentEmail> {
    const response = await api.get<ApiResponse<SentEmail>>(
      API_ENDPOINTS.EMAIL.HISTORY.DETAIL(id)
    )
    return response.data
  },

  async resendEmail(id: string): Promise<void> {
    await api.post(API_ENDPOINTS.EMAIL.HISTORY.RESEND(id))
  },

  async getAnalytics(query: FirmEmailStatsQuery): Promise<any> {
    const response = await api.get<ApiResponse<any>>(
      API_ENDPOINTS.EMAIL.HISTORY.ANALYTICS,
      { params: query }
    )
    return response.data
  },
}
