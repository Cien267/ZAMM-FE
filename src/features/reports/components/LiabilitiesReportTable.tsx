import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { TrendingDown } from 'lucide-react'
import { useReports } from '../hooks/useReports'
import type { LiabilityReportQuery } from '../types'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ErrorState } from '@/components/common/ErrorState'
import { Pagination } from '@/components/common/Pagination'
import type { Liability } from '@/features/liabilities/types'
import { calculateEffectiveInterestRate } from '@/lib/liabilitySupport'
import { LiabilitiesReportFilters } from './LiabilitiesReportFilters'

export const LiabilitiesReportTable = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState<LiabilityReportQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'CreatedAt',
    sortDescending: true,
    financePurpose: '',
    loanIds: [],
    loanType: '',
    repayment: '',
    startDateFrom: undefined,
    startDateTo: undefined,
    discountPercentValue: undefined,
    discountPercentOperator: 'lt',
    amountValue: undefined,
    amountOperator: 'lt',
    fixedRateEndDate: undefined,
    fixedRateEndOperator: 'before',
  })

  const { useLiabilityReport } = useReports()
  const {
    data: liabilitiesReport,
    isLoading,
    error,
    refetch,
  } = useLiabilityReport(query)

  const handleFilterChange = (filters: Partial<LiabilityReportQuery>) => {
    setQuery((prev) => ({
      ...prev,
      ...filters,
      pageNumber: 1,
    }))
  }

  const handleResetFilters = () => {
    setQuery({
      pageNumber: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: 'CreatedAt',
      sortDescending: true,
      loanIds: [],
      financePurpose: '',
      loanType: '',
      repayment: '',
      startDateFrom: undefined,
      startDateTo: undefined,
      discountPercentValue: undefined,
      discountPercentOperator: 'lt',
      amountValue: undefined,
      amountOperator: 'lt',
      fixedRateEndDate: undefined,
      fixedRateEndOperator: 'before',
    })
  }

  const handlePageChange = (newPage: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: newPage }))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize: newPageSize, pageNumber: 1 }))
  }

  const formatBorrowers = (liability: any) => {
    const people = liability.liabilityPeople?.map(
      (lp: any) => `${lp.personName} (${lp.percent}%)`
    )
    const companies = liability.liabilityCompanies?.map(
      (lc: any) => `${lc.companyName} (${lc.percent}%)`
    )
    return [...(people || []), ...(companies || [])].join(', ')
  }

  const formatAssets = (liability: any) => {
    return liability.liabilityAssets?.map((la: any) => la.assetName).join(', ')
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  const handleNavigateLiability = (liability: Liability) => {
    const params = new URLSearchParams()
    if (liability?.liabilityPeople && liability.liabilityPeople.length > 0)
      params.append('personId', liability?.liabilityPeople[0].personId)
    if (
      liability?.liabilityCompanies &&
      liability?.liabilityCompanies.length > 0
    )
      params.append('companyId', liability?.liabilityCompanies[0].companyId)

    navigate(`/clients/liabilities/${liability.id}?${params.toString()}`)
  }

  return (
    <>
      <LiabilitiesReportFilters
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Liabilities Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5" />
                  Liabilities Report
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
          ) : (
            <div className="rounded-md border mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Liability Name</TableHead>
                    <TableHead>Lender</TableHead>
                    <TableHead>Loan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Terms</TableHead>
                    <TableHead>Borrowers</TableHead>
                    <TableHead>Secured Assets</TableHead>
                    <TableHead>Effective Rate</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {liabilitiesReport?.data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="text-center text-muted-foreground py-8"
                      >
                        No liabilities found matching the current filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    liabilitiesReport?.data.map((liability) => (
                      <TableRow key={liability.id}>
                        <TableCell
                          onClick={() => handleNavigateLiability(liability)}
                          className="hover:underline hover:text-blue-400 text-blue-500 cursor-pointer font-medium"
                        >
                          {liability.name}
                        </TableCell>
                        <TableCell>
                          {liability.lenderName || (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {liability.loanId ? (
                            liability.loan.name
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {liability.amount
                                ? formatCurrency(liability.amount)
                                : '-'}
                            </span>
                            {liability.initialBalance && (
                              <span className="text-xs text-muted-foreground">
                                Initial:{' '}
                                {formatCurrency(liability.initialBalance)}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {liability.financePurpose ? (
                            <Badge variant="secondary">
                              {liability.financePurpose}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {liability.startDate
                            ? formatDate(new Date(liability.startDate))
                            : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-sm">
                            {liability.loanTerm && (
                              <div>
                                <span className="text-muted-foreground">
                                  Loan: {liability.loanTerm}y
                                </span>
                              </div>
                            )}
                            {liability.interestOnlyTerm && (
                              <div>
                                <span className="text-muted-foreground">
                                  IO: {liability.interestOnlyTerm}y
                                </span>
                              </div>
                            )}
                            {!liability.loanTerm &&
                              !liability.interestOnlyTerm && (
                                <span className="text-muted-foreground">-</span>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground max-w-50 truncate">
                            {formatBorrowers(liability) || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground max-w-45 truncate">
                            {formatAssets(liability) || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground max-w-45 truncate">
                            {calculateEffectiveInterestRate({
                              loan: liability.loan,
                              financePurpose:
                                liability.financePurpose || 'Investment',
                              commencementDate: liability.startDate
                                ? new Date(liability.startDate)
                                : null,
                              interestOnlyTerm: liability.interestOnlyTerm,
                              discountPercent: liability.discountPercent,
                              introRateYears: liability.introRateYears,
                              introRatePercent: liability.introRatePercent,
                            })?.rate || 0}
                            %
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {liability.createdAt
                            ? formatDate(new Date(liability.createdAt))
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {liabilitiesReport && liabilitiesReport.totalCount > 0 && (
            <Pagination
              currentPage={liabilitiesReport.pageNumber}
              totalPages={liabilitiesReport.totalPages}
              pageSize={query.pageSize || DEFAULT_PAGE_SIZE}
              totalCount={liabilitiesReport.totalCount}
              hasNextPage={liabilitiesReport.hasNextPage}
              hasPreviousPage={liabilitiesReport.hasPreviousPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </CardContent>
      </Card>
    </>
  )
}
