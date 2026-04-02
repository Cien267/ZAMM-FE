import { useState } from 'react'
import { useLoansQueries } from '../hooks/useLoansQueries'
import { useLoans } from '../hooks/useLoans'
// import { LoansFilters } from '../components/LoansFilters'
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
import type { LoanQuery, Loan, InterestRate, InterestRateType } from '../types'
import { Pagination } from '@/components/common/Pagination'
import { openUpdateLoanModal } from './UpdateLoan'
import { openCreateLoanModal } from './CreateLoan'
import { ErrorState } from '@/components/common/ErrorState'
import { useAlert } from '@/contexts/AlertContext'
import type { Lender } from '@/features/lenders/types'
import { formatDate } from '@/lib/utils'

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

  const { deleteLoanAsync } = useLoans()

  // const handleFilterChange = (filters: Partial<LoanQuery>) => {
  //   setQuery((prev) => ({
  //     ...prev,
  //     ...filters,
  //     pageNumber: 1,
  //   }))
  // }

  // const handleResetFilters = () => {
  //   setQuery({
  //     pageNumber: 1,
  //     pageSize: DEFAULT_PAGE_SIZE,
  //     sortBy: 'CreatedAt',
  //     sortDescending: true,
  //     name: '',
  //     lenderId: lender.id,
  //   })
  // }

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
      onConfirm: async () => {
        await deleteLoanAsync(loan.id)
      },
    })
  }

  const getRate = (
    rates: InterestRate[] | undefined,
    type: InterestRateType
  ) => {
    if (!rates) return 0
    const rate = rates.find((r) => r.rateType === type)
    return rate ? rate.rate : 0
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{lender.name}'s Loans</h2>
      {/* <LoansFilters
        lender={lender}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      /> */}
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
              <TableHead>Current Rate OO-P&I (%)</TableHead>
              <TableHead>Current Rate OO-IO (%)</TableHead>
              <TableHead>Current Rate INV-P&I (%)</TableHead>
              <TableHead>Current Rate INV-IO (%)</TableHead>
              <TableHead>Updated At</TableHead>
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
                  <TableCell>{getRate(loan?.interestRates, 'OOPI')}</TableCell>
                  <TableCell>{getRate(loan?.interestRates, 'OOIO')}</TableCell>
                  <TableCell>{getRate(loan?.interestRates, 'IVPI')}</TableCell>
                  <TableCell>{getRate(loan?.interestRates, 'IVIO')}</TableCell>
                  <TableCell>{formatDate(new Date(loan.updatedAt))}</TableCell>
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
