import { useState } from 'react'
import { useLendersQueries } from '../../hooks/useLendersQueries'
import { useLenders } from '../../hooks/useLenders'
import { LendersFilters } from './LendersFilters'
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
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import type { LenderQuery, Lender } from '../../types'
import { Pagination } from '@/components/common/Pagination'
import { openUpSertLenderModal } from './UpSertLender'
import { ErrorState } from '@/components/common/ErrorState'
import { useAlert } from '@/contexts/AlertContext'
import { useNavigate } from 'react-router-dom'

export const LendersTable = () => {
  const navigate = useNavigate()
  const { openAlert } = useAlert()
  const [query, setQuery] = useState<LenderQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'CreatedAt',
    sortDescending: true,
    name: '',
  })

  const { useLendersList } = useLendersQueries()
  const { data: lenders, isLoading, error, refetch } = useLendersList(query)

  const { deleteLender } = useLenders()

  const handleFilterChange = (filters: Partial<LenderQuery>) => {
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
      sortBy: 'Id',
      sortDescending: true,
    })
  }

  const handleView = (lender: Lender) => {
    navigate(`/admin/lenders/${lender.id}`, {
      state: { label: lender.name },
    })
  }

  const handlePageChange = (newPage: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: newPage }))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize: newPageSize, pageNumber: 1 }))
  }

  const handleDelete = (lender: Lender) => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete ${lender.name} and all associated
              data.`,
      confirmText: 'Delete',
      onConfirm: () => {
        deleteLender(lender.id)
      },
    })
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <div className="space-y-4">
      <LendersFilters
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="flex justify-end">
        <Button
          variant={'sky'}
          onClick={() => {
            openUpSertLenderModal({ lender: null })
          }}
        >
          <Plus className="h-4 w-4" />
          Add Lender
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
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
            ) : lenders?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center h-64 text-muted-foreground"
                >
                  No lenders found
                </TableCell>
              </TableRow>
            ) : (
              lenders?.data.map((lender) => (
                <TableRow key={lender.id}>
                  <TableCell className="font-medium">
                    {lender.logoUrl ? (
                      <div className="h-20 w-32 flex items-center justify-center">
                        <img
                          src={lender.logoUrl}
                          alt={`${lender.name} logo`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{lender.name}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(lender)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            openUpSertLenderModal({ lender })
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(lender)}
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

      {lenders && lenders.totalCount > 0 && (
        <Pagination
          currentPage={lenders.pageNumber}
          totalPages={lenders.totalPages}
          pageSize={query.pageSize || DEFAULT_PAGE_SIZE}
          totalCount={lenders.totalCount}
          hasNextPage={lenders.hasNextPage}
          hasPreviousPage={lenders.hasPreviousPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}
