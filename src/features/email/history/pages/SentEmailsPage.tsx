import { useState } from 'react'
import { useSentEmailQueries } from '../hooks/useSentEmailsQueries'
import { useSentEmails } from '../hooks/useSentEmails'
import { SentEmailsFilters } from '../components/SentEmailsFilters'
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
import { MoreHorizontal, Pencil, Eye, Loader2, Send } from 'lucide-react'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import type {
  SentEmailQuery,
  SentEmail,
  SentEmailStatusBadgeVariantType,
} from '../types'
import { Pagination } from '@/components/common/Pagination'
import { ErrorState } from '@/components/common/ErrorState'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { SENT_EMAIL_STATUS_VARIANT_MAPPING } from '../constants'

export const SentEmailsPage = () => {
  const [query, setQuery] = useState<SentEmailQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'CreatedAt',
    sortDescending: true,
    recipientEmail: '',
    subject: '',
    status: undefined,
    fromSentAt: undefined,
    toSentAt: undefined,
    templateId: undefined,
    brokerId: undefined,
  })

  const { useSentEmailsList } = useSentEmailQueries()
  const {
    data: sentEmails,
    isLoading,
    error,
    refetch,
  } = useSentEmailsList(query)

  const { resendEmailAsync } = useSentEmails()

  const handleFilterChange = (filters: Partial<SentEmailQuery>) => {
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

  const handleResendEmail = async (sentEmail: SentEmail) => {
    await resendEmailAsync(sentEmail.id)
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Email History</h1>
          <p className="text-muted-foreground mt-1">
            Manage your email history and send email
          </p>
        </div>
      </div>
      <div className="mt-6">
        <div className="space-y-4">
          <SentEmailsFilters
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />

          <div className="flex justify-end">
            <Button variant={'sky'}>
              <Send className="h-4 w-4" />
              Send Email
            </Button>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template</TableHead>
                  <TableHead>Recipient Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>From Email</TableHead>
                  <TableHead>From Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Failure Reason</TableHead>
                  <TableHead>Sent At</TableHead>
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
                ) : sentEmails?.data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center h-64 text-muted-foreground"
                    >
                      No sent email found
                    </TableCell>
                  </TableRow>
                ) : (
                  sentEmails?.data.map((sentEmail) => (
                    <TableRow key={sentEmail.id}>
                      <TableCell>{sentEmail.templateName || '-'}</TableCell>
                      <TableCell>{sentEmail.recipientEmail || '-'}</TableCell>
                      <TableCell>{sentEmail.subject || '-'}</TableCell>
                      <TableCell>{sentEmail.fromEmail || '-'}</TableCell>
                      <TableCell>{sentEmail.fromName || '-'}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            SENT_EMAIL_STATUS_VARIANT_MAPPING[
                              sentEmail.status
                            ] as SentEmailStatusBadgeVariantType
                          }
                        >
                          {sentEmail.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{sentEmail.failureReason || '-'}</TableCell>
                      <TableCell>
                        {sentEmail.sentAt ? formatDate(sentEmail.sentAt) : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleResendEmail(sentEmail)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Resend
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

          {sentEmails && sentEmails.totalCount > 0 && (
            <Pagination
              currentPage={sentEmails.pageNumber}
              totalPages={sentEmails.totalPages}
              pageSize={query.pageSize || DEFAULT_PAGE_SIZE}
              totalCount={sentEmails.totalCount}
              hasNextPage={sentEmails.hasNextPage}
              hasPreviousPage={sentEmails.hasPreviousPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default SentEmailsPage
