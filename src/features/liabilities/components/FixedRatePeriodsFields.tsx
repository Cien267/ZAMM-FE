import { useFieldArray, type Control } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { InputNumber } from '@/components/common/InputNumber'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { DatePicker } from '@/components/common/DatePicker'
import { Plus, X } from 'lucide-react'
import type { CreateLiabilityInput, UpdateLiabilityInput } from '../types'

interface FixedRatePeriodsFieldsProps {
  control: Control<CreateLiabilityInput | UpdateLiabilityInput>
}

export const FixedRatePeriodsFields = ({
  control,
}: FixedRatePeriodsFieldsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'fixedRatePeriods',
  })

  const addPeriod = () => {
    append({
      startDate: '',
      term: 1,
      customRate: null,
    })
  }

  const removePeriod = (index: number) => {
    remove(index)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Fixed-rate Periods</h4>
        <Button type="button" variant="outline" size="sm" onClick={addPeriod}>
          <Plus className="h-4 w-4 mr-1" /> Add Fixed-Rate Period
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
          <p className="text-sm">No fixed-rate periods</p>
          <Button
            type="button"
            variant="link"
            onClick={addPeriod}
            className="mt-2"
            size="sm"
          >
            Add your first period
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground min-w-5">
                {index + 1}.
              </span>

              <FormField
                control={control}
                name={`fixedRatePeriods.${index}.startDate`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <DatePicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) => field.onChange(date?.toISOString())}
                        placeholder="Pick a date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`fixedRatePeriods.${index}.term`}
                render={({ field }) => (
                  <FormItem className="w-28">
                    <FormControl>
                      <InputNumber
                        placeholder="Years"
                        {...field}
                        allowDecimal={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`fixedRatePeriods.${index}.customRate`}
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormControl>
                      <div className="relative">
                        <InputNumber
                          placeholder="0.00"
                          className="pr-8"
                          {...field}
                          allowDecimal={true}
                          maxDecimals={2}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          %
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePeriod(index)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
