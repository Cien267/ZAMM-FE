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
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { COMPANY_TYPES, INDUSTRIES } from '../constants'
import type { CompanyQuery } from '../types'

interface CompanyFiltersProps {
  onFilterChange: (filters: Partial<CompanyQuery>) => void
  onReset: () => void
}

export const CompanyFilters = ({
  onFilterChange,
  onReset,
}: CompanyFiltersProps) => {
  const [filters, setFilters] = useState<Partial<CompanyQuery>>({
    name: '',
    tradingName: '',
    type: '',
    abn: '',
    acn: '',
    email: '',
    industry: '',
  })

  const debouncedFilters = useDebounce(filters, 500)

  useEffect(() => {
    onFilterChange(debouncedFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters])

  const handleChange = (field: keyof CompanyQuery, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    const emptyFilters = {
      name: '',
      tradingName: '',
      type: '',
      abn: '',
      acn: '',
      email: '',
      industry: '',
    }
    setFilters(emptyFilters)
    onReset()
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== '')

  return (
    <div className="space-y-4 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Company Name</Label>
          <Input
            placeholder="Search by name..."
            value={filters.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Trading Name</Label>
          <Input
            placeholder="Search by trading name..."
            value={filters.tradingName}
            onChange={(e) => handleChange('tradingName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={filters.type || ''}
            onValueChange={(value) => handleChange('type', value || '')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {COMPANY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Industry</Label>
          <Select
            value={filters.industry || ''}
            onValueChange={(value) => handleChange('industry', value || '')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All industries" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>ABN</Label>
          <Input
            placeholder="Search by ABN..."
            value={filters.abn}
            onChange={(e) => handleChange('abn', e.target.value)}
            maxLength={11}
          />
        </div>

        <div className="space-y-2">
          <Label>ACN</Label>
          <Input
            placeholder="Search by ACN..."
            value={filters.acn}
            onChange={(e) => handleChange('acn', e.target.value)}
            maxLength={9}
          />
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            placeholder="Search by email..."
            value={filters.email}
            onChange={(e) => handleChange('email', e.target.value)}
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
