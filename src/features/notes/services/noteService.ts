import api from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { ApiResponse } from '@/types/api.types'
import type {
  Note,
  NoteQuery,
  CreateNoteInput,
  UpdateNoteInput,
} from '../types'
import type { PaginatedResponse } from '@/types'

export const noteService = {
  async getAllNotes(query: NoteQuery): Promise<Note[]> {
    const response = await api.get<ApiResponse<Note[]>>(
      API_ENDPOINTS.NOTE.ALL,
      { params: query }
    )
    return response.data
  },

  async getNotes(query: NoteQuery): Promise<PaginatedResponse<Note>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Note>>>(
      API_ENDPOINTS.NOTE.BASE,
      { params: query }
    )
    return response.data
  },

  async getNote(id: string): Promise<Note> {
    const response = await api.get<ApiResponse<Note>>(
      API_ENDPOINTS.NOTE.DETAIL(id)
    )
    return response.data
  },

  async createNote(data: CreateNoteInput): Promise<Note> {
    const response = await api.post<ApiResponse<Note>>(
      API_ENDPOINTS.NOTE.BASE,
      data
    )
    return response.data
  },

  async updateNote(data: UpdateNoteInput): Promise<Note> {
    const response = await api.put<ApiResponse<Note>>(
      API_ENDPOINTS.NOTE.DETAIL(data.id),
      data
    )
    return response.data
  },

  async deleteNote(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.NOTE.DETAIL(id))
  },
}
