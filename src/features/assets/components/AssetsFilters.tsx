import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { ZONING_TYPES, PROPERTY_TYPES } from '../constants'
import type { AssetQuery } from '../types'

interface AssetsFiltersProps {
  onFilterChange: (filters: Partial<AssetQuery>) => void
  onReset: () => void
}

export const AssetsFilters = ({
  onFilterChange,
  onReset,
}: AssetsFiltersProps) => {
  const [filters, setFilters] = useState<Partial<AssetQuery>>({
    name: '',
    isInvestment: undefined,
    zoningType: '',
    propertyType: '',
  })

  const debouncedFilters = useDebounce(filters, 500)

  useEffect(() => {
    onFilterChange(debouncedFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters])

  const handleChange = (field: keyof AssetQuery, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    const emptyFilters = {
      name: '',
      isInvestment: undefined,
      zoningType: '',
      propertyType: '',
    }
    setFilters(emptyFilters)
    onReset()
  }

  const hasActiveFilters =
    filters.name !== '' ||
    filters.isInvestment !== undefined ||
    filters.zoningType !== '' ||
    filters.propertyType !== ''

  return (
    <div className="space-y-4 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Asset Name</Label>
          <Input
            placeholder="Search by name..."
            value={filters.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Zoning Type</Label>
          <Select
            value={filters.zoningType || ''}
            onValueChange={(value) => handleChange('zoningType', value || '')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All zoning types" />
            </SelectTrigger>
            <SelectContent>
              {ZONING_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Property Type</Label>
          <Select
            value={filters.propertyType || ''}
            onValueChange={(value) => handleChange('propertyType', value || '')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All property types" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Investment Property</Label>
          <div className="flex items-center space-x-2 h-10">
            <Checkbox
              id="isInvestment"
              checked={filters.isInvestment === true}
              onCheckedChange={(checked) =>
                handleChange('isInvestment', checked ? true : undefined)
              }
            />
            <Label
              htmlFor="isInvestment"
              className="cursor-pointer font-normal"
            >
              Show only investment properties
            </Label>
          </div>
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
