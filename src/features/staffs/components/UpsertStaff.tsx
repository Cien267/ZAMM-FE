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
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import {
  CreateStaffSchema,
  UpdateStaffSchema,
  type CreateStaffInput,
  type UpdateStaffInput,
} from '../types'
import type { User } from '@/features/auth/types/auth.types'
import { Modal } from '@/components/common/modal'
import { DatePicker } from '@/components/common/DatePicker'

import { format } from 'date-fns'

interface StaffsFormDialogProps {
  staff?: User | null
  onClose: () => void
  onSubmittingChange?: (isSubmitting: boolean) => void
}

export const StaffModalContent = ({
  staff,
  onClose,
  onSubmittingChange,
}: StaffsFormDialogProps) => {
  const isEditing = !!staff
  const {
    createStaffAsync,
    updateStaffAsync,
    isCreatingStaff,
    isUpdatingStaff,
  } = useStaffs()

  const form = useForm<CreateStaffInput | UpdateStaffInput>({
    resolver: zodResolver(isEditing ? UpdateStaffSchema : CreateStaffSchema),
    defaultValues: {
      userName: staff?.userName || '',
      fullName: staff?.fullName || '',
      email: staff?.email || '',
      phoneNumber: staff?.phoneNumber || '',
      dateOfBirth: staff?.dateOfBirth
        ? new Date(staff?.dateOfBirth)
        : undefined,
      password: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      ...(isEditing && staff ? { id: staff.id } : {}),
    },
  })

  const onSubmit = async (data: CreateStaffInput | UpdateStaffInput) => {
    try {
      const payload = {
        ...data,
        dateOfBirth: data.dateOfBirth
          ? format(data.dateOfBirth, 'yyyy-MM-dd')
          : undefined,
      }

      if (isEditing && staff) {
        await updateStaffAsync({ ...payload, id: staff.id } as any)
      } else {
        await createStaffAsync(data as CreateStaffInput)
      }
      onClose()
      form.reset()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isSubmitting = isCreatingStaff || isUpdatingStaff

  useEffect(() => {
    onSubmittingChange?.(isSubmitting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting])

  return (
    <Form {...form} key={staff?.id || 'new-staff'}>
      <form
        id="staff-form"
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log('Validation Errors:', errors)
        )}
        className="space-y-6"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Staff Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    User Name <span className="text-destructive">*</span>
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
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Full Name <span className="text-destructive">*</span>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email Address <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Of Birth</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                      disableFutureDates
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number"
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const val = e.target.value
                        field.onChange(val === '' ? null : val)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Password</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name={isEditing ? 'currentPassword' : 'password'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {isEditing ? 'Current ' : ''}Password{' '}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid col-span-2 grid-cols-1 md:grid-cols-2 gap-4">
              {isEditing && (
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        New Password <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Confirm {isEditing ? 'New ' : ''}Password{' '}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}

export const openUpSertStaffModal = ({ staff }: { staff: User | null }) => {
  const isEditing = !!staff
  let isSubmitting = false

  const updateFooter = () => {
    Modal.open({
      title: isEditing ? 'Edit Staff' : 'Add New Staff',
      description: isEditing
        ? 'Update staff information'
        : 'Enter staff details',
      content: (
        <StaffModalContent
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
          <Button type="submit" form="staff-form" disabled={isSubmitting}>
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
      className: 'max-w-4xl!',
    })
  }

  updateFooter()
}
