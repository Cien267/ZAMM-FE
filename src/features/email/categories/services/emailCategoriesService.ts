import api from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  EmailCategory,
  EmailCategoryQuery,
  CreateEmailCategoryInput,
  UpdateEmailCategoryInput,
} from '../types'
import type { PaginatedResponse } from '@/types'

export const emailCategoryService = {
  async getAllEmailCategories(
    query: EmailCategoryQuery
  ): Promise<EmailCategory[]> {
    const response = await api.get<ApiResponse<EmailCategory[]>>(
      API_ENDPOINTS.EMAIL.CATEGORIES.ALL,
      { params: query }
    )
    return response.data
  },

  async getEmailCategories(
    query: EmailCategoryQuery
  ): Promise<PaginatedResponse<EmailCategory>> {
    const response = await api.get<
      ApiResponse<PaginatedResponse<EmailCategory>>
    >(API_ENDPOINTS.EMAIL.CATEGORIES.BASE, { params: query })
    return response.data
  },

  async getEmailCategory(id: string): Promise<EmailCategory> {
    const response = await api.get<ApiResponse<EmailCategory>>(
      API_ENDPOINTS.EMAIL.CATEGORIES.DETAIL(id)
    )
    return response.data
  },

  async createEmailCategory(
    data: CreateEmailCategoryInput
  ): Promise<EmailCategory> {
    const response = await api.post<ApiResponse<EmailCategory>>(
      API_ENDPOINTS.EMAIL.CATEGORIES.BASE,
      data
    )
    return response.data
  },

  async updateEmailCategory(
    data: UpdateEmailCategoryInput
  ): Promise<EmailCategory> {
    const response = await api.put<ApiResponse<EmailCategory>>(
      API_ENDPOINTS.EMAIL.CATEGORIES.DETAIL(data.id),
      data
    )
    return response.data
  },

  async deleteEmailCategory(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.EMAIL.CATEGORIES.DETAIL(id))
  },
}
