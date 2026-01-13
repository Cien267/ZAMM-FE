import { useState } from 'react'
import { useAssetQueries } from '../hooks/useAssetQueries'
import { useAssets } from '../hooks/useAssets'
import { AssetsFilters } from './AssetsFilters'
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
import type { AssetQuery, Asset } from '../types'
import { openUpSertAssetModal } from './UpSertAsset'
import { formatCurrency, formatAddress } from '@/lib/utils'
import { ErrorState } from '@/components/common/ErrorState'
import type { Person } from '@/features/people/types'
import type { Company } from '@/features/company/types'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '@/contexts/AlertContext'

interface AssetsTableProps {
  initialData: Person | Company | null
  type: 'person' | 'company'
}

export const AssetsTable = ({ initialData, type }: AssetsTableProps) => {
  const { openAlert } = useAlert()
  const [query, setQuery] = useState<AssetQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'Id',
    sortDescending: true,
    personId:
      type === 'person' && initialData ? (initialData as Person).id : undefined,
    companyId:
      type === 'company' && initialData
        ? (initialData as Company).id
        : undefined,
    name: '',
    isInvestment: undefined,
    zoningType: '',
    propertyType: '',
  })

  const { useAssetsList } = useAssetQueries()
  const { data, isLoading, error, refetch } = useAssetsList(query)
  const { deleteAsset } = useAssets()
  const navigate = useNavigate()

  const handleFilterChange = (filters: Partial<AssetQuery>) => {
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

  const handleDelete = (asset: Asset) => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete ${asset.name} and all associated
              data.`,
      confirmText: 'Delete',
      onConfirm: () => {
        deleteAsset(asset.id)
      },
    })
  }

  const handleView = (asset: Asset) => {
    navigate(`/clients/assets/${asset.id}`)
  }

  const getOwnershipSummary = (asset: Asset) => {
    const peopleCount = asset.assetPeople?.length || 0
    const companiesCount = asset.assetCompanies?.length || 0
    const total = peopleCount + companiesCount

    if (total === 0) return '-'

    const parts = []
    if (peopleCount > 0)
      parts.push(`${peopleCount} ${peopleCount === 1 ? 'Person' : 'People'}`)
    if (companiesCount > 0)
      parts.push(
        `${companiesCount} ${companiesCount === 1 ? 'Company' : 'Companies'}`
      )

    return parts.join(', ')
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <div className="space-y-4">
      <AssetsFilters
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="flex justify-end">
        <Button
          onClick={() =>
            openUpSertAssetModal({
              asset: null,
              type: type,
              initialPerson:
                type === 'person' && initialData
                  ? (initialData as Person)
                  : null,
              initialCompany:
                type === 'company' && initialData
                  ? (initialData as Company)
                  : null,
            })
          }
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Name</TableHead>
              <TableHead className="font-semibold">Address</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Value</TableHead>
              <TableHead className="font-semibold">Investment</TableHead>
              <TableHead className="font-semibold">Ownership</TableHead>
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
                  No assets found
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {formatAddress(asset.address)}
                  </TableCell>
                  <TableCell>
                    {asset.propertyType ? (
                      <Badge variant="outline" className="font-normal">
                        {asset.propertyType}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(Number(asset.value || 0))}
                  </TableCell>
                  <TableCell>
                    {asset.isInvestment ? (
                      <Badge variant="default" className="font-normal">
                        Investment
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="font-normal">
                        Non-Investment
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getOwnershipSummary(asset)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(asset)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            openUpSertAssetModal({
                              asset: asset,
                              type: type,
                              initialPerson:
                                type === 'person' && initialData
                                  ? (initialData as Person)
                                  : null,
                              initialCompany:
                                type === 'company' && initialData
                                  ? (initialData as Company)
                                  : null,
                            })
                          }
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(asset)}
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
