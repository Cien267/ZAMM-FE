import api from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  IReportSummary,
  PeopleReportQuery,
  CompanyReportQuery,
  AssetReportQuery,
  LiabilityReportQuery,
} from '../types'
import type { Person } from '@/features/people/types'
import type { Company } from '@/features/companies/types'
import type { Asset } from '@/features/assets/types'
import type { Liability } from '@/features/liabilities/types'

export const reportService = {
  async getReportSummary(): Promise<IReportSummary> {
    const response = await api.get<ApiResponse<IReportSummary>>(
      API_ENDPOINTS.REPORTS.SUMMARY
    )
    return response.data
  },

  async getPeopleReport(query: PeopleReportQuery): Promise<Person[]> {
    const response = await api.get<ApiResponse<Person[]>>(
      API_ENDPOINTS.REPORTS.PEOPLE,
      { params: query }
    )
    return response.data
  },

  async getCompanyReport(query: CompanyReportQuery): Promise<Company[]> {
    const response = await api.get<ApiResponse<Company[]>>(
      API_ENDPOINTS.REPORTS.COMPANIES,
      { params: query }
    )
    return response.data
  },

  async getAssetReport(query: AssetReportQuery): Promise<Asset[]> {
    const response = await api.get<ApiResponse<Asset[]>>(
      API_ENDPOINTS.REPORTS.ASSETS,
      { params: query }
    )
    return response.data
  },

  async getLiabilityReport(query: LiabilityReportQuery): Promise<Liability[]> {
    const response = await api.get<ApiResponse<Liability[]>>(
      API_ENDPOINTS.REPORTS.LIABILITIES,
      { params: query }
    )
    return response.data
  },
}
