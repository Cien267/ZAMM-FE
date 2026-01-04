import { z } from 'zod'

export const CreateAddressSchema = z.object({
  level: z.string().max(200).optional().nullable().or(z.literal('')),
  building: z.string().max(200).optional().nullable().or(z.literal('')),
  unitNumber: z.string().max(200).optional().nullable().or(z.literal('')),
  streetNumber: z.string().max(200).optional().nullable().or(z.literal('')),
  streetName: z.string().max(200).optional().nullable().or(z.literal('')),
  suburb: z.string().max(200).optional().nullable().or(z.literal('')),
  state: z.string().max(100).optional().nullable().or(z.literal('')),
  country: z.string().max(100).optional().nullable().or(z.literal('')),
  postcode: z.string().max(20).optional().nullable().or(z.literal('')),
  offPlan: z.boolean().optional().nullable(),
})

export interface Address {
  id: string
  level?: string
  building?: string
  unitNumber?: string
  streetNumber?: string
  streetName?: string
  suburb?: string
  state?: string
  country?: string
  postcode?: string
  offPlan: boolean
}

export type CreateAddressInput = z.infer<typeof CreateAddressSchema>
