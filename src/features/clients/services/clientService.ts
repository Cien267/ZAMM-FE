import api from "@/services/api"
import { API_ENDPOINTS } from "@/services/endpoints"
import type { ApiResponse } from "@/types/api.types"
import type {
  Person,
  PersonQuery,
  CreatePersonInput,
  UpdatePersonInput,
  Company,
  CompanyQuery,
  CreateCompanyInput,
  UpdateCompanyInput,
} from "../types"
import type { PaginatedResponse } from "@/types"

export const clientService = {
  // PEOPLE
  async getPeople(query: PersonQuery): Promise<PaginatedResponse<Person>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Person>>>(
        API_ENDPOINTS.PEOPLE.BASE,
        { params: query }
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getPerson(id: string): Promise<Person> {
    try {
      const response = await api.get<ApiResponse<Person>>(
        API_ENDPOINTS.PEOPLE.DETAIL(id)
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async createPerson(data: CreatePersonInput): Promise<Person> {
    try {
      data.address = {} // TODO: handle address
      const response = await api.post<ApiResponse<Person>>(
        API_ENDPOINTS.PEOPLE.BASE,
        data
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updatePerson(data: UpdatePersonInput): Promise<Person> {
    try {
      data.address = {} // TODO: handle address
      const response = await api.put<ApiResponse<Person>>(
        API_ENDPOINTS.PEOPLE.DETAIL(data.id),
        data
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deletePerson(id: string): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.PEOPLE.DETAIL(id))
    } catch (error) {
      throw error
    }
  },

  // COMPANY
  async getCompanies(query: CompanyQuery): Promise<PaginatedResponse<Company>> {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Company>>>(
        API_ENDPOINTS.COMPANIES.BASE,
        { params: query }
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async getCompany(id: string): Promise<Company> {
    try {
      const response = await api.get<ApiResponse<Company>>(
        API_ENDPOINTS.COMPANIES.DETAIL(id)
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async createCompany(data: CreateCompanyInput): Promise<Company> {
    try {
      const response = await api.post<ApiResponse<Company>>(
        API_ENDPOINTS.COMPANIES.BASE,
        data
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateCompany(data: UpdateCompanyInput): Promise<Company> {
    try {
      const response = await api.put<ApiResponse<Company>>(
        API_ENDPOINTS.COMPANIES.DETAIL(data.id),
        data
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteCompany(id: string): Promise<void> {
    try {
      await api.delete(API_ENDPOINTS.COMPANIES.DETAIL(id))
    } catch (error) {
      throw error
    }
  },
}
