export const activityLogKeys = {
  all: ['activityLogs'] as const,
  activityLogs: () => [...activityLogKeys.all, 'activityLogs'] as const,
  activityLogsList: (query: any) =>
    [...activityLogKeys.activityLogs(), 'list', query] as const,
  activityLogDetail: (id: string) =>
    [...activityLogKeys.activityLogs(), 'detail', id] as const,
}

export const ACTION_TYPE_VIEWED = 'Viewed'
export const ACTION_TYPE_CREATED = 'Created'
export const ACTION_TYPE_UPDATED = 'Updated'
export const ACTION_TYPE_DELETED = 'Deleted'

export const ENTITY_TYPE_PERSON = 'Person'
export const ENTITY_TYPE_COMPANY = 'Company'
export const ENTITY_TYPE_ASSET = 'Asset'
export const ENTITY_TYPE_LIABILITY = 'Liability'
