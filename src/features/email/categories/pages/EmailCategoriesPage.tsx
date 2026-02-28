import { useState } from 'react'
import { useEmailCategoryQueries } from '../hooks/useEmailCategoriesQueries'
import { useEmailCategories } from '../hooks/useEmailCategories'
import { EmailCategoriesFilters } from '../components/EmailCategoriesFilters'
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
import type { EmailCategoryQuery } from '../types'
import type { EmailCategory } from '../types'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/common/ErrorState'
import { useAlert } from '@/contexts/AlertContext'
import { openUpSertEmailCategoryModal } from '../components/UpsertEmailCategory'
import { Badge } from '@/components/ui/badge'

export const EmailCategoriesPage = () => {
  const { openAlert } = useAlert()
  const [query, setQuery] = useState<EmailCategoryQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'CreatedAt',
    sortDescending: true,
    name: '',
    isActive: undefined,
    brokerId: undefined,
  })

  const { useEmailCategoriesList } = useEmailCategoryQueries()
  const {
    data: emailCategories,
    isLoading,
    error,
    refetch,
  } = useEmailCategoriesList(query)

  const { deleteEmailCategory } = useEmailCategories()

  const handleFilterChange = (filters: Partial<EmailCategoryQuery>) => {
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
    })
  }

  const handlePageChange = (newPage: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: newPage }))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize: newPageSize, pageNumber: 1 }))
  }

  const handleDelete = (emailCategory: EmailCategory) => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete ${emailCategory.name} and all associated
              data.`,
      confirmText: 'Delete',
      onConfirm: () => {
        deleteEmailCategory(emailCategory.id)
      },
    })
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Email Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your email categories
          </p>
        </div>
      </div>
      <div className="mt-6">
        <div className="space-y-4">
          <EmailCategoriesFilters
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          <div className="flex justify-end">
            <Button
              variant={'sky'}
              onClick={() =>
                openUpSertEmailCategoryModal({
                  emailCategory: null,
                })
              }
            >
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
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
                ) : emailCategories?.data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center h-64 text-muted-foreground"
                    >
                      No email categories found
                    </TableCell>
                  </TableRow>
                ) : (
                  emailCategories?.data.map((emailCategory) => (
                    <TableRow key={emailCategory.id}>
                      <TableCell>{emailCategory.name || '-'}</TableCell>
                      <TableCell>{emailCategory.description || '-'}</TableCell>
                      <TableCell>
                        {emailCategory.isActive ? (
                          <Badge variant={'info'}>Active</Badge>
                        ) : (
                          <Badge variant={'secondary'}>Inactive</Badge>
                        )}
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
                                openUpSertEmailCategoryModal({
                                  emailCategory,
                                })
                              }
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(emailCategory)}
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

          {emailCategories && emailCategories.totalCount > 0 && (
            <Pagination
              currentPage={emailCategories.pageNumber}
              totalPages={emailCategories.totalPages}
              pageSize={query.pageSize || DEFAULT_PAGE_SIZE}
              totalCount={emailCategories.totalCount}
              hasNextPage={emailCategories.hasNextPage}
              hasPreviousPage={emailCategories.hasPreviousPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default EmailCategoriesPage
