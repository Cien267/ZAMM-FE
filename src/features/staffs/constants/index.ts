export const ROLES_LABEL = {
  ADMIN: 'Administrator',
  USER: 'User',
}

export const ROLE_OPTIONS = [
  {
    value: ROLES_LABEL.ADMIN,
    label: ROLES_LABEL.ADMIN,
  },
  {
    value: ROLES_LABEL.USER,
    label: ROLES_LABEL.USER,
  },
]

export const staffsKeys = {
  all: ['staffs'] as const,
  staffs: () => [...staffsKeys.all, 'staffs'] as const,
  staffsList: (query: any) => [...staffsKeys.staffs(), 'list', query] as const,
  staffDetail: (id: string) => [...staffsKeys.staffs(), 'detail', id] as const,
}
