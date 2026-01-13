import { useState } from 'react'
import { useStaffsQueries } from '../hooks/useStaffsQueries'
import { useStaffs } from '../hooks/useStaffs'
import { StaffsFilters } from '../components/StaffsFilters'
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
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  User2,
} from 'lucide-react'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import type { StaffQuery } from '../types'
import type { User } from '@/features/auth/types/auth.types'
import { Pagination } from '@/components/common/Pagination'
import { openUpSertStaffModal } from '../components/UpsertStaff'
import { openUpSertRolesModal } from '../components/UpsertRoles'
import { ErrorState } from '@/components/common/ErrorState'
import { useAlert } from '@/contexts/AlertContext'
import { formatDate } from '@/lib/utils'
import { ROLES_LABEL } from '../constants'
import { useAuth } from '@/features/auth/hooks/useAuth'

export const StaffsTable = () => {
  const { openAlert } = useAlert()
  const [query, setQuery] = useState<StaffQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'Id',
    sortDescending: true,
    fullName: '',
    email: '',
    phoneNumber: '',
  })
  const { user } = useAuth()

  const { useStaffsList } = useStaffsQueries()
  const { data: staffs, isLoading, error, refetch } = useStaffsList(query)

  const { deleteStaff } = useStaffs()

  const handleFilterChange = (filters: Partial<StaffQuery>) => {
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

  const handlePageChange = (newPage: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: newPage }))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize: newPageSize, pageNumber: 1 }))
  }

  const handleDelete = (staff: User) => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete ${staff.fullName} and all associated
              data.`,
      confirmText: 'Delete',
      onConfirm: () => {
        deleteStaff(staff.id)
      },
    })
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <div className="space-y-4">
      <StaffsFilters
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="flex justify-end">
        <Button
          variant={'sky'}
          onClick={() =>
            openUpSertStaffModal({
              staff: null,
            })
          }
        >
          <Plus className="h-4 w-4" />
          Add Staff
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Roles</TableHead>
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
            ) : staffs?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center h-64 text-muted-foreground"
                >
                  No staffs found
                </TableCell>
              </TableRow>
            ) : (
              staffs?.data.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium">
                    {staff.fullName || '-'}{' '}
                    {staff.id === user?.id && (
                      <Badge variant="success" className="font-normal ml-1">
                        YOU
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{staff.email || '-'}</TableCell>
                  <TableCell>{staff.phoneNumber || '-'}</TableCell>
                  <TableCell>
                    {formatDate(staff.dateOfBirth || undefined)}
                  </TableCell>
                  <TableCell>
                    {staff.roles.length > 0
                      ? staff.roles.map((role) => {
                          return (
                            <Badge
                              variant={
                                role === ROLES_LABEL.ADMIN ? 'info' : 'muted'
                              }
                              className="font-normal mr-1"
                            >
                              {role}
                            </Badge>
                          )
                        })
                      : '-'}
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
                          onClick={() =>
                            openUpSertRolesModal({
                              staff,
                            })
                          }
                        >
                          <User2 className="h-4 w-4 mr-2" />
                          Update Roles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            openUpSertStaffModal({
                              staff,
                            })
                          }
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(staff)}
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

      {staffs && staffs.totalCount > 0 && (
        <Pagination
          currentPage={staffs.pageNumber}
          totalPages={staffs.totalPages}
          pageSize={query.pageSize || DEFAULT_PAGE_SIZE}
          totalCount={staffs.totalCount}
          hasNextPage={staffs.hasNextPage}
          hasPreviousPage={staffs.hasPreviousPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}

export default StaffsTable
