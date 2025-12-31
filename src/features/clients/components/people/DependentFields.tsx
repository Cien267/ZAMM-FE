import { useFieldArray, type Control } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import { GENDER_OPTIONS, RELATIONSHIP_OPTIONS } from "../../constants"
import type { CreatePersonInput, UpdatePersonInput } from "../../types"

interface DependentFieldsProps {
  control: Control<CreatePersonInput | UpdatePersonInput>
}

export const DependentFields = ({ control }: DependentFieldsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "dependents",
  })

  const addDependent = () => {
    append({
      fullName: "",
      yearOfBirth: new Date().getFullYear(),
      gender: "Male",
      relationship: "",
      isStudent: false,
      notes: "",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dependents</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDependent}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Dependent
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p>No dependents added</p>
          <Button
            type="button"
            variant="link"
            onClick={addDependent}
            className="mt-2"
          >
            Add your first dependent
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
                  Dependent {index + 1}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={control}
                  name={`dependents.${index}.fullName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`dependents.${index}.yearOfBirth`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Year of Birth{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <InputNumber
                          placeholder="YYYY"
                          {...field}
                          value={field.value?.toString() || ""}
                          onChange={(val) =>
                            field.onChange(val ? parseInt(val) : null)
                          }
                          allowDecimal={false}
                          allowNegative={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`dependents.${index}.gender`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <RadioGroup
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        defaultValue="Male"
                        className="flex justify-start items-center gap-2"
                      >
                        {GENDER_OPTIONS.map((gender) => (
                          <RadioGroupItem
                            key={gender}
                            value={gender}
                            id={gender}
                          >
                            <Label htmlFor={gender} className="cursor-pointer">
                              {gender}
                            </Label>
                          </RadioGroupItem>
                        ))}
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`dependents.${index}.relationship`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ""}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {RELATIONSHIP_OPTIONS.map((rel) => (
                            <SelectItem key={rel} value={rel}>
                              {rel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={control}
                name={`dependents.${index}.notes`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes..."
                        className="resize-none"
                        rows={3}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
