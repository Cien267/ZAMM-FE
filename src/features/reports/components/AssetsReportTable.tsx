import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TrendingUp, MapPin } from 'lucide-react'
import { useReports } from '../hooks/useReports'
import type { AssetReportQuery } from '../types'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import { formatCurrency, formatDate, formatAddress } from '@/lib/utils'
import { ErrorState } from '@/components/common/ErrorState'
import { Pagination } from '@/components/common/Pagination'

export const AssetsReportTable = () => {
  const [query, setQuery] = useState<AssetReportQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'Id',
    sortDescending: true,
    dateFrom: '',
    dateTo: '',
    personId: '',
    companyId: '',
    propertyType: '',
  })

  const { useAssetReport } = useReports()
  const { data: assetsReport, isLoading, error } = useAssetReport(query)

  const handlePageChange = (newPage: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: newPage }))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize: newPageSize, pageNumber: 1 }))
  }

  const formatOwners = (asset: any) => {
    const people = asset.assetPeople?.map(
      (ap: any) => `${ap.personName} (${ap.percent}%)`
    )
    const companies = asset.assetCompanies?.map(
      (ac: any) => `${ac.companyName} (${ac.percent}%)`
    )
    return [...(people || []), ...(companies || [])].join(', ')
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Assets Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <ErrorState message={error.message} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Assets Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset Name</TableHead>
                <TableHead>Property Type</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Valuation Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Owners</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assetsReport?.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground py-8"
                  >
                    No assets found matching the current filters
                  </TableCell>
                </TableRow>
              ) : (
                assetsReport?.data.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <Link
                        to={`/clients/assets/${asset.id}`}
                        className="hover:underline hover:text-blue-400 text-blue-500 cursor-pointer font-medium"
                      >
                        {asset.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {asset.propertyType ? (
                        <Badge variant="outline">{asset.propertyType}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {asset.value ? formatCurrency(asset.value) : '-'}
                        </span>
                        {asset.valueIsCertified && (
                          <Badge variant="secondary" className="w-fit mt-1">
                            Certified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {asset.valuationDate
                        ? formatDate(new Date(asset.valuationDate))
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {asset.isInvestment && (
                          <Badge variant="default" className="w-fit">
                            Investment
                          </Badge>
                        )}
                        {asset.isUnencumbered && (
                          <Badge variant="secondary" className="w-fit">
                            Unencumbered
                          </Badge>
                        )}
                        {!asset.isInvestment && !asset.isUnencumbered && (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground max-w-50] truncate">
                        {formatOwners(asset) || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {asset.address ? (
                        <div className="flex items-start gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                          <span className="truncate max-w-45">
                            {formatAddress(asset.address)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {asset.createdAt
                        ? formatDate(new Date(asset.createdAt))
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {assetsReport && assetsReport.totalCount > 0 && (
          <Pagination
            currentPage={assetsReport.pageNumber}
            totalPages={assetsReport.totalPages}
            pageSize={query.pageSize || DEFAULT_PAGE_SIZE}
            totalCount={assetsReport.totalCount}
            hasNextPage={assetsReport.hasNextPage}
            hasPreviousPage={assetsReport.hasPreviousPage}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </CardContent>
    </Card>
  )
}
