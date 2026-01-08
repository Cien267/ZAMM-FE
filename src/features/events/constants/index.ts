export const CUSTOM_EVENT = 'CUSTOM'
export const LIABILITY_MODIFIED_EVENT = 'LIABILITY_MODIFIED'
export const LOAN_START_EVENT = 'LOAN_START'
export const LOAN_END_EVENT = 'LOAN_END'
export const INTEREST_ONLY_END_EVENT = 'INTEREST_ONLY_END'
export const ANNIVERSARY_EVENT = 'ANNIVERSARY'
export const INTRO_RATE_END_EVENT = 'INTRO_RATE_END'
export const FIXED_TERM_START_EVENT = 'FIXED_TERM_START'
export const FIXED_TERM_END_EVENT = 'FIXED_TERM_END'

export const EVENT_TYPES = [
  CUSTOM_EVENT,
  LIABILITY_MODIFIED_EVENT,
  LOAN_START_EVENT,
  LOAN_END_EVENT,
  INTEREST_ONLY_END_EVENT,
  ANNIVERSARY_EVENT,
  INTRO_RATE_END_EVENT,
] as const

export const REPEAT_UNITS = ['weeks', 'months', 'quarters', 'years'] as const

export const eventKeys = {
  all: ['events'] as const,
  events: () => [...eventKeys.all, 'events'] as const,
  eventsList: (query: any) => [...eventKeys.events(), 'list', query] as const,
  eventDetail: (id: string) => [...eventKeys.events(), 'detail', id] as const,
}
