import type { BaseEntity, PaginationParams } from "@/types";
import { z } from "zod";
import { VALIDATION } from "../constants";

// Lender types
export interface Lender extends BaseEntity {
  name: string;
  slug: string;
  loans?: Loan[];
}

export interface LenderQuery extends PaginationParams {
  name?: string;
  slug?: string;
}

export interface Loan extends BaseEntity {
  name: string;
  lenderId: string;
  lenderName: string;
  interestRatesCount: number;
  interestRates?: InterestRate[];
  liabilitiesCount: number;
}

export interface LoanQuery extends PaginationParams {
  name?: string;
  lenderId?: string;
}

// Interest Rate types
export interface InterestRate extends BaseEntity {
  rateType: string;
  rate: number;
  loanId: string;
}

export const CreateLenderSchema = z.object({
  name: z
    .string()
    .min(1, "Lender name is required")
    .max(
      VALIDATION.LENDER.NAME_MAX,
      `Name must not exceed ${VALIDATION.LENDER.NAME_MAX} characters`,
    ),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(
      VALIDATION.LENDER.SLUG_MAX,
      `Slug must not exceed ${VALIDATION.LENDER.SLUG_MAX} characters`,
    )
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase letters, numbers, and hyphens only",
    ),
});

export const UpdateLenderSchema = CreateLenderSchema.extend({
  id: z.string().uuid(),
});

export type CreateLenderInput = z.infer<typeof CreateLenderSchema>;
export type UpdateLenderInput = z.infer<typeof UpdateLenderSchema>;

const InterestRateSchema = z.object({
  rateType: z
    .string()
    .min(1, "Rate type is required")
    .max(VALIDATION.INTEREST_RATE.RATE_TYPE_MAX),
  rate: z
    .number()
    .min(VALIDATION.INTEREST_RATE.RATE_MIN, "Rate must be positive")
    .max(
      VALIDATION.INTEREST_RATE.RATE_MAX,
      `Rate cannot exceed ${VALIDATION.INTEREST_RATE.RATE_MAX}%`,
    ),
});

export const CreateLoanSchema = z.object({
  name: z
    .string()
    .min(1, "Loan name is required")
    .max(
      VALIDATION.LOAN.NAME_MAX,
      `Name must not exceed ${VALIDATION.LOAN.NAME_MAX} characters`,
    ),
  lenderId: z.string().uuid("Lender is required"),
  interestRates: z.array(InterestRateSchema).optional(),
});

export const UpdateLoanSchema = CreateLoanSchema.extend({
  id: z.string().uuid(),
});

export type CreateLoanInput = z.infer<typeof CreateLoanSchema>;
export type UpdateLoanInput = z.infer<typeof UpdateLoanSchema>;
export type CreateInterestRateInput = z.infer<typeof InterestRateSchema>;
