import React, { useRef, useState } from 'react'
import { type Control, useController } from 'react-hook-form'
import { X, Paperclip, UploadCloud, ArrowDownToLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface EventFileFieldsProps {
  control: Control<any>
  name: string
  label?: string
}

export const EventFileFields = ({
  control,
  name,
  label,
}: EventFileFieldsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const {
    field: { value, onChange },
  } = useController({ name, control })

  const files: File[] = value || []

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    onChange([...files, ...newFiles])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      onChange([...files, ...droppedFiles])
      e.dataTransfer.clearData()
    }
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
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              border-2 border-dashed rounded-lg p-6 transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer
              ${
                isDragging
                  ? 'border-primary/25 bg-accent/50'
                  : 'border-muted-foreground/25 hover:bg-accent/50'
              }
            `}
          >
            {isDragging ? (
              <ArrowDownToLine className="h-8 w-8 text-muted-foreground animate-pulse" />
            ) : (
              <UploadCloud className="h-8 w-8 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground">
              {isDragging
                ? 'Drop files here'
                : 'Click to upload or drag and drop'}
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
