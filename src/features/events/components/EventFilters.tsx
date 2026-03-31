import { useState, useEffect, useMemo } from 'react'
import type { EventQuery } from '../types'
import { useParams } from 'react-router-dom'
import {
  useAllLiabilitiesByPersonId,
  useAllLiabilitiesByCompanyId,
} from '@/hooks/useSharedData'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface EventFiltersProps {
  type: 'person' | 'company' | 'liability'
  parentFilters: Partial<EventQuery> | null
  onFilterChange: (filters: Partial<EventQuery>) => void
}

export const EventFilters = ({
  type,
  parentFilters,
  onFilterChange,
}: EventFiltersProps) => {
  const { id = '' } = useParams<{ id: string }>()
  const { data: liabilitiesDataByPersonId } = useAllLiabilitiesByPersonId(
    id,
    !!id
  )
  const { data: liabilitiesDataByCompanyId } = useAllLiabilitiesByCompanyId(
    id,
    !!id
  )

  const liabilities = useMemo(() => {
    if (type === 'person') return liabilitiesDataByPersonId || []
    if (type === 'company') return liabilitiesDataByCompanyId || []
    return []
  }, [liabilitiesDataByPersonId, liabilitiesDataByCompanyId, type])

  const [filters, setFilters] = useState<Partial<EventQuery>>({
    dateFrom: parentFilters?.dateFrom ?? undefined,
    dateTo: parentFilters?.dateTo ?? undefined,
    isDismissed: parentFilters?.isDismissed ?? undefined,
    liabilityId: parentFilters?.liabilityId ?? undefined,
  })

  useEffect(() => {
    onFilterChange(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const handleChange = <K extends keyof EventQuery>(
    field: K,
    value: EventQuery[K]
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-4 pb-6">
      <div className="flex flex-wrap items-end justify-end gap-6">
        <div className="space-y-2 flex w-full justify-between items-center gap-8 min-w-80">
          <Label className="m-0">Liability: </Label>
          <Select
            value={filters.liabilityId || 'all'}
            onValueChange={(val) =>
              handleChange('liabilityId', val === 'all' ? undefined : val)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Liabilities</SelectItem>
              {liabilities?.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
