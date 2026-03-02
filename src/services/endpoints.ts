export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh-token',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    UPDATE_PROFILE: '/auth/update-profile',
    CHANGE_PASSWORD: '/auth/change-password',
    GET__LIST_USERS: '/auth/users',
    DETAIL: (id: string) => `/auth/users/${id}`,
  },
  USER: {
    BASE: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    ROLES: (id: string) => `/users/${id}/roles`,
  },
  PEOPLE: {
    BASE: '/people',
    ALL: '/people/all',
    DETAIL: (id: string) => `/people/${id}`,
  },
  COMPANIES: {
    BASE: '/companies',
    ALL: '/companies/all',
    DETAIL: (id: string) => `/companies/${id}`,
  },
  ASSET: {
    BASE: '/assets',
    ALL: '/assets/all',
    DETAIL: (id: string) => `/assets/${id}`,
  },
  LIABILITY: {
    BASE: '/liabilities',
    ALL: '/liabilities/all',
    DETAIL: (id: string) => `/liabilities/${id}`,
  },
  LENDER: {
    BASE: '/lenders',
    ALL: '/lenders/all',
    DETAIL: (id: string) => `/lenders/${id}`,
    ASSIGN_TO_BROKERAGE: (id: string) => `/lenders/${id}/assign-to-brokerage`,
    UNASSIGN_FROM_BROKERAGE: (id: string) =>
      `/lenders/${id}/unassign-from-brokerage`,
  },
  LOAN: {
    BASE: '/loans',
    ALL: '/loans/all',
    DETAIL: (id: string) => `/loans/${id}`,
  },
  BROKERAGE: {
    BASE: '/brokerages',
    All: '/brokerages/all',
    DETAIL: (id: string) => `/brokerages/${id}`,
    GET_ALL_BROKERS: (brokerageId: string) =>
      `/brokerages/${brokerageId}/brokers`,
    GET_LENDERS_ASSIGNED_TO_BROKERAGE: (brokerageId: string) =>
      `/brokerages/${brokerageId}/lenders`,
  },
  EVENT: {
    BASE: '/events',
    ALL: '/events/all',
    DETAIL: (id: string) => `/events/${id}`,
    DISMISS: (id: string) => `/events/${id}/dismiss`,
  },
  NOTE: {
    BASE: '/notes',
    ALL: '/notes/all',
    DETAIL: (id: string) => `/notes/${id}`,
  },
  ACTIVITY_LOGS: {
    BASE: '/activity-logs',
    ALL: '/activity-logs/all',
    DETAIL: (id: string) => `/activity-logs/${id}`,
  },
  DASHBOARD: {
    UPCOMING_EVENTS: '/dashboard/upcoming-events',
    INTEREST_RATES: '/dashboard/interest-rates',
    LOAN_BOOK: '/dashboard/loan-book',
  },
  REPORTS: {
    SUMMARY: '/report/summary',
    PEOPLE: '/report/people',
    COMPANIES: '/report/companies',
    ASSETS: '/report/assets',
    LIABILITIES: '/report/liabilities',
  },
  EMAIL: {
    FIRM_SETTING: {
      BASE: '/firm-email-settings',
      TEST_CONNECTION: '/firm-email-settings/test-connection',
      DETAIL: (brokerageId: string) => `/firm-email-settings/${brokerageId}`,
      DETAIL_BY_BROKERAGE: (brokerageId: string) =>
        `/firm-email-settings/get-by-brokerage/${brokerageId}`,
    },
    CATEGORIES: {
      BASE: '/email-categories',
      ALL: '/email-categories/all',
      DETAIL: (id: string) => `/email-categories/${id}`,
    },
    TEMPLATES: {
      BASE: '/email-templates',
      ALL: '/email-templates/all',
      DETAIL: (id: string) => `/email-templates/${id}`,
      VARIABLES: '/email-templates/variables',
    },
    HISTORY: {
      BASE: '/sent-emails',
      ANALYTICS: '/sent-emails/analytics',
      DETAIL: (id: string) => `/sent-emails/${id}`,
      RESEND: (id: string) => `/sent-emails/${id}/resend`,
    },
  },
} as const
