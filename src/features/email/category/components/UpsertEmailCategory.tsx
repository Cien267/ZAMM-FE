import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEmailCategories } from '../hooks/useEmailCategories'
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
import {
  CreateEmailCategorySchema,
  UpdateEmailCategorySchema,
  type CreateEmailCategoryInput,
  type UpdateEmailCategoryInput,
} from '../types'
import type { EmailCategory } from '../types'
import { Modal } from '@/components/common/modal'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

interface EmailCategoriesFormDialogProps {
  emailCategory?: EmailCategory | null
  onClose: () => void
  onSubmittingChange?: (isSubmitting: boolean) => void
}

export const EmailCategoryModalContent = ({
  emailCategory,
  onClose,
  onSubmittingChange,
}: EmailCategoriesFormDialogProps) => {
  const isEditing = !!emailCategory
  const {
    createEmailCategoryAsync,
    updateEmailCategoryAsync,
    isCreatingEmailCategory,
    isUpdatingEmailCategory,
  } = useEmailCategories()
  const form = useForm<CreateEmailCategoryInput | UpdateEmailCategoryInput>({
    resolver: zodResolver(
      isEditing ? UpdateEmailCategorySchema : CreateEmailCategorySchema
    ),
    defaultValues: {
      name: emailCategory?.name || '',
      description: emailCategory?.description || '',
      isActive: emailCategory?.isActive ?? true,
      ...(isEditing && emailCategory ? { id: emailCategory.id } : {}),
    },
  })

  const onSubmit = async (
    data: CreateEmailCategoryInput | UpdateEmailCategoryInput
  ) => {
    try {
      if (isEditing && emailCategory) {
        await updateEmailCategoryAsync({ ...data, id: emailCategory.id } as any)
      } else {
        await createEmailCategoryAsync(data as CreateEmailCategoryInput)
      }
      onClose()
      form.reset()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isSubmitting = isCreatingEmailCategory || isUpdatingEmailCategory

  useEffect(() => {
    onSubmittingChange?.(isSubmitting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting])

  return (
    <Form {...form} key={emailCategory?.id || 'new-emailCategory'}>
      <form
        id="emailCategory-form"
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log('Validation Errors:', errors)
        )}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter username" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description..." {...field} />
                  </FormControl>
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
        </div>
      </form>
    </Form>
  )
}

export const openUpSertEmailCategoryModal = ({
  emailCategory,
}: {
  emailCategory: EmailCategory | null
}) => {
  const isEditing = !!emailCategory
  let isSubmitting = false

  const updateFooter = () => {
    Modal.open({
      title: isEditing ? 'Edit Email Category' : 'Add New Email Category',
      description: isEditing
        ? 'Update email category information'
        : 'Enter email category details',
      content: (
        <EmailCategoryModalContent
          emailCategory={emailCategory}
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
            form="emailCategory-form"
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
      className: 'max-w-2xl!',
    })
  }

  updateFooter()
}
