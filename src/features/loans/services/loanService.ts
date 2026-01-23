import api from '@/services/api'
import type { ApiResponse } from '@/types/api.types'
import type {
  Loan,
  LoanQuery,
  CreateLoanInput,
  UpdateLoanInput,
} from '../types'
import type { PaginatedResponse } from '@/types'
import { API_ENDPOINTS } from '@/services/endpoints'

export const loanService = {
  async getAllLoans(query: LoanQuery): Promise<Loan[]> {
    const response = await api.get<ApiResponse<Loan[]>>(
      API_ENDPOINTS.LOAN.ALL,
      { params: query }
    )
    return response.data
  },

  async getLoans(query: LoanQuery): Promise<PaginatedResponse<Loan>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Loan>>>(
      API_ENDPOINTS.LOAN.BASE,
      { params: query }
    )
    return response.data
  },

  async getLoan(id: string): Promise<Loan> {
    const response = await api.get<ApiResponse<Loan>>(
      API_ENDPOINTS.LOAN.DETAIL(id)
    )
    return response.data
  },

  async createLoan(data: CreateLoanInput): Promise<Loan> {
    const response = await api.post<ApiResponse<Loan>>(
      API_ENDPOINTS.LOAN.BASE,
      data
    )
    return response.data
  },

  async updateLoan(data: UpdateLoanInput): Promise<Loan> {
    const response = await api.put<ApiResponse<Loan>>(
      API_ENDPOINTS.LOAN.DETAIL(data.id),
      data
    )
    return response.data
  },

  async deleteLoan(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.LOAN.DETAIL(id))
  },
}
