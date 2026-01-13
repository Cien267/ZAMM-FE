import { z } from 'zod'
import type { BaseEntity } from '@/types'
import type { Brokerage } from '@/features/brokerage/types'
export interface User extends BaseEntity {
  id: string
  email: string
  fullName: string
  userName?: string
  dateOfBirth?: Date
  avatar?: string
  phoneNumber?: string | null
  brokerageId?: string | null
  brokerage?: Brokerage | null
  roles: string[]
}

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export type LoginInput = z.infer<typeof LoginSchema>

export const RegisterSchema = z
  .object({
    userName: z.string().min(2, 'Username must be at least 2 characters'),
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    dateOfBirth: z.date().optional(),
    phoneNumber: z.string().optional(),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type RegisterInput = z.infer<typeof RegisterSchema>

export interface AuthContextType {
  login: (data: LoginInput) => Promise<void>
  register: (data: RegisterInput) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export const UpdateProfileSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(2, 'Name is too short'),
  email: z.string().email(),
  phoneNumber: z.string().nullable().optional(),
  dateOfBirth: z.date().optional(),
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>

export const ChangePasswordSchema = z
  .object({
    id: z.string().optional(),
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  })

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>
