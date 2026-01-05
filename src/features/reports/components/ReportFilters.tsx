import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/components/common/DatePicker'
import { Search, Filter, X } from 'lucide-react'
import { useAllUsers } from '@/hooks/useSharedData'
import type { IReportFilters } from '../types'

interface ReportFiltersProps {
  filters: IReportFilters
  onFilterChange: (filters: IReportFilters) => void
}

export const ReportFilters = ({
  filters,
  onFilterChange,
}: ReportFiltersProps) => {
  const { data: users } = useAllUsers()
  const brokers = users || []

  const handleChange = (key: keyof IReportFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const handleReset = () => {
    onFilterChange({
      dateFrom: '',
      dateTo: '',
      brokerId: '',
      searchQuery: '',
    })
  }

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== '' && v !== undefined
  )

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Filters</h3>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <X className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search all records..."
                  value={filters.searchQuery || ''}
                  onChange={(e) => handleChange('searchQuery', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Date From</Label>
              <DatePicker
                value={
                  filters.dateFrom ? new Date(filters.dateFrom) : undefined
                }
                onChange={(date) =>
                  handleChange('dateFrom', date?.toISOString())
                }
                placeholder="Select start date"
              />
            </div>

            <div className="space-y-2">
              <Label>Date To</Label>
              <DatePicker
                value={filters.dateTo ? new Date(filters.dateTo) : undefined}
                onChange={(date) => handleChange('dateTo', date?.toISOString())}
                placeholder="Select end date"
              />
            </div>

            <div className="space-y-2">
              <Label>Broker</Label>
              <Select
                value={filters.brokerId || ''}
                onValueChange={(value) => handleChange('brokerId', value || '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All brokers" />
                </SelectTrigger>
                <SelectContent>
                  {brokers.map((broker) => (
                    <SelectItem key={broker.id} value={broker.id}>
                      {broker.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
