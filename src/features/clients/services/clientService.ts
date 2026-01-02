import api from "@/services/api";
import { API_ENDPOINTS } from "@/services/endpoints";
import type { ApiResponse } from "@/types/api.types";
import type {
  Person,
  PersonQuery,
  CreatePersonInput,
  UpdatePersonInput,
  Company,
  CompanyQuery,
  CreateCompanyInput,
  UpdateCompanyInput,
} from "../types";
import type { PaginatedResponse } from "@/types";

export const clientService = {
  // PEOPLE
  async getPeople(query: PersonQuery): Promise<PaginatedResponse<Person>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Person>>>(
      API_ENDPOINTS.PEOPLE.BASE,
      { params: query },
    );
    return response.data;
  },

  async getPerson(id: string): Promise<Person> {
    const response = await api.get<ApiResponse<Person>>(
      API_ENDPOINTS.PEOPLE.DETAIL(id),
    );
    return response.data;
  },

  async createPerson(data: CreatePersonInput): Promise<Person> {
    data.address = {}; // TODO: handle address
    const response = await api.post<ApiResponse<Person>>(
      API_ENDPOINTS.PEOPLE.BASE,
      data,
    );
    return response.data;
  },

  async updatePerson(data: UpdatePersonInput): Promise<Person> {
    data.address = {}; // TODO: handle address
    const response = await api.put<ApiResponse<Person>>(
      API_ENDPOINTS.PEOPLE.DETAIL(data.id),
      data,
    );
    return response.data;
  },

  async deletePerson(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.PEOPLE.DETAIL(id));
  },

  // COMPANY
  async getCompanies(query: CompanyQuery): Promise<PaginatedResponse<Company>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Company>>>(
      API_ENDPOINTS.COMPANIES.BASE,
      { params: query },
    );
    return response.data;
  },

  async getCompany(id: string): Promise<Company> {
    const response = await api.get<ApiResponse<Company>>(
      API_ENDPOINTS.COMPANIES.DETAIL(id),
    );
    return response.data;
  },

  async createCompany(data: CreateCompanyInput): Promise<Company> {
    const response = await api.post<ApiResponse<Company>>(
      API_ENDPOINTS.COMPANIES.BASE,
      data,
    );
    return response.data;
  },

  async updateCompany(data: UpdateCompanyInput): Promise<Company> {
    const response = await api.put<ApiResponse<Company>>(
      API_ENDPOINTS.COMPANIES.DETAIL(data.id),
      data,
    );
    return response.data;
  },

  async deleteCompany(id: string): Promise<void> {
    await api.delete(API_ENDPOINTS.COMPANIES.DETAIL(id));
  },
};
