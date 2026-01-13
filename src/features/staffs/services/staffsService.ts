import api from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  StaffQuery,
  CreateStaffInput,
  UpdateStaffInput,
  UpdateRolesInput,
} from '../types'
import type { User } from '@/features/auth/types/auth.types'
import type { PaginatedResponse } from '@/types'

export const staffService = {
  async getStaffs(query: StaffQuery): Promise<PaginatedResponse<User>> {
    const response = await api.get<ApiResponse<PaginatedResponse<User>>>(
      API_ENDPOINTS.USER.BASE,
      { params: query }
    )
    return response.data
  },

  async getStaff(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(
      API_ENDPOINTS.USER.DETAIL(id)
    )
    return response.data
  },

  async createStaff(data: CreateStaffInput): Promise<User> {
    const response = await api.post<ApiResponse<User>>(
      API_ENDPOINTS.USER.BASE,
      data
    )
    return response.data
  },

  async updateStaff(data: UpdateStaffInput): Promise<User> {
    const response = await api.put<ApiResponse<User>>(
      API_ENDPOINTS.USER.DETAIL(data.id),
      data
    )
    return response.data
  },

  async deleteStaff(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.USER.DETAIL(id))
  },

  async updateRoles(data: UpdateRolesInput): Promise<User> {
    const response = await api.put<ApiResponse<User>>(
      API_ENDPOINTS.USER.ROLES(data.id),
      data
    )
    return response.data
  },
}
