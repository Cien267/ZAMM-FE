import api from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  FirmEmailSetting,
  CreateFirmEmailSettingInput,
  UpdateFirmEmailSettingInput,
  TestSmtpConnectionInput,
} from '../types'

export const firmEmailSettingService = {
  async getFirmEmailSettingByBrokerageId(
    brokerageId: string
  ): Promise<FirmEmailSetting> {
    const response = await api.get<ApiResponse<FirmEmailSetting>>(
      API_ENDPOINTS.EMAIL.FIRM_SETTING.DETAIL_BY_BROKERAGE(brokerageId)
    )
    return response.data
  },

  async createFirmEmailSetting(
    data: CreateFirmEmailSettingInput
  ): Promise<FirmEmailSetting> {
    const response = await api.post<ApiResponse<FirmEmailSetting>>(
      API_ENDPOINTS.EMAIL.FIRM_SETTING.BASE,
      data
    )
    return response.data
  },

  async updateFirmEmailSetting(
    data: UpdateFirmEmailSettingInput
  ): Promise<FirmEmailSetting> {
    const response = await api.put<ApiResponse<FirmEmailSetting>>(
      API_ENDPOINTS.EMAIL.FIRM_SETTING.DETAIL(data.id),
      data
    )
    return response.data
  },

  async deleteFirmEmailSetting(brokerageId: string): Promise<void> {
    await api.delete(
      API_ENDPOINTS.EMAIL.FIRM_SETTING.DETAIL_BY_BROKERAGE(brokerageId)
    )
  },

  async testSmtpConnection(data: TestSmtpConnectionInput): Promise<void> {
    await api.post(API_ENDPOINTS.EMAIL.FIRM_SETTING.TEST_CONNECTION, data)
  },
}
