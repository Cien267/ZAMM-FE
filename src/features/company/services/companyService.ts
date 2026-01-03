import api from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  Company,
  CompanyQuery,
  CreateCompanyInput,
  UpdateCompanyInput,
} from '../types'
import type { PaginatedResponse } from '@/types'

export const companyService = {
  async getCompanies(query: CompanyQuery): Promise<PaginatedResponse<Company>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Company>>>(
      API_ENDPOINTS.COMPANIES.BASE,
      { params: query }
    )
    return response.data
  },

  async getCompany(id: string): Promise<Company> {
    const response = await api.get<ApiResponse<Company>>(
      API_ENDPOINTS.COMPANIES.DETAIL(id)
    )
    return response.data
  },

  async createCompany(data: CreateCompanyInput): Promise<Company> {
    const response = await api.post<ApiResponse<Company>>(
      API_ENDPOINTS.COMPANIES.BASE,
      data
    )
    return response.data
  },

  async updateCompany(data: UpdateCompanyInput): Promise<Company> {
    const response = await api.put<ApiResponse<Company>>(
      API_ENDPOINTS.COMPANIES.DETAIL(data.id),
      data
    )
    return response.data
  },

  async deleteCompany(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.COMPANIES.DETAIL(id))
  },
}
