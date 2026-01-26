import { useFieldArray, type Control, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
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
import type { CreateAssetInput, UpdateAssetInput } from '../types'
import { useAllLiabilities } from '@/hooks/useSharedData'

interface LinkedLiabilitiesFieldsProps {
  control: Control<CreateAssetInput | UpdateAssetInput>
}

export const LinkedLiabilitiesFields = ({
  control,
}: LinkedLiabilitiesFieldsProps) => {
  const { data: liabilitiesData = [] } = useAllLiabilities()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assetLiabilities',
  })

  const watchedLiabilities = useWatch({
    control,
    name: 'assetLiabilities',
  })

  const selectedIds = new Set(
    watchedLiabilities?.map((item: any) => item.liabilityId).filter(Boolean)
  )

  const addLiability = () => {
    append({
      liabilityId: '',
    })
  }

  const removeLiability = (index: number) => {
    remove(index)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Linked Liabilities</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addLiability}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Liability
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p>No liabilities added</p>
          <Button
            type="button"
            variant="link"
            onClick={addLiability}
            className="mt-2"
          >
            Add your first liability
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
                <FormField
                  control={control}
                  name={`assetLiabilities.${index}.liabilityId`}
                  render={({ field }) => (
                    <FormItem className="flex w-2/3 gap-2">
                      <FormLabel className="w-1/2">
                        Liability {index + 1}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Liability" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {liabilitiesData.map((li) => {
                            const isAlreadySelected = selectedIds.has(li.id)
                            const isCurrentValue = field.value === li.id

                            if (isAlreadySelected && !isCurrentValue)
                              return null

                            return (
                              <SelectItem key={li.id} value={li.id}>
                                {li.name}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLiability(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
