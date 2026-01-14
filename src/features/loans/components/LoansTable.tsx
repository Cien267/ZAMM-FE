import { useState } from 'react'
import { useLoansQueries } from '../hooks/useLoansQueries'
import { useLoans } from '../hooks/useLoans'
import { LoansFilters } from '../components/LoansFilters'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Plus, MoreHorizontal, Pencil, Trash2, Loader2 } from 'lucide-react'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import type { LoanQuery, Loan, InterestRate } from '../types'
import { Pagination } from '@/components/common/Pagination'
import { openUpdateLoanModal } from './UpdateLoan'
import { openCreateLoanModal } from './CreateLoan'
import { ErrorState } from '@/components/common/ErrorState'
import { useAlert } from '@/contexts/AlertContext'
import type { Lender } from '@/features/lenders/types'
import { INTEREST_RATE_TYPES } from '../constants'

interface LoansTableProps {
  lender: Lender
}

export const LoansTable = ({ lender }: LoansTableProps) => {
  const { openAlert } = useAlert()
  const [query, setQuery] = useState<LoanQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'CreatedAt',
    sortDescending: true,
    name: '',
    lenderId: lender.id,
  })

  const { useLoansList } = useLoansQueries()
  const { data: loans, isLoading, error, refetch } = useLoansList(query)

  const { deleteLoan } = useLoans()

  const handleFilterChange = (filters: Partial<LoanQuery>) => {
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
      name: '',
      lenderId: lender.id,
    })
  }

  const handlePageChange = (newPage: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: newPage }))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize: newPageSize, pageNumber: 1 }))
  }

  const handleDelete = (loan: Loan) => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete ${loan.name} and all associated
              data.`,
      confirmText: 'Delete',
      onConfirm: () => {
        deleteLoan(loan.id)
      },
    })
  }

  const getInterestRateType = (interestRate: InterestRate) => {
    return (
      INTEREST_RATE_TYPES.find((type) => type.value === interestRate.rateType)
        ?.label || '-'
    )
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <div className="space-y-4">
      <LoansFilters
        lender={lender}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="flex justify-end">
        <Button
          variant={'sky'}
          onClick={() => {
            openCreateLoanModal({ lender: lender })
          }}
        >
          <Plus className="h-4 w-4" />
          Add Loan
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Interest Rates</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : loans?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center h-64 text-muted-foreground"
                >
                  No loans found
                </TableCell>
              </TableRow>
            ) : (
              loans?.data.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.name}</TableCell>
                  <TableCell className="font-medium flex flex-col justify-start items-start gap-2">
                    {(loan?.interestRates || []).map((interestRate) => (
                      <div key={interestRate.id}>
                        <span className="text-accent-foreground font-normal mr-2">
                          🔹 {getInterestRateType(interestRate)}:{' '}
                        </span>{' '}
                        {interestRate.rate}%
                      </div>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            openUpdateLoanModal({ lender: lender, loan: loan })
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(loan)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {loans && loans.totalCount > 0 && (
        <Pagination
          currentPage={loans.pageNumber}
          totalPages={loans.totalPages}
          pageSize={query.pageSize || DEFAULT_PAGE_SIZE}
          totalCount={loans.totalCount}
          hasNextPage={loans.hasNextPage}
          hasPreviousPage={loans.hasPreviousPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}

export default LoansTable
