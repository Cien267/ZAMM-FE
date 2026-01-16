import { format } from 'date-fns'
import {
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  User,
  CalendarPlus,
  Plus,
  XSquare,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { type Event, type EventQuery } from '../types'
import { useEvents } from '../hooks/useEvents'
import { useEventQueries } from '../hooks/useEventsQueries'
import { openUpSertEventModal } from '../components/UpsertEvent'
import { useAlert } from '@/contexts/AlertContext'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { openDetailEventModal } from './DetailEvent'
import { LIABILITY_MODIFIED_EVENT } from '../constants'
import { getEventTitle, getEventDate } from '../libs/utils'

const TimelineSkeleton = () => {
  return (
    <div className="relative space-y-0 border-l-2 border-muted w-1/4 ml-10">
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative pl-8 pb-8">
          <div className="absolute -left-2.25 top-1 h-4 w-4 rounded-full bg-muted" />

          <div className="flex flex-col gap-3 p-4 rounded-lg border bg-card/50">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-5 w-50" />
                <Skeleton className="h-4 w-37.5" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface EventTimelineProps {
  personId: string | null
  companyId: string | null
  liabilityId: string | null
  type: 'person' | 'company' | 'liability'
  height?: string
}

export const EventTimeline = ({
  personId,
  companyId,
  liabilityId,
  type,
  height = 'h-150',
}: EventTimelineProps) => {
  const { openAlert } = useAlert()
  const { deleteEvent, toggleDismissEvent } = useEvents()
  const { useEventsList } = useEventQueries()

  const query: EventQuery = {
    pageNumber: 1,
    pageSize: 1000,
    sortBy: 'CreatedAt',
    sortDescending: true,
    personId: personId || undefined,
    companyId: companyId || undefined,
    liabilityId: liabilityId || undefined,
  }

  const { data: eventsData, isLoading, error, refetch } = useEventsList(query)

  if (isLoading) {
    return <TimelineSkeleton />
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  const sortedEvents = [...(eventsData?.data || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const onToggleDismiss = async (event: Event) => {
    await toggleDismissEvent(event.id)
  }

  const onDeleteConfirm = (event: Event) => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete the event "${event.title}".`,
      confirmText: 'Delete',
      onConfirm: async () => {
        await deleteEvent(event.id)
      },
    })
  }

  return (
    <div className="relative space-y-0">
      {sortedEvents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center animate-in fade-in zoom-in duration-300">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <CalendarPlus className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No events recorded</h3>
          <p className="mb-6 mt-2 text-sm text-muted-foreground max-w-62.5">
            Keep track of important milestones by adding your first event.
          </p>
          <Button
            onClick={() =>
              openUpSertEventModal({
                event: null,
                type: type,
                personId: personId,
                companyId: companyId,
                liabilityId: liabilityId,
              })
            }
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      )}

      {sortedEvents.length > 0 && (
        <>
          <div className="w-full flex justify-between items-center mb-2 py-2">
            <h3 className="font-semibold flex items-center gap-2">
              {sortedEvents.length} events
            </h3>
            <Button
              onClick={() =>
                openUpSertEventModal({
                  event: null,
                  type: type,
                  personId: personId,
                  companyId: companyId,
                  liabilityId: liabilityId,
                })
              }
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
          <ScrollArea className={`flex-1 pr-4 ${height}`}>
            <div className="relative space-y-0 ml-4 border-l-2 border-accent-foreground/20 min-h-150">
              {sortedEvents.map((event) => (
                <div key={event.id} className="relative pl-8 pb-8 last:pb-0">
                  <div
                    className={`absolute -left-2.25 top-1 h-4 w-4 rounded-full border-2 ${event.isDismissed ? 'bg-sky-500 border-sky-500' : 'bg-background border-primary'}`}
                  />

                  <div className="flex flex-col gap-2 p-4 rounded-lg border bg-card shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold">
                          {getEventTitle(event)}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {format(
                              new Date(getEventDate(event)),
                              'MMM d, yyyy'
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            {event.addedByUserName}
                          </span>
                        </div>
                        {type !== 'liability' &&
                          event.liabilityId &&
                          event.liabilityName && (
                            <Badge variant="info">{event.liabilityName}</Badge>
                          )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              openDetailEventModal({
                                event,
                                type: type,
                                personId: personId,
                                companyId: companyId,
                                liabilityId: liabilityId,
                              })
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              openUpSertEventModal({
                                event,
                                type: type,
                                personId: personId,
                                companyId: companyId,
                                liabilityId: liabilityId,
                              })
                            }
                          >
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onToggleDismiss(event)}
                          >
                            <XSquare className="mr-2 h-4 w-4" />{' '}
                            {event.isDismissed ? 'Un-dismiss' : 'Dismiss'}
                          </DropdownMenuItem>
                          {event.type !== LIABILITY_MODIFIED_EVENT && (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => onDeleteConfirm(event)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  )
}
