import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import type { SentEmailQuery, SentEmailStatusType } from '../types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAllBrokers, useAllEmailTemplates } from '@/hooks/useSharedData'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { DatePicker } from '@/components/common/DatePicker'
import { Label } from '@/components/ui/label'
import { SENT_EMAIL_STATUS_OPTIONS } from '../constants'

interface SentEmailsFiltersProps {
  parentFilters: Partial<SentEmailQuery> | null
  onFilterChange: (filters: Partial<SentEmailQuery>) => void
  onReset: () => void
}

export const SentEmailsFilters = ({
  parentFilters,
  onFilterChange,
  onReset,
}: SentEmailsFiltersProps) => {
  const { user } = useAuth()
  const { data: brokers = [] } = useAllBrokers(user?.brokerageId || '')
  const { data: templates = [] } = useAllEmailTemplates({})

  const [filters, setFilters] = useState<Partial<SentEmailQuery>>({
    recipientEmail: parentFilters?.recipientEmail ?? '',
    subject: parentFilters?.subject ?? '',
    status: parentFilters?.status ?? undefined,
    fromSentAt: parentFilters?.fromSentAt ?? undefined,
    toSentAt: parentFilters?.toSentAt ?? undefined,
    templateId: parentFilters?.templateId ?? '',
    brokerId: parentFilters?.brokerId ?? '',
  })

  const debouncedFilters = useDebounce(filters, 500)

  useEffect(() => {
    onFilterChange(debouncedFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters])

  const handleChange = <K extends keyof SentEmailQuery>(
    field: K,
    value: SentEmailQuery[K]
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    const emptyFilters = {
      recipientEmail: '',
      subject: '',
      status: undefined,
      fromSentAt: undefined,
      toSentAt: undefined,
      templateId: '',
      brokerId: '',
    }
    setFilters(emptyFilters)
    onReset()
  }

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== '' && value !== undefined
  )

  return (
    <div className="space-y-4 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Recipient Email</label>
          <Input
            placeholder="Search by recipient email..."
            value={filters.recipientEmail}
            onChange={(e) => handleChange('recipientEmail', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Subject</label>
          <Input
            placeholder="Search by subject..."
            value={filters.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>From Sent At</Label>
          <DatePicker
            value={filters.fromSentAt}
            onChange={(value) => handleChange('fromSentAt', value)}
            placeholder="Pick a date"
          />
        </div>

        <div className="space-y-2">
          <Label>To Sent At</Label>
          <DatePicker
            value={filters.toSentAt}
            onChange={(value) => handleChange('toSentAt', value)}
            placeholder="Pick a date"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            onValueChange={(e) =>
              handleChange('status', e as SentEmailStatusType)
            }
            value={filters.status ?? ''}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {SENT_EMAIL_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Template</label>
          <Select
            onValueChange={(e) => handleChange('templateId', e)}
            value={filters.templateId}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select broker" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {templates.map((tem) => (
                <SelectItem key={tem.id} value={tem.id}>
                  {tem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
