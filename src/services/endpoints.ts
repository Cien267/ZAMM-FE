export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    UPDATE_PROFILE: "/auth/update-profile",
    CHANGE_PASSWORD: "/auth/change-password",
  },
  CLIENTS: {
    LIST: "/clients",
    DETAIL: (id: string) => `/clients/${id}`,
    CREATE: "/clients",
    UPDATE: (id: string) => `/clients/${id}`,
    DELETE: (id: string) => `/clients/${id}`,
  },
  DASHBOARD: {
    UPCOMING_EVENTS: "/dashboard/upcoming-events",
    INTEREST_RATES: "/dashboard/interest-rates",
    LOAN_BOOK: "/dashboard/loan-book",
  },
  REPORTS: {
    LIST: "/reports",
    GENERATE: "/reports/generate",
  },
} as const
