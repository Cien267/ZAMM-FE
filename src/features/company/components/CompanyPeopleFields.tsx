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
  FormMessage,
  FormLabel,
} from '@/components/ui/form'
import { Plus, X } from 'lucide-react'
import type { CreateCompanyInput } from '../types'
import { useAllPeople } from '@/hooks/useSharedData'

interface CompanyPeopleFieldsProps {
  control: Control<CreateCompanyInput>
}

export const CompanyPeopleFields = ({ control }: CompanyPeopleFieldsProps) => {
  const { data: peopleData } = useAllPeople()
  const people = peopleData?.data || []

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'companyPeople',
  })

  const addPerson = () => {
    append({
      personId: '',
    })
  }

  const removePerson = (index: number) => {
    remove(index)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Associated People</h3>
        <Button type="button" variant="outline" size="sm" onClick={addPerson}>
          <Plus className="h-4 w-4 mr-2" />
          Add Person
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
          <p>No people associated</p>
          <Button
            type="button"
            variant="link"
            onClick={addPerson}
            className="mt-2"
          >
            Add your first person
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="relative border rounded-lg p-4 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <FormField
                  control={control}
                  name={`companyPeople.${index}.personId`}
                  render={({ field }) => (
                    <FormItem className="flex w-2/3 gap-2">
                      <FormLabel className="w-1/2">
                        Person {index + 1}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Person" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {people.map((person) => (
                            <SelectItem key={person.id} value={person.id}>
                              {person.fullName}
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
                  onClick={() => removePerson(index)}
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
