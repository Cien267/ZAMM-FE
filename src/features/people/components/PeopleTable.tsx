import { useState } from 'react'
import { usePeopleQueries } from '../hooks/usePeopleQueries'
import { usePeople } from '../hooks/usePeople'
import { PeopleFilters } from './PeopleFilters'
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
  Eye,
  Pencil,
  Trash2,
  Loader2,
} from 'lucide-react'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import type { PersonQuery, Person } from '../types'
import { Pagination } from '@/components/common/Pagination'
import {
  GENDER_VARIANT_MAPPING,
  MARITAL_STATUS_VARIANT_MAPPING,
} from '../constants'
import { openUpSertPersonModal } from './UpSertPerson'
import { ErrorState } from '@/components/common/ErrorState'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '@/contexts/AlertContext'

export const PeopleTable = () => {
  const navigate = useNavigate()
  const { openAlert } = useAlert()
  const [query, setQuery] = useState<PersonQuery>({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sortBy: 'Id',
    sortDescending: true,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    brokerId: '',
  })

  const { usePeopleList } = usePeopleQueries()
  const { data: people, isLoading, error, refetch } = usePeopleList(query)

  const { deletePerson } = usePeople()

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

  const handleDelete = (person: Person) => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete ${person.fullName} and all associated
              data.`,
      confirmText: 'Delete',
      onConfirm: () => {
        deletePerson(person.id)
      },
    })
  }

  const handleView = (person: Person) => {
    navigate(`/clients/people/${person.id}`, {
      state: { label: person.fullName },
    })
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <div className="space-y-4">
      <PeopleFilters
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      <div className="flex justify-end">
        <Button
          variant={'sky'}
          onClick={() =>
            openUpSertPersonModal({
              person: null,
            })
          }
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
            ) : people?.data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center h-64 text-muted-foreground"
                >
                  No people found
                </TableCell>
              </TableRow>
            ) : (
              people?.data.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">
                    {person.fullName}
                  </TableCell>
                  <TableCell>{person.email || '-'}</TableCell>
                  <TableCell>
                    {person.phoneMobile || person.phoneWork || '-'}
                  </TableCell>
                  <TableCell>
                    {person.gender ? (
                      <Badge
                        variant={
                          GENDER_VARIANT_MAPPING[person.gender] || 'default'
                        }
                        className="font-normal"
                      >
                        {person.gender}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {person.maritalStatus ? (
                      <Badge
                        variant={
                          MARITAL_STATUS_VARIANT_MAPPING[
                            person.maritalStatus
                          ] || 'default'
                        }
                        className="font-normal"
                      >
                        {person.maritalStatus}
                      </Badge>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{person.brokerName || '-'}</TableCell>
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
                            openUpSertPersonModal({
                              person,
                            })
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

      {people && people.totalCount > 0 && (
        <Pagination
          currentPage={people.pageNumber}
          totalPages={people.totalPages}
          pageSize={query.pageSize || DEFAULT_PAGE_SIZE}
          totalCount={people.totalCount}
          hasNextPage={people.hasNextPage}
          hasPreviousPage={people.hasPreviousPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}

export default PeopleTable
