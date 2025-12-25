export interface Client {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: "active" | "inactive" | "pending"
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
