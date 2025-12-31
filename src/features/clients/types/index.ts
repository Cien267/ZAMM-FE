import type { PaginationParams, BaseEntity } from "@/types"
import { z } from "zod"
import { VALIDATION } from "../constants"

export type ClientType = "people" | "company"

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

export interface CreateAddressInput {
  id?: string
  level?: string
  building?: string
  unitNumber?: string
  streetNumber?: string
  streetName?: string
  suburb?: string
  state?: string
  country?: string
  postcode?: string
  offPlan?: boolean
}

export interface Dependent extends BaseEntity {
  fullName: string
  yearOfBirth: number
  age: number
  gender?: string
  relationship?: string
  isStudent?: boolean
  notes?: string
  personId: string
}

const DependentSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(VALIDATION.DEPENDENT.FULL_NAME_MAX),
  yearOfBirth: z
    .number()
    .min(
      VALIDATION.DEPENDENT.YEAR_OF_BIRTH_MIN,
      `Year must be after ${VALIDATION.DEPENDENT.YEAR_OF_BIRTH_MIN}`
    )
    .max(
      VALIDATION.DEPENDENT.YEAR_OF_BIRTH_MAX,
      `Year must be before ${VALIDATION.DEPENDENT.YEAR_OF_BIRTH_MAX}`
    ),
  gender: z
    .string()
    .max(VALIDATION.DEPENDENT.GENDER_MAX)
    .optional()
    .nullable()
    .or(z.literal("")),
  relationship: z
    .string()
    .max(VALIDATION.DEPENDENT.RELATIONSHIP_MAX)
    .optional()
    .nullable()
    .or(z.literal("")),
  isStudent: z.boolean().optional().nullable(),
  notes: z
    .string()
    .max(VALIDATION.DEPENDENT.NOTES_MAX)
    .optional()
    .nullable()
    .or(z.literal("")),
})

// PERSON
export interface Person extends BaseEntity {
  title?: string
  firstName: string
  middleName?: string
  lastName: string
  preferredName?: string
  fullName: string
  dateOfBirth?: Date
  notifyOfBirthday: boolean
  gender?: string
  maritalStatus?: string
  email?: string
  phoneWork?: string
  phoneMobile?: string
  phonePreference?: string
  actingOnTrust: boolean
  trustName?: string
  spouseId?: string
  spouseName?: string
  brokerId: string
  brokerName?: string
  address?: Address
  addressLine?: string
  dependents?: Dependent[]
}

export interface PersonQuery extends PaginationParams {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  brokerId?: string
}

export const CreatePersonSchema = z.object({
  title: z.string().optional(),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(
      VALIDATION.PERSON.FIRST_NAME_MAX,
      `First name must not exceed ${VALIDATION.PERSON.FIRST_NAME_MAX} characters`
    ),
  middleName: z
    .string()
    .max(
      VALIDATION.PERSON.MIDDLE_NAME_MAX,
      `Middle name must not exceed ${VALIDATION.PERSON.MIDDLE_NAME_MAX} characters`
    )
    .optional()
    .or(z.literal("")),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(
      VALIDATION.PERSON.LAST_NAME_MAX,
      `Last name must not exceed ${VALIDATION.PERSON.LAST_NAME_MAX} characters`
    ),
  preferredName: z
    .string()
    .max(
      VALIDATION.PERSON.PREFERRED_NAME_MAX,
      `Preferred name must not exceed ${VALIDATION.PERSON.PREFERRED_NAME_MAX} characters`
    )
    .optional()
    .or(z.literal("")),
  dateOfBirth: z.date().optional(),
  notifyOfBirthday: z.boolean(),
  gender: z
    .string()
    .max(VALIDATION.PERSON.GENDER_MAX)
    .optional()
    .or(z.literal("")),
  maritalStatus: z
    .string()
    .max(VALIDATION.PERSON.MARITAL_STATUS_MAX)
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(
      VALIDATION.PERSON.EMAIL_MAX,
      `Email must not exceed ${VALIDATION.PERSON.EMAIL_MAX} characters`
    ),
  phoneWork: z
    .string()
    .max(
      VALIDATION.PERSON.PHONE_MAX,
      `Phone must not exceed ${VALIDATION.PERSON.PHONE_MAX} characters`
    )
    .optional()
    .or(z.literal("")),
  phoneMobile: z
    .string()
    .max(
      VALIDATION.PERSON.PHONE_MAX,
      `Phone must not exceed ${VALIDATION.PERSON.PHONE_MAX} characters`
    )
    .optional()
    .or(z.literal("")),
  phonePreference: z.string().optional().or(z.literal("")),
  actingOnTrust: z.boolean(),
  trustName: z
    .string()
    .max(
      VALIDATION.PERSON.TRUST_NAME_MAX,
      `Trust name must not exceed ${VALIDATION.PERSON.TRUST_NAME_MAX} characters`
    )
    .optional()
    .or(z.literal("")),
  spouseId: z.string().uuid().optional().nullable(),
  brokerId: z.string().min(1, "Broker is required"),
  address: z.any().optional(),
  dependents: z.array(DependentSchema).optional(),
})

export const UpdatePersonSchema = CreatePersonSchema.extend({
  id: z.string().uuid(),
})

export type CreatePersonInput = z.infer<typeof CreatePersonSchema>
export type UpdatePersonInput = z.infer<typeof UpdatePersonSchema>

// COMPANY
export interface CompanyPerson extends BaseEntity {
  personId: string
  personName: string
}
export interface CreateCompanyPersonInput {
  personId: string
}

export interface Company extends BaseEntity {
  name: string
  tradingName?: string
  type?: string
  abn?: string
  acn?: string
  registrationDate?: string
  phoneWork?: string
  website?: string
  email?: string
  industry?: string
  actingOnTrust: boolean
  trustName?: string
  externalContactName?: string
  externalContactEmail?: string
  externalContactPhone?: string
  isContactExistingPerson: boolean
  brokerId: string
  brokerName?: string
  address?: Address
  companyPeople?: CompanyPerson[]
}

export interface CompanyQuery extends PaginationParams {
  name?: string
  tradingName?: string
  type?: string
  abn?: string
  acn?: string
  email?: string
  industry?: string
  brokerId?: string
}

export interface CreateCompanyInput {
  name: string
  tradingName?: string
  type?: string
  abn?: string
  acn?: string
  registrationDate?: string
  phoneWork?: string
  website?: string
  email?: string
  industry?: string
  actingOnTrust?: boolean
  trustName?: string
  externalContactName?: string
  externalContactEmail?: string
  externalContactPhone?: string
  isContactExistingPerson?: boolean
  brokerId: string
  address?: CreateAddressInput
  companyPeople?: CreateCompanyPersonInput[]
}

export interface UpdateCompanyInput extends CreateCompanyInput {
  id: string
}
