import api from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  ActivityLog,
  ActivityLogQuery,
  CreateActivityLogInput,
} from '../types'
import type { PaginatedResponse } from '@/types'

export const activityLogService = {
  async getAllActivityLogs(query: ActivityLogQuery): Promise<ActivityLog[]> {
    const response = await api.get<ApiResponse<ActivityLog[]>>(
      API_ENDPOINTS.ACTIVITY_LOGS.ALL,
      { params: query }
    )
    return response.data
  },

  async getListActivityLogs(
    query: ActivityLogQuery
  ): Promise<PaginatedResponse<ActivityLog>> {
    const response = await api.get<ApiResponse<PaginatedResponse<ActivityLog>>>(
      API_ENDPOINTS.ACTIVITY_LOGS.BASE,
      { params: query }
    )
    return response.data
  },

  async createActivityLog(data: CreateActivityLogInput): Promise<ActivityLog> {
    const response = await api.post<ApiResponse<ActivityLog>>(
      API_ENDPOINTS.ACTIVITY_LOGS.BASE,
      data
    )
    return response.data
  },

  async deleteActivityLog(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.ACTIVITY_LOGS.DETAIL(id))
  },
}
