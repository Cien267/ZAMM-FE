import api from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  Event,
  EventQuery,
  CreateEventInput,
  UpdateEventInput,
} from '../types'
import type { PaginatedResponse } from '@/types'

export const eventService = {
  async getAllEvents(query: EventQuery): Promise<Event[]> {
    const response = await api.get<ApiResponse<Event[]>>(
      API_ENDPOINTS.EVENT.ALL,
      { params: query }
    )
    return response.data
  },

  async getEvents(query: EventQuery): Promise<PaginatedResponse<Event>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Event>>>(
      API_ENDPOINTS.EVENT.BASE,
      { params: query }
    )
    return response.data
  },

  async getEvent(id: string): Promise<Event> {
    const response = await api.get<ApiResponse<Event>>(
      API_ENDPOINTS.EVENT.DETAIL(id)
    )
    return response.data
  },

  async createEvent(data: CreateEventInput): Promise<Event> {
    data.files = [] // TODO: Remove this line when file upload is implemented
    const response = await api.post<ApiResponse<Event>>(
      API_ENDPOINTS.EVENT.BASE,
      data
    )
    return response.data
  },

  async updateEvent(data: UpdateEventInput): Promise<Event> {
    data.files = [] // TODO: Remove this line when file upload is implemented
    const response = await api.put<ApiResponse<Event>>(
      API_ENDPOINTS.EVENT.DETAIL(data.id),
      data
    )
    return response.data
  },

  async deleteEvent(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.EVENT.DETAIL(id))
  },

  async toggleDismissEvent(id: string): Promise<void> {
    await api.post(API_ENDPOINTS.EVENT.DISMISS(id))
  },
}
