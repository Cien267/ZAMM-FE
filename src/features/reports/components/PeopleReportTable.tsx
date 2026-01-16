import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useReports } from '../hooks/useReports'
import type { PeopleReportQuery } from '../types'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import {
  GENDER_VARIANT_MAPPING,
  MARITAL_STATUS_VARIANT_MAPPING,
} from '@/features/people/constants'
import { ErrorState } from '@/components/common/ErrorState'
import { Pagination } from '@/components/common/Pagination'

export const PeopleReportTable = () => {
  const [query, setQuery] = useState<PeopleReportQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'CreatedAt',
    sortDescending: true,
    dateFrom: '',
    dateTo: '',
    name: '',
    email: '',
  })

  const { usePeopleReport } = useReports()
  const {
    data: peopleReport,
    isLoading,
    error,
    refetch,
  } = usePeopleReport(query)

  const handlePageChange = (newPage: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: newPage }))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize: newPageSize, pageNumber: 1 }))
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            People Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          People Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Marital Status</TableHead>
                <TableHead>Broker</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {peopleReport?.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center h-64 text-muted-foreground"
                  >
                    No people found
                  </TableCell>
                </TableRow>
              ) : (
                peopleReport?.data.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">
                      <Link
                        to={`/clients/people/${person.id}`}
                        className="hover:underline hover:text-blue-400 text-blue-500 cursor-pointer"
                      >
                        {person.fullName}
                      </Link>
                    </TableCell>
                    <TableCell>{person.email || '-'}</TableCell>
                    <TableCell>
                      {person.phoneMobile || person.phoneWork || '-'}
                    </TableCell>
                    <TableCell>
                      {person.gender ? (
                        <Badge
                          variant={
                            GENDER_VARIANT_MAPPING[person.gender] || 'default'
                          }
                          className="font-normal"
                        >
                          {person.gender}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      {person.maritalStatus ? (
                        <Badge
                          variant={
                            MARITAL_STATUS_VARIANT_MAPPING[
                              person.maritalStatus
                            ] || 'default'
                          }
                          className="font-normal"
                        >
                          {person.maritalStatus}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{person.brokerName || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {peopleReport && peopleReport.totalCount > 0 && (
          <Pagination
            currentPage={peopleReport.pageNumber}
            totalPages={peopleReport.totalPages}
            pageSize={query.pageSize || DEFAULT_PAGE_SIZE}
            totalCount={peopleReport.totalCount}
            hasNextPage={peopleReport.hasNextPage}
            hasPreviousPage={peopleReport.hasPreviousPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </CardContent>
    </Card>
  )
}
