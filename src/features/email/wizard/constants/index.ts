export const RECIPIENT_TYPES = {
  PERSON: 'Person',
  COMPANY: 'Company',
}

export const emailPreviewBatchKeys = {
  emailPreviewBatches: () => ['emailPreviewBatches'] as const,
  emailPreviewBatchDetail: (id: string) =>
    [...emailPreviewBatchKeys.emailPreviewBatches(), 'detail', id] as const,
}
