import React, { useRef } from 'react'
import { type Control, useController } from 'react-hook-form'
import { X, Paperclip, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface EventFieldFieldsProps {
  control: Control<any>
  name: string
  label?: string
}

export const EventFieldFields = ({
  control,
  name,
  label,
}: EventFieldFieldsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    field: { value, onChange },
  } = useController({ name, control })

  const files: File[] = value || []

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    onChange([...files, ...newFiles])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    onChange(updatedFiles)
  }

  return (
    <div className="space-y-4">
      <FormItem>
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 hover:bg-accent/50 cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
          >
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <input
              type="file"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-2 border rounded-md bg-background"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Paperclip className="h-4 w-4 shrink-0" />
                <span className="text-sm truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
