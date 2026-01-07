import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { eventKeys } from '../constants'
import { eventService } from '../services/eventService'
import type { CreateEventInput, UpdateEventInput } from '../types'

export const useEvents = () => {
  const queryClient = useQueryClient()

  const createEventMutation = useMutation({
    mutationFn: (data: CreateEventInput) => eventService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.events() })
      toast.success('Event created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create event')
      console.error('Create event error:', error)
    },
  })

  const updateEventMutation = useMutation({
    mutationFn: (data: UpdateEventInput) => eventService.updateEvent(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.events() })
      queryClient.invalidateQueries({
        queryKey: eventKeys.eventDetail(variables.id),
      })
      toast.success('Event updated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update event')
      console.error('Update event error:', error)
    },
  })

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.events() })
      toast.success('Event deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to toggleDismissEvent event')
      console.error('Delete event error:', error)
    },
  })

  const toggleDismissEventMutation = useMutation({
    mutationFn: (id: string) => eventService.toggleDismissEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.events() })
      toast.success('Dismiss/Un-dismiss event successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to dismiss/un-dismiss')
      console.error('Dismiss/un-dismiss event error:', error)
    },
  })

  return {
    createEvent: createEventMutation.mutate,
    createEventAsync: createEventMutation.mutateAsync,
    isCreatingEvent: createEventMutation.isPending,
    createEventError: createEventMutation.error,

    updateEvent: updateEventMutation.mutate,
    updateEventAsync: updateEventMutation.mutateAsync,
    isUpdatingEvent: updateEventMutation.isPending,
    updateEventError: updateEventMutation.error,

    deleteEvent: deleteEventMutation.mutate,
    deleteEventAsync: deleteEventMutation.mutateAsync,
    isDeletingEvent: deleteEventMutation.isPending,
    deleteEventError: deleteEventMutation.error,

    toggleDismissEvent: toggleDismissEventMutation.mutate,
    toggleDismissEventAsync: toggleDismissEventMutation.mutateAsync,
    isDismissingEvent: toggleDismissEventMutation.isPending,
    dismissEventError: toggleDismissEventMutation.error,
  }
}
