import { useState } from 'react'
import { useEventQueries } from '../hooks/useEventsQueries'
import { UpcomingEventFilters } from './UpcomingEventFilters'
import { Pagination } from '@/components/common/Pagination'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Building2 } from 'lucide-react'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import type { Event, EventQuery } from '../types'
import { useNavigate } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { format, formatDistanceToNow } from 'date-fns'
import { openDetailEventModal } from '@/features/events/components/DetailEvent'
import { Calendar, User, UserCheck, Clock } from 'lucide-react'

export const UpcomingEvent = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState<EventQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'Date',
    sortDescending: false,
    title: '',
    type: '',
    dateFrom: undefined,
    dateTo: undefined,
    isSystem: undefined,
    isRepeating: undefined,
    isDismissed: false,
    addedByUserId: undefined,
    liabilityId: undefined,
    personId: undefined,
    companyId: undefined,
  })

  const { useEventsList } = useEventQueries()
  const { data, isLoading, error, refetch } = useEventsList(query)

  const handleFilterChange = (filters: Partial<EventQuery>) => {
    setQuery((prev) => ({
      ...prev,
      ...filters,
      pageNumber: 1,
    }))
  }

  const handlePageChange = (newPage: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: newPage }))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize: newPageSize, pageNumber: 1 }))
  }

  const getTypeEventModal = (event: Event) => {
    if (event.liabilityId) return 'liability'
    if (event.personId) return 'person'
    return 'company'
  }

  const handleNavigatePersonCompany = (event: Event) => {
    if (event.personId) navigate(`/clients/people/${event.personId}`)
    else navigate(`/clients/companies/${event.companyId}`)
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'ANNIVERSARY':
        return 'bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-900/20 dark:text-pink-300'
      case 'LOAN_END':
        return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300'
      case 'INTEREST_ONLY_END':
        return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100'
    }
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <Card className="border shadow-sm backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Upcoming Events
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            You have {data?.totalCount || 0} events scheduled
          </p>
        </div>
        <UpcomingEventFilters onFilterChange={handleFilterChange} />
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
            <p className="text-sm text-muted-foreground">Loading schedule...</p>
          </div>
        ) : data?.data.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-2xl">
            <Calendar className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground font-medium">
              No upcoming events
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {data?.data.map((event) => (
              <div
                key={event.id}
                // onClick={() =>
                //   openDetailEventModal({
                //     event,
                //     type: getTypeEventModal(event),
                //     personId: event.personId || null,
                //     companyId: event.companyId || null,
                //     liabilityId: event.liabilityId || null,
                //   })
                // }
                className={`group relative flex items-center justify-between p-4 rounded-xl border transition-all hover:shadow-md hover:border-sky-200 hover:bg-sky-50 dark:hover:border-sky-800 cursor-pointer ${
                  event.isDismissed ? 'opacity-60 bg-slate-50' : 'bg-card'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center justify-center h-14 w-14 rounded-lg bg-slate-100 dark:bg-slate-900 border font-mono">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground">
                      {format(new Date(event.date), 'MMM')}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {format(new Date(event.date), 'dd')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4
                      className={`font-semibold text-sm sm:text-base  ${event.isDismissed ? 'line-through' : ''}`}
                    >
                      {event.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span
                        className="flex items-center gap-1.5 hover:text-sky-600 cursor-pointer"
                        onClick={() => handleNavigatePersonCompany(event)}
                      >
                        {event.personName ? (
                          <User className="h-3.5 w-3.5" />
                        ) : (
                          <Building2 className="h-3.5 w-3.5" />
                        )}
                        {event.personName ?? event.companyName ?? 'N/A'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5" />
                        {event.addedByUserName}
                      </span>
                      <Badge
                        variant="outline"
                        className={`uppercase tracking-wider font-bold ${getEventColor(event.type)}`}
                      >
                        {event.type.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full border">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(event.date), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t">
          {data && data.totalCount > 0 && (
            <Pagination
              currentPage={data.pageNumber}
              totalPages={data.totalPages}
              pageSize={query.pageSize || DEFAULT_PAGE_SIZE}
              totalCount={data.totalCount}
              hasNextPage={data.hasNextPage}
              hasPreviousPage={data.hasPreviousPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
