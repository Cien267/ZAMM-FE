import type { Event } from '../types'
import { ANNIVERSARY_EVENT } from '../constants'
import { differenceInYears } from 'date-fns'

export const getEventTitle = (event: Event) => {
  if (event.type !== ANNIVERSARY_EVENT) return event.title
  if (!event.repeatingDateDismissed) return `1 year ${event.title}`
  else {
    const years =
      differenceInYears(
        new Date(event.repeatingDateDismissed),
        new Date(event.date)
      ) + 1
    return `${years} years ${event.title}`
  }
}

export const getEventDate = (event: Event) => {
  if (event.type !== ANNIVERSARY_EVENT) return event.date
  return event.repeatingDateDismissed ?? event.date
}
