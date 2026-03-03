import api from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  EmailPreviewBatch,
  CreateEmailPreviewBatchInput,
  EmailPreviewBatchStatusType,
} from '../types'

export const emailPreviewBatchService = {
  async getEmailPreviewBatch(id: string): Promise<EmailPreviewBatch> {
    const response = await api.get<ApiResponse<EmailPreviewBatch>>(
      API_ENDPOINTS.EMAIL.PREVIEW_BATCH.DETAIL(id)
    )
    return response.data
  },

  async createEmailPreviewBatch(
    data: CreateEmailPreviewBatchInput
  ): Promise<EmailPreviewBatch> {
    const response = await api.post<ApiResponse<EmailPreviewBatch>>(
      API_ENDPOINTS.EMAIL.PREVIEW_BATCH.BASE,
      data
    )
    return response.data
  },

  async updateEmailPreviewBatchStatus(
    id: string,
    status: EmailPreviewBatchStatusType
  ): Promise<EmailPreviewBatch> {
    const response = await api.put<ApiResponse<EmailPreviewBatch>>(
      API_ENDPOINTS.EMAIL.PREVIEW_BATCH.DETAIL(id),
      { status }
    )
    return response.data
  },

  async approveEmailPreviewBatch(id: string): Promise<void> {
    await api.post(API_ENDPOINTS.EMAIL.PREVIEW_BATCH.APPROVE(id))
  },

  async deleteEmailPreviewBatch(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.EMAIL.PREVIEW_BATCH.DETAIL(id))
  },
}
