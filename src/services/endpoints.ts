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
    DETAIL: (id: string) => `/people/${id}`,
  },
  COMPANIES: {
    BASE: '/company',
    DETAIL: (id: string) => `/company/${id}`,
  },
  ASSET: {
    BASE: '/asset',
    DETAIL: (id: string) => `/asset/${id}`,
  },
  LIABILITY: {
    BASE: '/liability',
    DETAIL: (id: string) => `/liability/${id}`,
  },
  LENDER: {
    BASE: '/lender',
    DETAIL: (id: string) => `/lender/${id}`,
    ASSIGN_TO_BROKERAGE: (id: string) => `/lender/${id}/assign-to-brokerage`,
    UNASSIGN_FROM_BROKERAGE: (id: string) =>
      `/lender/${id}/unassign-from-brokerage`,
  },
  LOAN: {
    BASE: '/loan',
    DETAIL: (id: string) => `/loan/${id}`,
  },
  BROKERAGE: {
    BASE: '/brokerage',
    DETAIL: (id: string) => `/brokerage/${id}`,
    GET_ALL_BROKERS: (brokerageId: string) =>
      `/brokerage/${brokerageId}/brokers`,
    GET_LENDERS_ASSIGNED_TO_BROKERAGE: (brokerageId: string) =>
      `/brokerage/${brokerageId}/lenders`,
  },
  EVENT: {
    BASE: '/event',
    DETAIL: (id: string) => `/event/${id}`,
    DISMISS: (id: string) => `/event/${id}/dismiss`,
  },
  NOTE: {
    BASE: '/note',
    DETAIL: (id: string) => `/note/${id}`,
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
} as const
