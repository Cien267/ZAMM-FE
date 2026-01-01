import { z } from "zod"

export const CreateAddressSchema = z.object({
  level: z.string().max(200).optional().or(z.literal("")),
  building: z.string().max(200).optional().or(z.literal("")),
  unitNumber: z.string().max(200).optional().or(z.literal("")),
  streetNumber: z.string().max(200).optional().or(z.literal("")),
  streetName: z.string().max(200).optional().or(z.literal("")),
  suburb: z.string().max(200).optional().or(z.literal("")),
  state: z.string().max(100).optional().or(z.literal("")),
  country: z.string().max(100).optional().or(z.literal("")),
  postcode: z.string().max(20).optional().or(z.literal("")),
  offPlan: z.boolean().optional(),
})
