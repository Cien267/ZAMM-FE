import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import type { EmailTemplateQuery } from '../types'
import { useAllEmailCategories } from '@/hooks/useSharedData'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface EmailTemplatesFiltersProps {
  onFilterChange: (filters: Partial<EmailTemplateQuery>) => void
  onReset: () => void
}

export const EmailTemplatesFilters = ({
  onFilterChange,
  onReset,
}: EmailTemplatesFiltersProps) => {
  const { data: categories = [] } = useAllEmailCategories({ isActive: true })
  const [filters, setFilters] = useState<Partial<EmailTemplateQuery>>({
    name: '',
    isActive: undefined,
    brokerId: undefined,
    categoryId: undefined,
  })

  const debouncedFilters = useDebounce(filters, 500)

  useEffect(() => {
    onFilterChange(debouncedFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters])

  const handleChange = (field: keyof EmailTemplateQuery, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    const emptyFilters = {
      name: '',
      isActive: undefined,
      brokerId: undefined,
    }
    setFilters(emptyFilters)
    onReset()
  }

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== '' && value !== undefined
  )

  return (
    <div className="space-y-4 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            placeholder="Search by name..."
            value={filters.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            onValueChange={(e) => handleChange('categoryId', e)}
            value={filters.brokerId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
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
