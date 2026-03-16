import api from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  EmailTemplate,
  EmailTemplateQuery,
  CreateEmailTemplateInput,
  UpdateEmailTemplateInput,
  TemplateVariableType,
} from '../types'
import type { PaginatedResponse } from '@/types'

export const emailTemplateService = {
  async getAllEmailTemplates(
    query: EmailTemplateQuery
  ): Promise<EmailTemplate[]> {
    const response = await api.get<ApiResponse<EmailTemplate[]>>(
      API_ENDPOINTS.EMAIL.TEMPLATES.ALL,
      { params: query }
    )
    return response.data
  },

  async getEmailTemplates(
    query: EmailTemplateQuery
  ): Promise<PaginatedResponse<EmailTemplate>> {
    const response = await api.get<
      ApiResponse<PaginatedResponse<EmailTemplate>>
    >(API_ENDPOINTS.EMAIL.TEMPLATES.BASE, { params: query })
    return response.data
  },

  async getEmailTemplate(id: string): Promise<EmailTemplate> {
    const response = await api.get<ApiResponse<EmailTemplate>>(
      API_ENDPOINTS.EMAIL.TEMPLATES.DETAIL(id)
    )
    return response.data
  },

  async createEmailTemplate(
    data: CreateEmailTemplateInput
  ): Promise<EmailTemplate> {
    const response = await api.post<ApiResponse<EmailTemplate>>(
      API_ENDPOINTS.EMAIL.TEMPLATES.BASE,
      data
    )
    return response.data
  },

  async updateEmailTemplate(
    data: UpdateEmailTemplateInput
  ): Promise<EmailTemplate> {
    const response = await api.put<ApiResponse<EmailTemplate>>(
      API_ENDPOINTS.EMAIL.TEMPLATES.DETAIL(data.id),
      data
    )
    return response.data
  },

  async deleteEmailTemplate(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.EMAIL.TEMPLATES.DETAIL(id))
  },

  async getEmailTemplateVariables(): Promise<TemplateVariableType> {
    const response = await api.get<ApiResponse<TemplateVariableType>>(
      API_ENDPOINTS.EMAIL.TEMPLATES.VARIABLES
    )
    return response.data
  },
}
