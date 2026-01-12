import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEvents } from '../hooks/useEvents'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import {
  REPEAT_UNITS,
  CUSTOM_EVENT,
  LIABILITY_MODIFIED_EVENT,
} from '../constants'
import {
  CreateEventSchema,
  UpdateEventSchema,
  type CreateEventInput,
  type Event,
} from '../types'
import { Modal } from '@/components/common/modal'
import { DatePicker } from '@/components/common/DatePicker'
import { InputNumber } from '@/components/common/InputNumber'
import {
  useAllLiabilitiesByCompanyId,
  useAllLiabilitiesByPersonId,
} from '@/hooks/useSharedData'
import type { Liability } from '@/features/liabilities/types'
import { EventFieldFields } from '@/features/events/components/EventFileFields'
import { useAuth } from '@/features/auth/hooks/useAuth'

interface EventFormDialogProps {
  event?: Event | null
  type: 'person' | 'company' | 'liability'
  personId: string | null
  companyId: string | null
  liabilityId: string | null
  description?: string
  onClose: () => void
  onSubmittingChange?: (isSubmitting: boolean) => void
  onSubmit: (createdEvent: Event | null) => void
}

export const EventModalContent = ({
  event,
  type,
  personId,
  companyId,
  liabilityId,
  description,
  onClose,
  onSubmittingChange,
  onSubmit: handleSubmit,
}: EventFormDialogProps) => {
  const isEditing = !!event
  const { user } = useAuth()
  const {
    createEventAsync,
    updateEventAsync,
    isCreatingEvent,
    isUpdatingEvent,
  } = useEvents()

  const { data: liabilitiesDataByPersonId } = useAllLiabilitiesByPersonId(
    personId || '',
    !!personId
  )
  const { data: liabilitiesDataByCompanyId } = useAllLiabilitiesByCompanyId(
    companyId || '',
    !!companyId
  )
  const liabilities: Liability[] =
    type === 'person'
      ? liabilitiesDataByPersonId?.data || []
      : type === 'company'
        ? liabilitiesDataByCompanyId?.data || []
        : []
  const showLiabilityField = type === 'person' || type === 'company'

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(isEditing ? UpdateEventSchema : CreateEventSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || description || '',
      modifiedValuesJson: event?.modifiedValuesJson || '',
      modifiedValuesObject: event?.modifiedValuesObject || '',
      type: event?.type || CUSTOM_EVENT,
      date: event?.date ? new Date(event.date) : undefined,
      isSystem: event?.isSystem ?? false,
      isRepeating: event?.isRepeating ?? false,
      isDismissed: event?.isDismissed ?? false,
      repeatNumber: event?.repeatNumber || 1,
      repeatUnit: event?.repeatUnit || REPEAT_UNITS[0],
      repeatingDateDismissed: event?.repeatingDateDismissed
        ? new Date(event.repeatingDateDismissed)
        : undefined,
      addedByUserId: event?.addedByUserId || user?.id || undefined,
      liabilityId: event?.liabilityId || liabilityId || undefined,
      personId: event?.personId || personId || undefined,
      companyId: event?.companyId || companyId || undefined,
      files: event?.files || [],
      ...(isEditing && event ? { id: event.id } : {}),
    },
  })

  const isRepeating = form.watch('isRepeating')
  useEffect(() => {
    if (isRepeating === false) {
      form.setValue('repeatNumber', 1)
      form.setValue('repeatUnit', REPEAT_UNITS[0])
    }
  }, [isRepeating, form])

  const onSubmit = async (data: CreateEventInput) => {
    try {
      let createdEvent = null
      if (isEditing && event) {
        await updateEventAsync({ ...data, id: event.id })
      } else {
        createdEvent = await createEventAsync(data)
      }
      onClose()
      form.reset()
      handleSubmit(createdEvent)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isSubmitting = isCreatingEvent || isUpdatingEvent

  useEffect(() => {
    onSubmittingChange?.(isSubmitting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting])

  return (
    <Form {...form}>
      <form
        id="event-form"
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log('Validation Errors:', errors)
        )}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="title"
              disabled={event?.isSystem || false}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Event Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter event name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showLiabilityField && (
              <FormField
                control={form.control}
                name="liabilityId"
                disabled={event?.isSystem || false}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Liability</FormLabel>
                    <Select
                      disabled={event?.isSystem || false}
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select liability" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {liabilities.map((liability) => (
                          <SelectItem key={liability.id} value={liability.id}>
                            {liability.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              disabled={event?.isSystem || false}
              render={({ field }) => (
                <FormItem className="flex flex-col col-span-2">
                  <FormLabel>
                    Date Of Event <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={event?.isSystem || false}
                      placeholder="Pick a date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {event?.type === CUSTOM_EVENT && (
              <div className="col-span-2 flex justify-start items-center gap-4">
                <FormField
                  control={form.control}
                  name="isRepeating"
                  disabled={event?.isSystem || false}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center pt-5 space-x-1 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">
                          Repeat Event
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {isRepeating && (
                  <>
                    <FormField
                      control={form.control}
                      name="repeatNumber"
                      disabled={event?.isSystem || false}
                      render={({ field }) => (
                        <FormItem className="w-1/3">
                          <FormLabel>Repeat Number</FormLabel>
                          <FormControl>
                            <InputNumber
                              placeholder="Enter number"
                              {...field}
                              allowDecimal={false}
                              allowNegative={false}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="repeatUnit"
                      disabled={event?.isSystem || false}
                      render={({ field }) => (
                        <FormItem className="w-1/3">
                          <FormLabel>Repeat Unit</FormLabel>
                          <Select
                            disabled={event?.isSystem || false}
                            onValueChange={field.onChange}
                            value={field.value || ''}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {REPEAT_UNITS.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            disabled={event?.type === LIABILITY_MODIFIED_EVENT}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add description..."
                    className="resize-none"
                    rows={5}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <EventFieldFields
          control={form.control}
          name="files"
          label="Event Attachments"
        />
      </form>
    </Form>
  )
}

export const openUpSertEventModal = ({
  event,
  type,
  personId,
  companyId,
  liabilityId,
  description,
}: {
  event: Event | null
  type: 'person' | 'company' | 'liability'
  personId: string | null
  companyId: string | null
  liabilityId: string | null
  description?: string
}) => {
  const isEditing = !!event
  let isSubmitting = false

  const handleFormSubmit = async (createdEvent: Event | null) => {
    console.log('Event created/updated:', createdEvent)
  }

  const updateFooter = () => {
    Modal.open({
      title: isEditing ? 'Edit Event' : 'Add New Event',
      description: isEditing
        ? 'Update event information'
        : 'Enter event details',
      content: (
        <EventModalContent
          event={event}
          type={type}
          personId={personId}
          companyId={companyId}
          liabilityId={liabilityId}
          description={description}
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
          <Button type="submit" form="event-form" disabled={isSubmitting}>
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
      className: 'max-w-3xl!',
    })
  }

  updateFooter()
}
