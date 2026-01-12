import { type Control, type FieldValues, type Path } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

interface NoteFieldProps<T extends FieldValues> {
  control: Control<T>
  name?: Path<T>
}

export const NoteField = <T extends FieldValues>({
  control,
  name = 'text' as Path<T>,
}: NoteFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full mb-0">
          <FormControl>
            <Textarea
              className="resize-none min-h-10"
              placeholder="Enter note content"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
