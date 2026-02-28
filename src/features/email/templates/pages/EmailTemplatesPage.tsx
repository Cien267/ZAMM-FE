import { useState } from 'react'
import { useEmailTemplateQueries } from '../hooks/useEmailTemplatesQueries'
import { useEmailTemplates } from '../hooks/useEmailTemplates'
import { EmailTemplatesFilters } from '../components/EmailTemplatesFilters'
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
  Pencil,
  Trash2,
  Loader2,
  Eye,
} from 'lucide-react'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import type { EmailTemplateQuery } from '../types'
import type { EmailTemplate } from '../types'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/common/ErrorState'
import { useAlert } from '@/contexts/AlertContext'
import { openUpSertEmailTemplateModal } from '../components/UpsertEmailTemplate'
import { Badge } from '@/components/ui/badge'
import { Modal } from '@/components/common/modal'
import { PreviewBodyTemplate } from '../components/PreviewBodyTemplate'

export const EmailTemplatesPage = () => {
  const { openAlert } = useAlert()
  const [query, setQuery] = useState<EmailTemplateQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'CreatedAt',
    sortDescending: true,
    name: '',
    isActive: undefined,
    brokerId: undefined,
  })

  const { useEmailTemplatesList } = useEmailTemplateQueries()
  const {
    data: emailTemplates,
    isLoading,
    error,
    refetch,
  } = useEmailTemplatesList(query)

  const { deleteEmailTemplate } = useEmailTemplates()

  const handleFilterChange = (filters: Partial<EmailTemplateQuery>) => {
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

  const handleDelete = (emailTemplate: EmailTemplate) => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete ${emailTemplate.name} and all associated
              data.`,
      confirmText: 'Delete',
      onConfirm: () => {
        deleteEmailTemplate(emailTemplate.id)
      },
    })
  }

  const openPreviewBodyTemplateModal = (emailTemplate: EmailTemplate) => {
    Modal.open({
      title: emailTemplate.name,
      description: 'Preview body template',
      content: (
        <div className="h-[60vh]">
          <PreviewBodyTemplate bodyHtml={emailTemplate.bodyHtml} />
        </div>
      ),
      className: 'max-w-4xl!',
    })
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-muted-foreground mt-1">
            Manage your email templates
          </p>
        </div>
      </div>
      <div className="mt-6">
        <div className="space-y-4">
          <EmailTemplatesFilters
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          <div className="flex justify-end">
            <Button
              variant={'sky'}
              onClick={() =>
                openUpSertEmailTemplateModal({
                  emailTemplate: null,
                })
              }
            >
              <Plus className="h-4 w-4" />
              Add Template
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
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
                ) : emailTemplates?.data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center h-64 text-muted-foreground"
                    >
                      No email templates found
                    </TableCell>
                  </TableRow>
                ) : (
                  emailTemplates?.data.map((emailTemplate) => (
                    <TableRow key={emailTemplate.id}>
                      <TableCell>{emailTemplate.name || '-'}</TableCell>
                      <TableCell>{emailTemplate.subject || '-'}</TableCell>
                      <TableCell>{emailTemplate.categoryName || '-'}</TableCell>
                      <TableCell>
                        {emailTemplate.isActive ? (
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
                                openPreviewBodyTemplateModal(emailTemplate)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Preview Body Template
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                openUpSertEmailTemplateModal({
                                  emailTemplate,
                                })
                              }
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(emailTemplate)}
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

          {emailTemplates && emailTemplates.totalCount > 0 && (
            <Pagination
              currentPage={emailTemplates.pageNumber}
              totalPages={emailTemplates.totalPages}
              pageSize={query.pageSize || DEFAULT_PAGE_SIZE}
              totalCount={emailTemplates.totalCount}
              hasNextPage={emailTemplates.hasNextPage}
              hasPreviousPage={emailTemplates.hasPreviousPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default EmailTemplatesPage
