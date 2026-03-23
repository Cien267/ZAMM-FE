import { useState, useEffect, useMemo } from 'react'
import type { EventQuery } from '../types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAllBrokers } from '@/hooks/useSharedData'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface UpcomingEventFiltersProps {
  parentFilters: Partial<EventQuery>
  onFilterChange: (filters: Partial<EventQuery>) => void
}

export const UpcomingEventFilters = ({
  parentFilters,
  onFilterChange,
}: UpcomingEventFiltersProps) => {
  const { user } = useAuth()
  const { data: brokers } = useAllBrokers(user?.brokerageId || '')

  const [now] = useState(() => new Date())

  const dateOptions = useMemo(
    () => [
      {
        label: '30 days',
        days: 30,
        date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        label: '60 days',
        days: 60,
        date: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      },
      {
        label: '90 days',
        days: 90,
        date: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
      },
    ],
    [now]
  )

  const [filters, setFilters] = useState<Partial<EventQuery>>({
    dateFrom: parentFilters.dateFrom,
    dateTo: parentFilters.dateTo,
    isDismissed: parentFilters.isDismissed,
    addedByUserId: parentFilters.addedByUserId,
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

  const activeLabel =
    dateOptions.find(
      (opt) => opt.date.getTime() === (filters.dateTo as Date)?.getTime()
    )?.label || dateOptions[0].label

  return (
    <div className="space-y-4 pb-6">
      <div className="flex flex-wrap items-end justify-end gap-6">
        <div className="space-y-2 min-w-80">
          <Select
            value={filters.addedByUserId || 'all'}
            onValueChange={(val) =>
              handleChange('addedByUserId', val === 'all' ? undefined : val)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brokers</SelectItem>
              {brokers?.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 ">
          <RadioGroup
            value={activeLabel}
            onValueChange={(label) => {
              const selected = dateOptions.find((o) => o.label === label)
              if (selected) handleChange('dateTo', selected.date)
            }}
            className="flex gap-4"
          >
            {dateOptions.map((opt) => (
              <div key={opt.label} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.label} id={opt.label}>
                  <Label htmlFor={opt.label}>{opt.label}</Label>
                </RadioGroupItem>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="">
          <Button
            className="mt-6"
            variant={filters.isDismissed ? 'secondary' : 'outline'}
            onClick={() => handleChange('isDismissed', !filters.isDismissed)}
          >
            {filters.isDismissed ? 'Hide Dismissed' : 'Show Dismissed'}
          </Button>
        </div>
      </div>
    </div>
  )
}
