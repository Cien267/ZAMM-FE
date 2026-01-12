export const noteKeys = {
  all: ['notes'] as const,
  notes: () => [...noteKeys.all, 'notes'] as const,
  notesList: (query: any) => [...noteKeys.notes(), 'list', query] as const,
  noteDetail: (id: string) => [...noteKeys.notes(), 'detail', id] as const,
}
