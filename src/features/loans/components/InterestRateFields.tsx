import { useFieldArray, useWatch, type Control } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { InputNumber } from '@/components/common/InputNumber'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Plus, X } from 'lucide-react'
import { INTEREST_RATE_TYPES } from '../constants'

interface InterestRateFieldsProps {
  control: Control<any>
  nestIndex?: number | undefined
}

export const InterestRateFields = ({
  control,
  nestIndex,
}: InterestRateFieldsProps) => {
  const isNested = typeof nestIndex === 'number'
  const { fields, append, remove } = useFieldArray({
    control,
    name: isNested ? `loans.${nestIndex}.interestRates` : 'interestRates',
  })

  const watchedRates = useWatch({
    control,
    name: isNested ? `loans.${nestIndex}.interestRates` : 'interestRates',
  })
  const selectedTypes = (watchedRates || []).map((item: any) => item.rateType)

  const addInterestRate = () => {
    const availableType = INTEREST_RATE_TYPES.find(
      (type) => !selectedTypes.includes(type.value)
    )
    append({
      rateType: availableType?.value || '',
      rate: 0,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Interest Rates</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addInterestRate}
          disabled={fields.length >= INTEREST_RATE_TYPES.length}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Interest Rate
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p>No interest rates added</p>
          <Button
            type="button"
            variant="link"
            onClick={addInterestRate}
            className="mt-2"
          >
            Add your first interest rate
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Interest Rate {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={
                    isNested
                      ? `loans.${nestIndex}.interestRates.${index}.rateType`
                      : `interestRates.${index}.rateType`
                  }
                  render={({ field: selectField }) => (
                    <FormItem>
                      <FormLabel>Rate Type</FormLabel>
                      <Select
                        onValueChange={selectField.onChange}
                        value={selectField.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INTEREST_RATE_TYPES.map(
                            (type) =>
                              (!selectedTypes.includes(type.value) ||
                                type.value === selectField.value) && (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              )
                          )}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={
                    isNested
                      ? `loans.${nestIndex}.interestRates.${index}.rate`
                      : `interestRates.${index}.rate`
                  }
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate</FormLabel>
                      <FormControl>
                        <InputNumber
                          placeholder="0.00"
                          className="pr-8"
                          {...field}
                          allowDecimal={true}
                          maxDecimals={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
