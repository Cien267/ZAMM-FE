import { useQuery } from '@tanstack/react-query'
import { eventService } from '../services/eventService'
import type { EventQuery } from '../types'
import { eventKeys } from '../constants'

export const useEventQueries = () => {
  const useAllEvents = (query: EventQuery) => {
    return useQuery({
      queryKey: eventKeys.eventsList(query),
      queryFn: () => eventService.getAllEvents(query),
    })
  }

  const useEventsList = (query: EventQuery) => {
    return useQuery({
      queryKey: eventKeys.eventsList(query),
      queryFn: () => eventService.getEvents(query),
    })
  }

  const useEvent = (id: string, enabled = true) => {
    return useQuery({
      queryKey: eventKeys.eventDetail(id),
      queryFn: () => eventService.getEvent(id),
      enabled: enabled && !!id,
    })
  }

  return {
    useAllEvents,
    useEventsList,
    useEvent,
  }
}
