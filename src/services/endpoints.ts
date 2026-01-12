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
    ALL_USER: '/auth/get-all-users',
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
