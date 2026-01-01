import { useState } from "react"
import { useAssetQueries } from "../hooks/useAssetQueries"
import { useAssets } from "../hooks/useAssets"
import { AssetsFilters } from "./AssetsFilters"
import { Pagination } from "@/components/common/Pagination"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react"
import { DEFAULT_PAGE_SIZE } from "../constants"
import type { AssetQuery, Asset } from "../types"

export const AssetsTable = () => {
  const [query, setQuery] = useState<AssetQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: "Id",
    sortDescending: true,
  })

  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null)

  const { useAssetsList } = useAssetQueries()
  const { data, isLoading, error } = useAssetsList(query)
  const { deleteAsset, isDeletingAsset } = useAssets()

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
      sortBy: "Id",
      sortDescending: true,
    })
  }

  const handlePageChange = (newPage: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: newPage }))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize: newPageSize, pageNumber: 1 }))
  }

  const handleEdit = (asset: Asset) => {
    // TODO: Open edit modal
    console.log("Edit asset:", asset)
  }

  const handleDelete = (id: string) => {
    setDeletingAssetId(id)
  }

  const confirmDelete = () => {
    if (deletingAssetId) {
      deleteAsset(deletingAssetId, {
        onSuccess: () => {
          setDeletingAssetId(null)
        },
      })
    }
  }

  const handleView = (asset: Asset) => {
    console.log("View asset:", asset)
  }

  const handleAddAsset = () => {
    console.log("Add asset")
  }

  const formatCurrency = (value?: number) => {
    if (!value) return "-"
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatAddress = (asset: Asset) => {
    if (!asset.address) return "-"
    const parts = [
      asset.address.unitNumber,
      asset.address.streetNumber,
      asset.address.streetName,
      asset.address.suburb,
      asset.address.state,
    ].filter(Boolean)
    return parts.length > 0 ? parts.join(" ") : "-"
  }

  const getOwnershipSummary = (asset: Asset) => {
    const peopleCount = asset.assetPeople?.length || 0
    const companiesCount = asset.assetCompanies?.length || 0
    const total = peopleCount + companiesCount

    if (total === 0) return "-"

    const parts = []
    if (peopleCount > 0)
      parts.push(`${peopleCount} ${peopleCount === 1 ? "Person" : "People"}`)
    if (companiesCount > 0)
      parts.push(
        `${companiesCount} ${companiesCount === 1 ? "Company" : "Companies"}`
      )

    return parts.join(", ")
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          Error loading assets: {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AssetsFilters
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="flex justify-end">
        <Button onClick={handleAddAsset}>
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
                    {formatAddress(asset)}
                  </TableCell>
                  <TableCell>
                    {asset.propertyType ? (
                      <Badge variant="outline" className="font-normal">
                        {asset.propertyType}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(asset.value)}
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
                        <DropdownMenuItem onClick={() => handleEdit(asset)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(asset.id)}
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

      <AlertDialog
        open={!!deletingAssetId}
        onOpenChange={(open) => !open && setDeletingAssetId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              asset and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingAsset}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeletingAsset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingAsset ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
