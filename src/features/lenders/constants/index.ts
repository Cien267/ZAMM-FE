export const VALIDATION = {
  LENDER: {
    NAME_MAX: 200,
    SLUG_MAX: 100,
  },
  LOAN: {
    NAME_MAX: 200,
  },
  INTEREST_RATE: {
    RATE_TYPE_MAX: 50,
    RATE_MIN: 0,
    RATE_MAX: 100,
  },
};

export const RATE_TYPES = [
  "Standard Variable",
  "Fixed 1 Year",
  "Fixed 2 Years",
  "Fixed 3 Years",
  "Fixed 4 Years",
  "Fixed 5 Years",
  "Comparison Rate",
  "Interest Only Variable",
  "Introductory Rate",
  "Other",
] as const;

export const lenderKeys = {
  all: ["lenders"] as const,
  lists: () => [...lenderKeys.all, "list"] as const,
  list: (query: any) => [...lenderKeys.lists(), query] as const,
  details: () => [...lenderKeys.all, "detail"] as const,
  detail: (id: string) => [...lenderKeys.details(), id] as const,
};

export const loanKeys = {
  all: ["loans"] as const,
  lists: () => [...loanKeys.all, "list"] as const,
  list: (query: any) => [...loanKeys.lists(), query] as const,
  details: () => [...loanKeys.all, "detail"] as const,
  detail: (id: string) => [...loanKeys.details(), id] as const,
};
