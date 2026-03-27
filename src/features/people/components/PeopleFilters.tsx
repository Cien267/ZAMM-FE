import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import type { PersonQuery } from '../types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAllBrokers } from '@/hooks/useSharedData'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface PeopleFiltersProps {
  parentFilters: Partial<PersonQuery> | null
  onFilterChange: (filters: Partial<PersonQuery>) => void
  onReset: () => void
}

export const PeopleFilters = ({
  parentFilters,
  onFilterChange,
  onReset,
}: PeopleFiltersProps) => {
  const { user } = useAuth()
  const { data: brokers } = useAllBrokers(user?.brokerageId || '')

  const [filters, setFilters] = useState<Partial<PersonQuery>>({
    firstName: parentFilters?.firstName ?? '',
    lastName: parentFilters?.lastName ?? '',
    email: parentFilters?.email ?? '',
    phone: parentFilters?.phone ?? '',
    brokerId: parentFilters?.brokerId ?? '',
  })

  const debouncedFilters = useDebounce(filters, 500)

  useEffect(() => {
    onFilterChange(debouncedFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters])

  const handleChange = <K extends keyof PersonQuery>(
    field: K,
    value: PersonQuery[K]
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    const emptyFilters = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      brokerId: '',
    }
    setFilters(emptyFilters)
    onReset()
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== '')

  return (
    <div className="space-y-4 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Name</label>
          <Input
            placeholder="Search by first name..."
            value={filters.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Last Name</label>
          <Input
            placeholder="Search by last name..."
            value={filters.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            placeholder="Search by email..."
            value={filters.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input
            placeholder="Search by phone..."
            value={filters.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Broker</label>
          <Select
            onValueChange={(e) =>
              handleChange('brokerId', e === 'all' ? undefined : e)
            }
            value={filters.brokerId || 'all'}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select broker" />
            </SelectTrigger>
            <SelectContent className="w-full">
              <SelectItem value="all">All Brokers</SelectItem>
              {(brokers || []).map((broker) => (
                <SelectItem key={broker.id} value={broker.id}>
                  {broker.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
