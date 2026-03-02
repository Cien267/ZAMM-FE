export const SENT_EMAIL_STATUS_VARIANT_MAPPING = {
  Pending: 'warning',
  Sent: 'success',
  Failed: 'destructive',
}

export const SENT_EMAIL_STATUS_OPTIONS = ['Pending', 'Sent', 'Failed']

export const sentEmailKeys = {
  sentEmails: () => ['sentEmails'] as const,
  sentEmailsList: (query: any) =>
    [...sentEmailKeys.sentEmails(), 'list', query] as const,
  sentEmailDetail: (id: string) =>
    [...sentEmailKeys.sentEmails(), 'detail', id] as const,
}
