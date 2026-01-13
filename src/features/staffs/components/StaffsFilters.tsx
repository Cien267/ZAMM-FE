import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import type { StaffQuery } from '../types'

interface StaffsFiltersProps {
  onFilterChange: (filters: Partial<StaffQuery>) => void
  onReset: () => void
}

export const StaffsFilters = ({
  onFilterChange,
  onReset,
}: StaffsFiltersProps) => {
  const [filters, setFilters] = useState<Partial<StaffQuery>>({
    fullName: '',
    email: '',
    phoneNumber: '',
  })

  const debouncedFilters = useDebounce(filters, 500)

  useEffect(() => {
    onFilterChange(debouncedFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters])

  const handleChange = (field: keyof StaffQuery, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    const emptyFilters = {
      fullName: '',
      email: '',
      phoneNumber: '',
    }
    setFilters(emptyFilters)
    onReset()
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== '')

  return (
    <div className="space-y-4 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <Input
            placeholder="Search by name..."
            value={filters.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
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
            value={filters.phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
          />
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
