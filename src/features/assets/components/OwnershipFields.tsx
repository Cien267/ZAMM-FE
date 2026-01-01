import { useFieldArray, type Control } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { InputNumber } from "@/components/common/InputNumber"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Plus, X } from "lucide-react"
import type { CreateAssetInput, UpdateAssetInput } from "../types"
import { useAllPeople, useAllCompanies } from "@/hooks/useSharedData"

interface OwnershipFieldsProps {
  control: Control<CreateAssetInput | UpdateAssetInput>
  setValue: any
  type: "people" | "company"
}

export const OwnershipFields = ({
  control,
  setValue,
  type,
}: OwnershipFieldsProps) => {
  const isAssetPeople = type === "people"
  const fieldName = isAssetPeople ? "assetPeople" : "assetCompanies"

  const { data: peopleData } = useAllPeople()
  const { data: companiesData } = useAllCompanies()

  let options = isAssetPeople
    ? peopleData?.data || []
    : companiesData?.data || []

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName as "assetPeople" | "assetCompanies",
  })

  const redistribute = (count: number) => {
    const share = Math.floor(100 / count)
    const remainder = 100 % count

    for (let i = 0; i < count; i++) {
      const finalPercent = i === 0 ? share + remainder : share
      setValue(`${fieldName}.${i}.percent` as any, finalPercent)
    }
  }

  const addOwner = () => {
    const nextCount = fields.length + 1

    if (isAssetPeople) {
      append({ personId: "", percent: 0 })
    } else {
      append({ companyId: "", percent: 0 })
    }

    redistribute(nextCount)
  }

  const removeOwner = (index: number) => {
    if (fields.length <= 1) return

    remove(index)
    redistribute(fields.length - 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Ownership</h3>
        <Button type="button" variant="outline" size="sm" onClick={addOwner}>
          <Plus className="h-4 w-4 mr-2" />
          Add Owner
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p>No owners added</p>
          <Button
            type="button"
            variant="link"
            onClick={addOwner}
            className="mt-2"
          >
            Add your first owner
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
                  Owner {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOwner(index)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={
                    isAssetPeople
                      ? `assetPeople.${index}.personId`
                      : `assetCompanies.${index}.companyId`
                  }
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {isAssetPeople ? "Person" : "Company"}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Person" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {options.map((opt) => (
                            <SelectItem key={opt.id} value={opt.id}>
                              {"fullName" in opt ? opt.fullName : opt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`${fieldName}.${index}.percent`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percent</FormLabel>
                      <FormControl>
                        <InputNumber
                          placeholder="%"
                          {...field}
                          allowDecimal={false}
                          allowNegative={false}
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
