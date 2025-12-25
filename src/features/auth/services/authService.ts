import api from "@/services/api"
import { API_ENDPOINTS } from "@/services/endpoints"
import type { ApiResponse } from "@/types/api.types"
import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../types/auth.types"
import type { User } from "@/features/auth/types/auth.types"

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async register(userData: RegisterRequest): Promise<User> {
    try {
      const response = await api.post<ApiResponse<User>>(
        API_ENDPOINTS.AUTH.REGISTER,
        userData
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      throw error
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.AUTH.ME)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
    } catch (error) {
      throw error
    }
  },

  async resetPassword(token: string, password: string): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password })
    } catch (error) {
      throw error
    }
  },

  async verifyEmail(token: string): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, { token })
    } catch (error) {
      throw error
    }
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    try {
      const response = await api.put<ApiResponse<User>>(
        `${API_ENDPOINTS.AUTH.UPDATE_PROFILE}/${data.id}`,
        data
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    try {
      await api.put(`${API_ENDPOINTS.AUTH.CHANGE_PASSWORD}/${data.id}`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      })
    } catch (error) {
      throw error
    }
  },
}
