export const brokeragesKeys = {
  all: ['brokerages'] as const,
  brokerages: () => [...brokeragesKeys.all, 'brokerages'] as const,
  brokeragesList: (query: any) =>
    [...brokeragesKeys.brokerages(), 'list', query] as const,
  brokerageDetail: (id: string) =>
    [...brokeragesKeys.brokerages(), 'detail', id] as const,
}
