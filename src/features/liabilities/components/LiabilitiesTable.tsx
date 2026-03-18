import { useState } from 'react'
import { useLiabilityQueries } from '../hooks/useLiabilityQueries'
import { useLiabilities } from '../hooks/useLiabilities'
import { LiabilitiesFilters } from './LiabilitiesFilters'
import { Pagination } from '@/components/common/Pagination'
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
import type { LiabilityQuery, Liability } from '../types'
import { formatCurrency } from '@/lib/utils'
import { ErrorState } from '@/components/common/ErrorState'
import type { Person } from '@/features/people/types'
import type { Company } from '@/features/companies/types'
import { openUpSertLiabilityModal } from './UpsertLiability'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '@/contexts/AlertContext'
import { calculateEffectiveInterestRate } from '@/lib/liabilitySupport'
import { useEvents } from '@/features/events/hooks/useEvents'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ASSET_DELETE_EVENT } from '@/features/events/constants'
import { useActivityLogs } from '@/features/activity-logs/hooks/useActivityLogs'
import {
  ACTION_TYPE_VIEWED,
  ENTITY_TYPE_LIABILITY,
  ACTION_TYPE_DELETED,
} from '@/features/activity-logs/constants'

interface LiabilitiesTableProps {
  initialData: Person | Company | null
  type: 'person' | 'company'
}

export const LiabilitiesTable = ({
  initialData,
  type,
}: LiabilitiesTableProps) => {
  const { openAlert } = useAlert()
  const personId =
    type === 'person' && initialData ? (initialData as Person).id : undefined
  const companyId =
    type === 'company' && initialData ? (initialData as Person).id : undefined
  const [query, setQuery] = useState<LiabilityQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'CreatedAt',
    sortDescending: true,
    personId: personId,
    companyId: companyId,
    name: '',
    loanId: '',
    financePurpose: '',
    startDateFrom: undefined,
    startDateTo: undefined,
  })

  const { useLiabilitiesList } = useLiabilityQueries()
  const { data, isLoading, error, refetch } = useLiabilitiesList(query)
  const { deleteLiabilityAsync } = useLiabilities()
  const navigate = useNavigate()
  const { createEvent } = useEvents()
  const { user } = useAuth()
  const { createActivityLog } = useActivityLogs()

  const handleFilterChange = (filters: Partial<LiabilityQuery>) => {
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
      personId: personId,
      companyId: companyId,
      name: '',
      loanId: '',
      financePurpose: '',
      startDateFrom: undefined,
      startDateTo: undefined,
    })
  }

  const handlePageChange = (newPage: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: newPage }))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize: newPageSize, pageNumber: 1 }))
  }

  const handleDelete = (liability: Liability) => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete ${liability.name} and all associated
              data.`,
      confirmText: 'Delete',
      showTimelineCheckbox: true,
      onConfirm: async () => {
        await deleteLiabilityAsync(liability.id)
      },
      onSuccess: (reason?: string) => {
        createEvent({
          title: `Delete Liability ${liability.name}`,
          description: reason,
          type: ASSET_DELETE_EVENT,
          date: new Date(),
          isSystem: false,
          isRepeating: false,
          isDismissed: false,
          repeatingDateDismissed: undefined,
          addedByUserId: user?.id || '',
          personId:
            type === 'person' && initialData
              ? (initialData as Person).id
              : undefined,
          companyId:
            type === 'company' && initialData
              ? (initialData as Company).id
              : undefined,
        })
        createActivityLog({
          brokerId: user?.id || '',
          brokerageId: user?.brokerageId || '',
          actionType: ACTION_TYPE_DELETED,
          entityType: ENTITY_TYPE_LIABILITY,
          entityId: liability.id,
        })
      },
    })
  }

  const handleView = (liability: Liability) => {
    createActivityLog({
      brokerId: user?.id || '',
      brokerageId: user?.brokerageId || '',
      actionType: ACTION_TYPE_VIEWED,
      entityType: ENTITY_TYPE_LIABILITY,
      entityId: liability.id,
    })
    const params = new URLSearchParams()
    if (personId) params.append('personId', personId)
    if (companyId) params.append('companyId', companyId)
    navigate(`/clients/liabilities/${liability.id}?${params.toString()}`)
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <div className="space-y-4">
      <LiabilitiesFilters
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="flex justify-end">
        <Button
          variant="sky"
          onClick={() =>
            openUpSertLiabilityModal({
              liability: null,
              type: type,
              initialAsset: null,
              initialPerson: type === 'person' ? (initialData as Person) : null,
              initialCompany:
                type === 'company' ? (initialData as Company) : null,
            })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Liability
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Lender</TableHead>
              <TableHead className="font-semibold">Loan</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Effective Rate</TableHead>
              <TableHead className="text-right font-semibold">
                Actions
              </TableHead>
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
                  No liabilities found
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((liability) => (
                <TableRow key={liability.id}>
                  <TableCell className="font-medium">
                    {liability.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {liability.lenderName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {liability.loan.name}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(Number(liability.amount || 0))}
                  </TableCell>
                  <TableCell className="font-medium">
                    {calculateEffectiveInterestRate({
                      loan: liability.loan,
                      financePurpose: liability.financePurpose || 'Investment',
                      commencementDate: liability.startDate
                        ? new Date(liability.startDate)
                        : null,
                      interestOnlyTerm: liability.interestOnlyTerm,
                      discountPercent: liability.discountPercent,
                      introRateYears: liability.introRateYears,
                      introRatePercent: liability.introRatePercent,
                      settlementRate: liability.settlementRate,
                      fixedRatePeriods: liability.fixedRatePeriods,
                    })?.rate || 0}
                    %
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(liability)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            openUpSertLiabilityModal({
                              liability: liability,
                              type: type,
                              initialAsset: null,
                              initialPerson:
                                type === 'person'
                                  ? (initialData as Person)
                                  : null,
                              initialCompany:
                                type === 'company'
                                  ? (initialData as Company)
                                  : null,
                            })
                          }
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(liability)}
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
  )
}
