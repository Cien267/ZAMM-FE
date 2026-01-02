import { useState } from "react";
import { useLiabilityQueries } from "../hooks/useLiabilityQueries";
import { useLiabilities } from "../hooks/useLiabilities";
import { LiabilitiesFilters } from "./LiabilitiesFilters";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination";
import type { LiabilityQuery, Liability } from "../types";
import { formatCurrency } from "@/lib/utils";
import { ErrorState } from "@/components/common/ErrorState";

export const LiabilitiesTable = () => {
  const [query, setQuery] = useState<LiabilityQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: "Id",
    sortDescending: true,
  });

  const [deletingLiabilityId, setDeletingLiabilityId] = useState<string | null>(
    null,
  );

  const { useLiabilitiesList } = useLiabilityQueries();
  const { data, isLoading, error } = useLiabilitiesList(query);
  const { deleteLiability, isDeletingLiability } = useLiabilities();

  const handleFilterChange = (filters: Partial<LiabilityQuery>) => {
    setQuery((prev) => ({
      ...prev,
      ...filters,
      pageNumber: 1,
    }));
  };

  const handleResetFilters = () => {
    setQuery({
      pageNumber: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      sortBy: "Id",
      sortDescending: true,
    });
  };

  const handlePageChange = (newPage: number) => {
    setQuery((prev) => ({ ...prev, pageNumber: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize: newPageSize, pageNumber: 1 }));
  };

  const handleEdit = (liability: Liability) => {
    // TODO: Open edit modal
    console.log("Edit liability:", liability);
  };

  const handleDelete = (id: string) => {
    setDeletingLiabilityId(id);
  };

  const confirmDelete = () => {
    if (deletingLiabilityId) {
      deleteLiability(deletingLiabilityId, {
        onSuccess: () => {
          setDeletingLiabilityId(null);
        },
      });
    }
  };

  const handleView = (liability: Liability) => {
    console.log("View liability:", liability);
  };

  const handleAddLiability = () => {
    console.log("Add liability");
  };

  if (error) {
    return <ErrorState message={error.message} />;
  }

  return (
    <div className="space-y-4">
      <LiabilitiesFilters
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="flex justify-end">
        <Button onClick={handleAddLiability}>
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
                    {liability.loanName}
                  </TableCell>

                  <TableCell className="font-medium">
                    {formatCurrency(liability.amount)}
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
                        <DropdownMenuItem onClick={() => handleEdit(liability)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(liability.id)}
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
        open={!!deletingLiabilityId}
        onOpenChange={(open) => !open && setDeletingLiabilityId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              liability and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingLiability}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeletingLiability}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingLiability ? (
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
  );
};
