export const reportKeys = {
  all: ['reports'] as const,
  report: () => [...reportKeys.all, 'report'] as const,
  reportSummary: () => [...reportKeys.report(), 'summary'] as const,
  peopleReport: (query: any) =>
    [...reportKeys.report(), 'people', query] as const,
  companiesReport: (query: any) =>
    [...reportKeys.report(), 'companies', query] as const,
  assetsReport: (query: any) =>
    [...reportKeys.report(), 'assets', query] as const,
  liabilitiesReport: (query: any) =>
    [...reportKeys.report(), 'liabilities', query] as const,
}
