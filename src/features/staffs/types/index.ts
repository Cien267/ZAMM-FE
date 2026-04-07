import type { PaginationParams } from '@/types'
import { z } from 'zod'

export interface StaffQuery extends PaginationParams {
  fullName?: string
  email?: string
  phoneNumber?: string
}

export const CreateStaffSchema = z
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

export const UpdateStaffSchema = z
  .object({
    id: z.string(),
    userName: z.string().min(2, 'Username must be at least 2 characters'),
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    dateOfBirth: z.date().optional(),
    phoneNumber: z.string().optional(),
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters')
      .optional()
      .or(z.literal('')),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword) {
        return data.newPassword === data.confirmPassword
      }
      return true
    },
    {
      message: 'New passwords do not match',
      path: ['confirmPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.currentPassword) {
        return false
      }
      return true
    },
    {
      message: 'Current password is required to set a new password',
      path: ['currentPassword'],
    }
  )

export type CreateStaffInput = z.infer<typeof CreateStaffSchema>
export type UpdateStaffInput = z.infer<typeof UpdateStaffSchema>

export const UpdateRolesSchema = z.object({
  assignerId: z.string(),
  roles: z.array(z.string()).min(1, 'Select at least one role'),
})

export type UpdateRolesInput = z.infer<typeof UpdateRolesSchema>
