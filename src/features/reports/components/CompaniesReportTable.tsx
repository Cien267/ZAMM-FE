import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Building2, Mail, Globe } from 'lucide-react'
import { useReports } from '../hooks/useReports'
import type { CompanyReportQuery } from '../types'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import { formatDate } from '@/lib/utils'
import { ErrorState } from '@/components/common/ErrorState'
import { Pagination } from '@/components/common/Pagination'
import { Link } from 'react-router-dom'

export const CompaniesReportTable = () => {
  const [query, setQuery] = useState<CompanyReportQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'CreatedAt',
    sortDescending: true,
    dateFrom: '',
    dateTo: '',
    name: '',
    industry: '',
  })

  const { useCompanyReport } = useReports()
  const {
    data: companiesReport,
    isLoading,
    error,
    refetch,
  } = useCompanyReport(query)

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
            <Building2 className="h-5 w-5" />
            Companies Report
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
          <Building2 className="h-5 w-5" />
          Companies Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>ABN/ACN</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Broker</TableHead>
                <TableHead>Trust</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companiesReport?.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground py-8"
                  >
                    No companies found matching the current filters
                  </TableCell>
                </TableRow>
              ) : (
                companiesReport?.data.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <Link
                          to={`/clients/companies/${company.id}`}
                          className="hover:underline hover:text-blue-400 text-blue-500 cursor-pointer font-medium"
                        >
                          {company.name}
                        </Link>
                        {company.tradingName && (
                          <span className="text-xs text-muted-foreground">
                            T/A {company.tradingName}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {company.type ? (
                        <Badge variant="outline">{company.type}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        {company.abn && (
                          <div className="text-muted-foreground">
                            ABN: {company.abn}
                          </div>
                        )}
                        {company.acn && (
                          <div className="text-muted-foreground">
                            ACN: {company.acn}
                          </div>
                        )}
                        {!company.abn && !company.acn && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        {company.email && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-[180px]">
                              {company.email}
                            </span>
                          </div>
                        )}
                        {company.website && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Globe className="h-3 w-3" />
                            <span className="truncate max-w-[180px]">
                              {company.website}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {company.industry || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {company.brokerName || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {company.actingOnTrust ? (
                        <div className="flex flex-col">
                          <Badge variant="secondary" className="w-fit">
                            Trust
                          </Badge>
                          {company.trustName && (
                            <span className="text-xs text-muted-foreground mt-1">
                              {company.trustName}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {company.createdAt
                        ? formatDate(new Date(company.createdAt))
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {companiesReport && companiesReport.totalCount > 0 && (
          <Pagination
            currentPage={companiesReport.pageNumber}
            totalPages={companiesReport.totalPages}
            pageSize={query.pageSize || DEFAULT_PAGE_SIZE}
            totalCount={companiesReport.totalCount}
            hasNextPage={companiesReport.hasNextPage}
            hasPreviousPage={companiesReport.hasPreviousPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </CardContent>
    </Card>
  )
}
