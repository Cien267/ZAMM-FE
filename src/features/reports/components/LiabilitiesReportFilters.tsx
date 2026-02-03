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
import { FINANCE_PURPOSES } from '@/features/liabilities/constants'
import type { LiabilityReportQuery } from '../types'
import { DatePicker } from '@/components/common/DatePicker'
import { NUMERIC_OPERATORS, DATE_OPERATORS } from '@/constants/queryOperator'
import { LOAN_TYPES, REPAYMENTS } from '../constants'
import { useAllLenders } from '@/hooks/useSharedData'

interface LiabilitiesReportFiltersProps {
  onFilterChange: (filters: Partial<LiabilityReportQuery>) => void
  onReset: () => void
}

export const LiabilitiesReportFilters = ({
  onFilterChange,
  onReset,
}: LiabilitiesReportFiltersProps) => {
  const { data: lenders = [] } = useAllLenders()
  const [selectedLenderId, setSelectedLenderId] = useState('')

  const [filters, setFilters] = useState<Partial<LiabilityReportQuery>>({
    loanIds: [],
    financePurpose: '',
    loanType: '',
    repayment: '',
    startDateFrom: undefined,
    startDateTo: undefined,
    discountPercentValue: undefined,
    discountPercentOperator: 'lt',
    amountValue: undefined,
    amountOperator: 'lt',
    fixedRateEndDate: undefined,
    fixedRateEndOperator: 'before',
  })

  const debouncedFilters = useDebounce(filters, 500)

  useEffect(() => {
    onFilterChange(debouncedFilters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilters])

  const handleChange = (field: keyof LiabilityReportQuery, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleSelectLenderId = (lenderId: string) => {
    setSelectedLenderId(lenderId)
    const loanIds = lenders
      .find((lender) => lender.id === lenderId)
      ?.loans?.map((loan) => loan.id)
    handleChange('loanIds', loanIds)
  }

  const handleReset = () => {
    const emptyFilters = {
      loanIds: [],
      financePurpose: '',
      loanType: '',
      repayment: '',
      startDateFrom: undefined,
      startDateTo: undefined,
      discountPercentValue: undefined,
      discountPercentOperator: 'lt',
      amountValue: undefined,
      amountOperator: 'lt',
      fixedRateEndDate: undefined,
      fixedRateEndOperator: 'before',
    }
    setFilters(emptyFilters)
    onReset()
  }

  const hasActiveFilters =
    (filters.loanIds || []).length > 0 ||
    filters.financePurpose !== '' ||
    filters.loanType !== '' ||
    filters.repayment !== '' ||
    filters.discountPercentValue !== undefined ||
    filters.amountValue !== undefined ||
    filters.fixedRateEndDate !== undefined ||
    filters.startDateFrom !== undefined ||
    filters.startDateTo !== undefined

  return (
    <div className="space-y-4 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Lender</Label>
          <Select
            value={selectedLenderId}
            onValueChange={(v) => handleSelectLenderId(v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Lenders" />
            </SelectTrigger>
            <SelectContent>
              {lenders.map((lender) => (
                <SelectItem key={lender.id} value={lender.id}>
                  {lender.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Loan Type</Label>
          <Select
            value={filters.loanType}
            onValueChange={(v) => handleChange('loanType', v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              {LOAN_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Finance Purpose</Label>
          <Select
            value={filters.financePurpose || ''}
            onValueChange={(value) =>
              handleChange('financePurpose', value || '')
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All purposes" />
            </SelectTrigger>
            <SelectContent>
              {FINANCE_PURPOSES.map((purpose) => (
                <SelectItem key={purpose} value={purpose}>
                  {purpose}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Repayment</Label>
          <Select
            value={filters.repayment}
            onValueChange={(v) => handleChange('repayment', v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All repayments" />
            </SelectTrigger>
            <SelectContent>
              {REPAYMENTS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>From Commencement Date</Label>
          <DatePicker
            value={filters.startDateFrom}
            onChange={(value) => handleChange('startDateFrom', value)}
            placeholder="Pick a date"
          />
        </div>

        <div className="space-y-2">
          <Label>To Commencement Date</Label>
          <DatePicker
            value={filters.startDateTo}
            onChange={(value) => handleChange('startDateTo', value)}
            placeholder="Pick a date"
          />
        </div>
        <div className="space-y-2">
          <Label>Discount (%)</Label>
          <div className="flex gap-2">
            <Select
              value={filters.discountPercentOperator}
              onValueChange={(v) => handleChange('discountPercentOperator', v)}
            >
              <SelectTrigger className="w-1/3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NUMERIC_OPERATORS.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="0.00"
              value={filters.discountPercentValue || ''}
              onChange={(e) =>
                handleChange('discountPercentValue', e.target.value)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Amount ($)</Label>
          <div className="flex gap-2">
            <Select
              value={filters.amountOperator}
              onValueChange={(v) => handleChange('amountOperator', v)}
            >
              <SelectTrigger className="w-1/3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NUMERIC_OPERATORS.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Amount..."
              value={filters.amountValue || ''}
              onChange={(e) => handleChange('amountValue', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Fixed Rate End</Label>
          <div className="flex gap-2">
            <Select
              value={filters.fixedRateEndOperator}
              onValueChange={(v) => handleChange('fixedRateEndOperator', v)}
            >
              <SelectTrigger className="w-1/3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_OPERATORS.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DatePicker
              className="w-2/3"
              value={filters.fixedRateEndDate}
              onChange={(v) => handleChange('fixedRateEndDate', v)}
            />
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
