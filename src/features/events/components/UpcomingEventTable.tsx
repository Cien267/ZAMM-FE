import { useState } from 'react'
import { useEventQueries } from '../hooks/useEventsQueries'
import { UpcomingEventFilters } from './UpcomingEventFilters'
import { Pagination } from '@/components/common/Pagination'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Users, Building2 } from 'lucide-react'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import type { Event, EventQuery } from '../types'
import { useNavigate } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { formatDate } from '@/lib/utils'
import { openDetailEventModal } from '@/features/events/components/DetailEvent'

export const UpcomingEventTable = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState<EventQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'Id',
    sortDescending: true,
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
  const { data, isLoading, error } = useEventsList(query)

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

  if (error) {
    return <ErrorState message={error.message} />
  }

  return (
    <Card className="mb-6 shadow-sm pt-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300">
            Upcoming Events
          </CardTitle>
        </div>
        <UpcomingEventFilters onFilterChange={handleFilterChange} />
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg mb-6 overflow-hidden">
          <div className="relative w-full max-h-65 overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Title</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Broker</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : data?.data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center h-64 text-muted-foreground"
                    >
                      No upcoming events
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data.map((event) => (
                    <TableRow
                      key={event.id}
                      className={`${event.isDismissed ? 'bg-gray-50' : ''}`}
                    >
                      <TableCell
                        onClick={() =>
                          openDetailEventModal({
                            event,
                            type: getTypeEventModal(event),
                            personId: event.personId || null,
                            companyId: event.companyId || null,
                            liabilityId: event.liabilityId || null,
                          })
                        }
                        className={`font-medium hover:underline hover:text-blue-400 text-blue-500 cursor-pointer ${event.isDismissed ? 'line-through' : ''}`}
                      >
                        {event.title}
                      </TableCell>
                      <TableCell
                        className={`${event.isDismissed ? 'line-through' : ''}`}
                      >
                        {formatDate(event.date)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={event.isSystem ? 'secondary' : 'outline'}
                          className={`${event.isDismissed ? 'line-through' : ''}`}
                        >
                          {event.type.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell
                        onClick={() => handleNavigatePersonCompany(event)}
                        className={`flex gap-2 font-medium hover:underline hover:text-blue-400 text-blue-500 cursor-pointer ${event.isDismissed ? 'line-through' : ''}`}
                      >
                        {event.personName ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          <Building2 className="h-4 w-4" />
                        )}
                        {event.personName ?? event.companyName ?? '-'}
                      </TableCell>
                      <TableCell
                        className={`${event.isDismissed ? 'line-through' : ''}`}
                      >
                        {event.addedByUserName || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

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
      </CardContent>
    </Card>
  )
}
