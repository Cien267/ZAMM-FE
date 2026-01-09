import { useState } from 'react'
import { useCompanyQueries } from '../hooks/useCompaniesQueries'
import { useCompanies } from '../hooks/useCompanies'
import { CompanyFilters } from './CompanyFilters'
import { Pagination } from '@/components/common/Pagination'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import type { CompanyQuery, Company } from '../types'
import { openUpSertCompanyModal } from './UpsertCompany'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '@/contexts/AlertContext'

export const CompanyTable = () => {
  const navigate = useNavigate()
  const { openAlert } = useAlert()
  const [query, setQuery] = useState<CompanyQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'Id',
    sortDescending: true,
    name: '',
    tradingName: '',
    type: '',
    abn: '',
    acn: '',
    email: '',
    industry: '',
    brokerId: '',
  })

  const { useCompaniesList } = useCompanyQueries()
  const { data, isLoading, error } = useCompaniesList(query)
  const { deleteCompany } = useCompanies()

  const handleFilterChange = (filters: Partial<CompanyQuery>) => {
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

  const handleDelete = (company: Company) => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete ${company.name} and all associated
              data.`,
      confirmText: 'Delete',
      onConfirm: () => {
        deleteCompany(company.id)
      },
    })
  }

  const handleView = (company: Company) => {
    navigate(`/clients/companies/${company.id}`)
  }

  const formatABN = (abn?: string) => {
    if (!abn) return '-'
    return abn.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
  }

  const formatACN = (acn?: string) => {
    if (!acn) return '-'
    return acn.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
  }

  const getContactInfo = (company: Company) => {
    if (company.isContactExistingPerson && company.contactPerson) {
      return company.contactPerson.fullName
    }
    if (company.externalContactName) {
      return company.externalContactName
    }
    return '-'
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          Error loading companies: {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <CompanyFilters
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="flex justify-end">
        <Button
          onClick={() => openUpSertCompanyModal({ company: null })}
          variant={'sky'}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Trading Name</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">ABN/ACN</TableHead>
              <TableHead className="font-semibold">Industry</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
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
                  No companies found
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.tradingName || '-'}</TableCell>
                  <TableCell>
                    {company.type ? (
                      <Badge variant="outline" className="font-normal">
                        {company.type}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {company.abn && (
                        <div>
                          <span className="text-muted-foreground">ABN: </span>
                          {formatABN(company.abn)}
                        </div>
                      )}
                      {company.acn && (
                        <div>
                          <span className="text-muted-foreground">ACN: </span>
                          {formatACN(company.acn)}
                        </div>
                      )}
                      {!company.abn && !company.acn && '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {company.industry ? (
                      <Badge variant="secondary" className="font-normal">
                        {company.industry}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {getContactInfo(company)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(company)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openUpSertCompanyModal({ company })}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(company)}
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

export default CompanyTable
