import { useEffect, useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEmailTemplates } from '../hooks/useEmailTemplates'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  CreateEmailTemplateSchema,
  UpdateEmailTemplateSchema,
  type CreateEmailTemplateInput,
  type UpdateEmailTemplateInput,
} from '../types'
import type { EmailTemplate } from '../types'
import { Modal } from '@/components/common/modal'
import { Switch } from '@/components/ui/switch'
import { useAllEmailCategories } from '@/hooks/useSharedData'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { Separator } from '@/components/ui/separator'
import { PreviewBodyTemplate } from './PreviewBodyTemplate'
import { useEmailTemplateQueries } from '../hooks/useEmailTemplatesQueries'

interface EmailTemplatesFormDialogProps {
  emailTemplate?: EmailTemplate | null
  onClose: () => void
  onSubmittingChange?: (isSubmitting: boolean) => void
}

export const EmailTemplateModalContent = ({
  emailTemplate,
  onClose,
  onSubmittingChange,
}: EmailTemplatesFormDialogProps) => {
  const isEditing = !!emailTemplate
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const { data: categories = [] } = useAllEmailCategories({ isActive: true })
  const { useEmailTemplateVariables } = useEmailTemplateQueries()
  const { data: variables } = useEmailTemplateVariables()
  const {
    createEmailTemplateAsync,
    updateEmailTemplateAsync,
    isCreatingEmailTemplate,
    isUpdatingEmailTemplate,
  } = useEmailTemplates()
  const form = useForm<CreateEmailTemplateInput | UpdateEmailTemplateInput>({
    resolver: zodResolver(
      isEditing ? UpdateEmailTemplateSchema : CreateEmailTemplateSchema
    ),
    defaultValues: {
      name: emailTemplate?.name || '',
      subject: emailTemplate?.subject || '',
      bodyHtml: emailTemplate?.bodyHtml || '',
      categoryId: emailTemplate?.categoryId || '',
      isActive: emailTemplate?.isActive ?? true,
      ...(isEditing && emailTemplate ? { id: emailTemplate.id } : {}),
    },
  })

  const watchedValues = useWatch({
    control: form.control,
    name: ['bodyHtml'],
  })
  const [bodyHtml] = watchedValues

  const insertVariableBody = (variable: string) => {
    const editor: any = editorRef.current
    if (editor) {
      const selection = editor.getSelection()
      const text = `{{${variable}}}`
      const op = { range: selection, text: text, forceMoveMarkers: true }
      editor.executeEdits('my-source', [op])
    }
  }

  const insertVariableSubject = (variable: string) => {
    const text = ` {{${variable}}}`
    const current = form.getValues('subject') || ''
    form.setValue('subject', current + text, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const onSubmit = async (
    data: CreateEmailTemplateInput | UpdateEmailTemplateInput
  ) => {
    try {
      if (isEditing && emailTemplate) {
        await updateEmailTemplateAsync({ ...data, id: emailTemplate.id } as any)
      } else {
        await createEmailTemplateAsync(data as CreateEmailTemplateInput)
      }
      onClose()
      form.reset()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isSubmitting = isCreatingEmailTemplate || isUpdatingEmailTemplate

  useEffect(() => {
    onSubmittingChange?.(isSubmitting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting])

  return (
    <Form {...form} key={emailTemplate?.id || 'new-emailTemplate'}>
      <form
        id="emailTemplate-form"
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log('Validation Errors:', errors)
        )}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>
                    Subject <span className="text-destructive">*</span>
                  </FormLabel>
                  <div className="flex justify-start gap-4">
                    <FormLabel className="font-normal italic">
                      Variables:
                    </FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {variables?.Subject.map((v) => (
                        <Badge
                          key={v}
                          variant="glass"
                          className="cursor-pointer hover:bg-sky-100 p-2"
                          onClick={() => insertVariableSubject(v)}
                        >
                          {`{{${v}}}`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <FormControl>
                    <Input {...field} placeholder="Enter subject" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Active</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="bodyHtml"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Body <span className="text-destructive">*</span>
                    </FormLabel>
                    <div className="flex justify-start gap-4">
                      <FormLabel className="font-normal italic">
                        Variables:
                      </FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {variables?.Body.map((v) => (
                          <Badge
                            key={v}
                            variant="glass"
                            className="cursor-pointer hover:bg-sky-100 p-2"
                            onClick={() => insertVariableBody(v)}
                          >
                            {`{{${v}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <FormControl>
                      <div className="border rounded-md overflow-hidden">
                        <Editor
                          height="400px"
                          defaultLanguage="html"
                          value={field.value}
                          onChange={field.onChange}
                          onMount={(editor) => (editorRef.current = editor)}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 12,
                            padding: {
                              top: 16,
                              bottom: 16,
                            },
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <PreviewBodyTemplate bodyHtml={bodyHtml} />
          </div>
        </div>
      </form>
    </Form>
  )
}

export const openUpSertEmailTemplateModal = ({
  emailTemplate,
}: {
  emailTemplate: EmailTemplate | null
}) => {
  const isEditing = !!emailTemplate
  let isSubmitting = false

  const updateFooter = () => {
    Modal.open({
      title: isEditing ? 'Edit Email Template' : 'Add New Email Template',
      description: isEditing
        ? 'Update email template information'
        : 'Enter email template details',
      content: (
        <EmailTemplateModalContent
          emailTemplate={emailTemplate}
          onClose={() => Modal.close()}
          onSubmittingChange={(submitting) => {
            isSubmitting = submitting
            updateFooter()
          }}
        />
      ),
      footer: (
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => Modal.close()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="sky"
            type="submit"
            form="emailTemplate-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : isEditing ? (
              'Update'
            ) : (
              'Create'
            )}
          </Button>
        </div>
      ),
      className: 'max-w-7xl!',
    })
  }

  updateFooter()
}
