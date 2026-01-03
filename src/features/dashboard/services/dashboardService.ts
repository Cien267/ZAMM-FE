// import api from "@/services/api"
// import { API_ENDPOINTS } from "@/services/endpoints"
// import type { ApiResponse } from "@/types/api.types"
// import type { Event } from "@/features/events/types"

export const dashboardService = {
  async getUpcomingEvents(): Promise<any[]> {
    return []
    // try {
    //   const response = await api.get<ApiResponse<Event[]>>(
    //     API_ENDPOINTS.DASHBOARD.UPCOMING_EVENTS
    //   )
    //   return response.data ?? []
    // } catch (error) {
    //   throw error
    // }
  },

  async getLoanBook(): Promise<any> {
    return {
      totalValue: 100,
      loanCount: 100,
      clientCount: 100,
    }
    // try {
    //   const response = await api.get<ApiResponse<any>>(
    //     API_ENDPOINTS.DASHBOARD.LOAN_BOOK
    //   )
    //   return response.data
    // } catch (error) {
    //   throw error
    // }
  },

  async getInterestRates(): Promise<any> {
    // try {
    //   const response = await api.get<ApiResponse<any>>(
    //     API_ENDPOINTS.DASHBOARD.INTEREST_RATES
    //   )
    //   return response.data || []
    // } catch (error) {
    //   throw error
    // }
  },
}
