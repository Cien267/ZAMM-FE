export const VALIDATION = {
  LENDER: {
    NAME_MAX: 200,
    SLUG_MAX: 100,
  },
}

export const lenderKeys = {
  all: ['lenders'] as const,
  lenders: () => [...lenderKeys.all, 'lenders'] as const,
  lendersList: (query: any) =>
    [...lenderKeys.lenders(), 'list', query] as const,
  lenderDetail: (id: string) =>
    [...lenderKeys.lenders(), 'detail', id] as const,
}
