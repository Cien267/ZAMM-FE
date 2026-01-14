import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import type { LenderQuery } from '../types'

interface LendersFiltersProps {
  onFilterChange: (filters: Partial<LenderQuery>) => void
  onReset: () => void
}

export const LendersFilters = ({
  onFilterChange,
  onReset,
}: LendersFiltersProps) => {
  const [filters, setFilters] = useState<Partial<LenderQuery>>({
    name: '',
  })

  const debouncedFilters = useDebounce(filters, 500)

  useEffect(() => {
    onFilterChange(debouncedFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters])

  const handleChange = (field: keyof LenderQuery, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    const emptyFilters = {
      name: '',
    }
    setFilters(emptyFilters)
    onReset()
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== '')

  return (
    <div className="space-y-4 pb-10">
      <div className="flex justify-start items-end gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            placeholder="Search by name..."
            value={filters.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
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
    </div>
  )
}
