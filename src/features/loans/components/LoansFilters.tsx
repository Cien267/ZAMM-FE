import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import type { LoanQuery } from '../types'
import type { Lender } from '@/features/lenders/types'

interface LoansFiltersProps {
  onFilterChange: (filters: Partial<LoanQuery>) => void
  onReset: () => void
  lender: Lender
}

export const LoansFilters = ({
  onFilterChange,
  onReset,
  lender,
}: LoansFiltersProps) => {
  const [filters, setFilters] = useState<Partial<LoanQuery>>({
    name: '',
    lenderId: lender.id,
  })

  const debouncedFilters = useDebounce(filters, 500)

  useEffect(() => {
    onFilterChange(debouncedFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters])

  const handleChange = (field: keyof LoanQuery, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    const emptyFilters = {
      name: '',
      lenderId: lender.id,
    }
    setFilters(emptyFilters)
    onReset()
  }

  const hasActiveFilters = filters.name !== ''

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
