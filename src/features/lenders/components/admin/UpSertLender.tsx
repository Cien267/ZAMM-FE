import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLenders } from '../../hooks/useLenders'
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
  CreateLenderSchema,
  UpdateLenderSchema,
  type CreateLenderInput,
  type Lender,
  type UpdateLenderInput,
} from '../../types'
import { Modal } from '@/components/common/modal'
import { openCreateLoanModal } from '@/features/loans/components/CreateLoan'
import { slugify } from '@/lib/utils'

interface lendersFormDialogProps {
  lender?: Lender | null
  onClose: () => void
  onSubmittingChange?: (isSubmitting: boolean) => void
  onSubmit: (createdLender: Lender | null, action: 'exit' | 'add-loans') => void
}

export const LenderModalContent = ({
  lender,
  onClose,
  onSubmittingChange,
  onSubmit: handleSubmit,
}: lendersFormDialogProps) => {
  const isEditing = !!lender
  const {
    createLenderAsync,
    updateLenderAsync,
    isCreatingLender,
    isUpdatingLender,
  } = useLenders()

  const form = useForm<CreateLenderInput | UpdateLenderInput>({
    resolver: zodResolver(isEditing ? UpdateLenderSchema : CreateLenderSchema),
    defaultValues: {
      name: lender?.name || '',
      slug: lender?.slug || '',
      logoUrl: lender?.logoUrl || '',
      ...(isEditing && lender ? { id: lender.id } : {}),
    },
  })

  const nameValue = form.watch('name')

  useEffect(() => {
    if (nameValue) {
      form.setValue('slug', slugify(nameValue), { shouldValidate: true })
    }
  }, [nameValue, form])

  const onSubmit = async (data: CreateLenderInput) => {
    try {
      let createdLender = null
      if (isEditing && lender) {
        await updateLenderAsync({ ...data, id: lender.id })
      } else {
        createdLender = await createLenderAsync(data)
      }
      const action = (window as any).__lenderFormAction || 'exit'
      onClose()
      form.reset()
      handleSubmit(createdLender, action)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isSubmitting = isCreatingLender || isUpdatingLender

  useEffect(() => {
    onSubmittingChange?.(isSubmitting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting])

  return (
    <Form {...form} key={lender?.id || 'new-lender'}>
      <form
        id="lender-form"
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
                    Lender Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo Url</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter your logo image url" />
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

export const openUpSertLenderModal = ({
  lender,
}: {
  lender: Lender | null
}) => {
  const isEditing = !!lender
  let isSubmitting = false

  const handleFormSubmit = async (
    createdLender: Lender | null,
    action: 'exit' | 'add-loans'
  ) => {
    if (action == 'add-loans' && createdLender?.id) {
      openCreateLoanModal({
        lender: createdLender,
      })
    }
  }

  const updateFooter = () => {
    Modal.open({
      title: isEditing ? 'Edit Lender' : 'Add New Lender',
      description: isEditing
        ? 'Update lender information'
        : 'Enter lender details',
      content: (
        <LenderModalContent
          lender={lender}
          onClose={() => Modal.close()}
          onSubmittingChange={(submitting) => {
            isSubmitting = submitting
            updateFooter()
          }}
          onSubmit={handleFormSubmit}
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
            form="lender-form"
            disabled={isSubmitting}
            onClick={() => {
              ;(window as any).__lenderFormAction = 'exit'
            }}
          >
            {isSubmitting && (window as any).__lenderFormAction === 'exit' ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : isEditing ? (
              'Update'
            ) : (
              'Create & Exit'
            )}
          </Button>

          {!isEditing && (
            <Button
              variant="sky"
              type="submit"
              form="lender-form"
              disabled={isSubmitting}
              onClick={() => {
                ;(window as any).__lenderFormAction = 'add-loans'
              }}
            >
              {isSubmitting &&
              (window as any).__lenderFormAction === 'add-loans' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create & Add Loans'
              )}
            </Button>
          )}
        </div>
      ),
      className: 'max-w-4xl!',
    })
  }

  updateFooter()
}
