// import api from "@/services/api"
// import { API_ENDPOINTS } from "@/services/endpoints"
// import type { ApiResponse } from "@/types/api.types"
// import type { Event } from "@/features/clients/types"

export const dashboardService = {
  async getUpcomingEvents(): Promise<Event[]> {
    return [
      {
        id: "1",
        name: "Sample Event",
        client: { id: "c1", name: "Sample Client" },
        date: "2024-01-01",
        note: "This is a sample event note.",
        file: "",
        status: "scheduled",
        details: "Details about the sample event.",
        broker: { id: "b1", name: "Sample Broker" },
      },
      {
        id: "2",
        name: "Another Event",
        client: { id: "c2", name: "Client Two" },
        date: "2024-01-15",
        note: "Second event note.",
        file: "",
        status: "pending",
        details: "More details.",
        broker: { id: "b2", name: "Broker Two" },
      },
    ];
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
    };
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
};
