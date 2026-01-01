import type { Address } from "@/features/clients/types"
import { VALIDATION } from "../constants"
import { z } from "zod"
import type { BaseEntity, PaginationParams } from "@/types"
import { CreateAddressSchema } from "@/features/address/types"

// Asset types
export interface Asset extends BaseEntity {
  name: string
  address?: Address
  addressOffPlan: boolean
  propertyType?: string
  zoningType?: string
  value?: number
  valueIsCertified: boolean
  valuationDate?: string
  isInvestment: boolean
  rentalIncomeValue?: number
  rentalIncomeFrequency?: string
  rentalHasAgent: boolean
  rentalAgentContact?: string
  isUnencumbered: boolean
  assetPeople?: AssetPerson[]
  assetCompanies?: AssetCompany[]
  assetLiabilities?: AssetLiability[]
}

export interface AssetQuery extends PaginationParams {
  name?: string
  isInvestment?: boolean
  zoningType?: string
  propertyType?: string
}

export interface AssetPerson {
  id: string
  personId: string
  personName: string
  percent: number
}

export interface AssetCompany {
  id: string
  companyId: string
  companyName: string
  percent: number
}

export interface AssetLiability {
  id: string
  liabilityId: string
  liabilityName: string
}

const AssetPersonSchema = z.object({
  personId: z.string().uuid("Please select a person"),
  percent: z
    .number()
    .min(0, "Percentage must be at least 0")
    .max(100, "Percentage cannot exceed 100"),
})

const AssetCompanySchema = z.object({
  companyId: z.string().uuid("Please select a company"),
  percent: z
    .number()
    .min(0, "Percentage must be at least 0")
    .max(100, "Percentage cannot exceed 100"),
})

const AssetLiabilitySchema = z.object({
  liabilityId: z.string().uuid("Please select a liability"),
})

export const CreateAssetSchema = z
  .object({
    name: z
      .string()
      .min(1, "Asset name is required")
      .max(
        VALIDATION.ASSET.NAME_MAX,
        `Name must not exceed ${VALIDATION.ASSET.NAME_MAX} characters`
      ),
    address: CreateAddressSchema.optional(),
    addressOffPlan: z.boolean().optional(),
    propertyType: z
      .string()
      .max(VALIDATION.ASSET.PROPERTY_TYPE_MAX)
      .optional()
      .or(z.literal("")),
    zoningType: z
      .string()
      .max(VALIDATION.ASSET.ZONING_TYPE_MAX)
      .optional()
      .or(z.literal("")),
    value: z.number().min(0, "Value must be positive").optional().nullable(),
    valueIsCertified: z.boolean().optional(),
    valuationDate: z.date().optional(),
    isInvestment: z.boolean().optional(),
    rentalIncomeValue: z
      .number()
      .min(0, "Rental income must be positive")
      .optional()
      .nullable(),
    rentalIncomeFrequency: z
      .string()
      .max(VALIDATION.ASSET.RENTAL_INCOME_FREQUENCY_MAX)
      .optional()
      .or(z.literal("")),
    rentalHasAgent: z.boolean().optional(),
    rentalAgentContact: z
      .string()
      .max(VALIDATION.ASSET.RENTAL_AGENT_CONTACT_MAX)
      .optional()
      .or(z.literal("")),
    addressText: z.string().optional(),
    isUnencumbered: z.boolean().optional(),
    assetPeople: z.array(AssetPersonSchema).optional(),
    assetCompanies: z.array(AssetCompanySchema).optional(),
    assetLiabilities: z.array(AssetLiabilitySchema).optional(),
  })
  .refine(
    (data) => {
      if (!data.assetPeople && !data.assetCompanies) return true

      const peoplePercent =
        data.assetPeople?.reduce((sum, p) => sum + p.percent, 0) || 0
      const companiesPercent =
        data.assetCompanies?.reduce((sum, c) => sum + c.percent, 0) || 0
      const totalPercent = peoplePercent + companiesPercent

      return totalPercent === 0 || totalPercent === 100
    },
    {
      message: "Total ownership percentage must equal 100%",
      path: ["assetPeople"],
    }
  )

export const UpdateAssetSchema = CreateAssetSchema.safeExtend({
  id: z.string().uuid(),
})

export type CreateAssetInput = z.infer<typeof CreateAssetSchema>
export type UpdateAssetInput = z.infer<typeof UpdateAssetSchema>
