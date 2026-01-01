export const FINANCE_PURPOSES = ["Investment", "Owner Occupier"] as const

export const REPAYMENT_FREQUENCIES = [
  "Weekly",
  "Fortnightly",
  "Monthly",
] as const

export const liabilityKeys = {
  all: ["liabilities"] as const,
  lists: () => [...liabilityKeys.all, "list"] as const,
  list: (query: any) => [...liabilityKeys.lists(), query] as const,
  details: () => [...liabilityKeys.all, "detail"] as const,
  detail: (id: string) => [...liabilityKeys.details(), id] as const,
}

export const VALIDATION = {
  LIABILITY: {
    NAME_MAX: 200,
    LOAN_TERM_MIN: 1,
    LOAN_TERM_MAX: 360,
    INTEREST_ONLY_TERM_MAX: 360,
    FINANCE_PURPOSE_MAX: 200,
    INTRO_RATE_YEARS_MAX: 30,
    INTRO_RATE_PERCENT_MAX: 100,
    REPAYMENT_FREQUENCY_MAX: 50,
    DISCOUNT_PERCENT_MAX: 100,
    SETTLEMENT_RATE_MAX: 100,
    BANK_ACCOUNT_NAME_MAX: 200,
    BSB_MAX: 10,
    ACCOUNT_NUMBER_MAX: 20,
  },
  FIXED_RATE_PERIOD: {
    TERM_MIN: 1,
    TERM_MAX: 30,
    CUSTOM_RATE_MAX: 100,
  },
}
