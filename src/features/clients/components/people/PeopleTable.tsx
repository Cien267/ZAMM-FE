import { useState } from "react"
import { useClientQueries } from "../../hooks/useClientQueries"
import { useClients } from "../../hooks/useClients"
import { PeopleFilters } from "./PeopleFilters"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react"
import { DEFAULT_PAGE_SIZE } from "@/constants/pagination"
import type { PersonQuery, Person } from "../../types"
import { Pagination } from "@/components/common/Pagination"
import {
  GENDER_VARIANT_MAPPING,
  MARITAL_STATUS_VARIANT_MAPPING,
} from "../../constants"
import { openUpSertPersonModal } from "./UpSertPerson"
import { useAuth } from "@/features/auth/hooks/useAuth"

export const PeopleTable = () => {
  const [query, setQuery] = useState<PersonQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: "Id",
    sortDescending: true,
  })

  const [deletingPerson, setDeletingPerson] = useState<Person | null>(null)

  const { usePeopleList } = useClientQueries()
  const { useGetAllUsers } = useAuth()
  const { data, isLoading, error } = usePeopleList(query)
  const { data: users = [] } = useGetAllUsers()

  const { deletePerson, isDeletingPerson } = useClients()

  const handleFilterChange = (filters: Partial<PersonQuery>) => {
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

  const handleDelete = (person: Person) => {
    setDeletingPerson(person)
  }

  const confirmDelete = () => {
    if (deletingPerson) {
      deletePerson(deletingPerson.id, {
        onSuccess: () => {
          setDeletingPerson(null)
        },
      })
    }
  }

  const handleView = (person: Person) => {
    // TODO: Navigate to detail page or open detail dialog
    console.log("View person:", person)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">
          Error loading people: {error.message}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <PeopleFilters
        brokers={users}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="flex justify-end">
        <Button
          variant={"sky"}
          onClick={() => openUpSertPersonModal({ person: null, users: users })}
        >
          <Plus className="h-4 w-4" />
          Add Person
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Marital Status</TableHead>
              <TableHead>Broker</TableHead>
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
            ) : data?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center h-64 text-muted-foreground"
                >
                  No people found
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">
                    {person.fullName}
                  </TableCell>
                  <TableCell>{person.email || "-"}</TableCell>
                  <TableCell>
                    {person.phoneMobile || person.phoneWork || "-"}
                  </TableCell>
                  <TableCell>
                    {person.gender ? (
                      <Badge
                        variant={
                          GENDER_VARIANT_MAPPING[person.gender] || "default"
                        }
                        className="font-normal"
                      >
                        {person.gender}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {person.maritalStatus ? (
                      <Badge
                        variant={
                          MARITAL_STATUS_VARIANT_MAPPING[
                            person.maritalStatus
                          ] || "default"
                        }
                        className="font-normal"
                      >
                        {person.maritalStatus}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>{person.brokerName || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(person)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            openUpSertPersonModal({ person, users })
                          }
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(person)}
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

      {/* <PeopleFormDialog
        open={isCreateDialogOpen || !!editingPerson}
        onOpenChange={(open: any) => {
          if (!open) {
            setIsCreateDialogOpen(false)
            setEditingPerson(null)
          }
        }}
        person={editingPerson}
      /> */}

      <AlertDialog
        open={!!deletingPerson}
        onOpenChange={(open: any) => !open && setDeletingPerson(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <strong>{deletingPerson?.fullName}</strong> and all associated
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingPerson}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeletingPerson}
              className="bg-destructive text-destructive-foreground! hover:bg-destructive/90"
            >
              {isDeletingPerson ? (
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
