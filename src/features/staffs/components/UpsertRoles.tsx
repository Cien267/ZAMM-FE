import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useStaffs } from '../hooks/useStaffs'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'
import { UpdateRolesSchema, type UpdateRolesInput } from '../types'
import type { User } from '@/features/auth/types/auth.types'
import { Modal } from '@/components/common/modal'
import { ROLE_OPTIONS } from '../constants'

interface RolesFormDialogProps {
  staff: User
  onClose: () => void
  onSubmittingChange?: (isSubmitting: boolean) => void
}

export const RoleModalContent = ({
  staff,
  onClose,
  onSubmittingChange,
}: RolesFormDialogProps) => {
  const { updateRolesAsync, isUpdatingRoles } = useStaffs()

  const form = useForm<UpdateRolesInput>({
    resolver: zodResolver(UpdateRolesSchema),
    defaultValues: {
      id: staff.id,
      roles: staff.roles || [],
    },
  })

  const onSubmit = async (data: UpdateRolesInput) => {
    try {
      await updateRolesAsync(data)
      onClose()
      form.reset()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  useEffect(() => {
    onSubmittingChange?.(isUpdatingRoles)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdatingRoles])

  return (
    <Form {...form} key={staff?.id}>
      <form
        id="role-form"
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log('Validation Errors:', errors)
        )}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="roles"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-4 gap-4">
                {ROLE_OPTIONS.map((item) => (
                  <FormField
                    key={item.value}
                    control={form.control}
                    name="roles"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.value}
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value: string) => value !== item.value
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export const openUpSertRolesModal = ({ staff }: { staff: User }) => {
  let isSubmitting = false

  const updateFooter = () => {
    Modal.open({
      title: 'Edit Roles',
      description: 'Select the roles you want to assign to this staff member.',
      content: (
        <RoleModalContent
          staff={staff}
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
          <Button type="submit" form="role-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </div>
      ),
      className: 'max-w-4xl!',
    })
  }

  updateFooter()
}
