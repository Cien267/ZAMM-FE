import { useFieldArray, type Control } from 'react-hook-form'
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
import type { CreateLiabilityInput, UpdateLiabilityInput } from '../types'
import { useAllAssets } from '@/hooks/useSharedData'

interface LinkedAssetsFieldsProps {
  control: Control<CreateLiabilityInput | UpdateLiabilityInput>
}

export const LinkedAssetsFields = ({ control }: LinkedAssetsFieldsProps) => {
  const { data: assetsData } = useAllAssets()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'liabilityAssets',
  })

  const addAsset = () => {
    append({
      assetId: '',
    })
  }

  const removeAsset = (index: number) => {
    remove(index)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold">Linked Assets</h4>
        <Button type="button" variant="outline" size="sm" onClick={addAsset}>
          <Plus className="h-4 w-4 mr-1" />
          Add Asset
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
          <p className="text-sm">No assets linked</p>
          <Button
            type="button"
            variant="link"
            onClick={addAsset}
            className="mt-2"
            size="sm"
          >
            Add your first asset
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <FormField
                  control={control}
                  name={`liabilityAssets.${index}.assetId`}
                  render={({ field }) => (
                    <FormItem className="flex w-2/3 gap-2">
                      <FormLabel className="w-1/2">Asset {index + 1}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Asset" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(assetsData || []).map((a) => (
                            <SelectItem key={a.id} value={a.id}>
                              {a.name}
                            </SelectItem>
                          ))}
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
                  onClick={() => removeAsset(index)}
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
