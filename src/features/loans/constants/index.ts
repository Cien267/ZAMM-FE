export const VALIDATION = {
  LOAN: {
    NAME_MAX: 200,
  },
  INTEREST_RATE: {
    RATE_TYPE_MAX: 50,
    RATE_MIN: 0,
    RATE_MAX: 100,
  },
}

export const OWNER_OCCUPIED_PRINCIPAL_INTEREST = 'OOPI'
export const OWNER_OCCUPIED_INTEREST_ONLY = 'OOIO'
export const INVESTMENT_PRINCIPAL_INTEREST = 'IVPI'
export const INVESTMENT_INTEREST_ONLY = 'IVIO'

export const INTEREST_RATE_TYPES = [
  {
    label: 'Owner-occupied (Principal & Interest)',
    value: OWNER_OCCUPIED_PRINCIPAL_INTEREST,
  },
  {
    label: 'Owner-occupied (Interest-only)',
    value: OWNER_OCCUPIED_INTEREST_ONLY,
  },
  {
    label: 'Investment (Principal & Interest)',
    value: INVESTMENT_PRINCIPAL_INTEREST,
  },
  {
    label: 'Investment (Interest-only)',
    value: INVESTMENT_INTEREST_ONLY,
  },
] as const

export const loanKeys = {
  all: ['loans'] as const,
  loans: () => [...loanKeys.all, 'loans'] as const,
  loansList: (query: any) => [...loanKeys.loans(), 'list', query] as const,
  loanDetail: (id: string) => [...loanKeys.loans(), 'detail', id] as const,
}
