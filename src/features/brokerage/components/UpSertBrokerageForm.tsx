import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { slugify } from '@/lib/utils'
import { useBrokerage } from '../hooks/useBrokerages'
import {
  CreateBrokerageSchema,
  type Brokerage,
  type CreateBrokerageInput,
  type UpdateBrokerageInput,
} from '../types'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Toaster } from 'sonner'

interface BrokerageFormProps {
  brokerage?: Brokerage | null
  onSubmit: (createdBrokerage: Brokerage | null) => void
}

export const UpSertBrokerageForm = ({
  brokerage,
  onSubmit: handleSubmit,
}: BrokerageFormProps) => {
  const isEditing = !!brokerage
  const {
    createBrokerageAsync,
    updateBrokerageAsync,
    isCreatingBrokerage,
    isUpdatingBrokerage,
  } = useBrokerage()

  const form = useForm<CreateBrokerageInput | UpdateBrokerageInput>({
    resolver: zodResolver(CreateBrokerageSchema),
    defaultValues: {
      name: brokerage?.name || '',
      slug: brokerage?.slug || '',
      authorisedDomain: brokerage?.authorisedDomain || '',
      isMasterAccount: brokerage?.isMasterAccount || false,
      logos: brokerage?.logos || [],
      ...(isEditing && brokerage ? { id: brokerage.id } : {}),
    },
  })

  const nameValue = form.watch('name')

  useEffect(() => {
    if (nameValue) {
      form.setValue('slug', slugify(nameValue), { shouldValidate: true })
    }
  }, [nameValue, form])

  const onSubmit = async (
    data: CreateBrokerageInput | UpdateBrokerageInput
  ) => {
    try {
      let createdBrokerage = null
      if (isEditing && brokerage) {
        await updateBrokerageAsync({ ...data, id: brokerage.id })
      } else {
        createdBrokerage = await createBrokerageAsync(data)
      }
      form.reset()
      handleSubmit(createdBrokerage)
    } catch (error) {
      console.error('Brokerage submission error:', error)
    }
  }

  const isSubmitting = isCreatingBrokerage || isUpdatingBrokerage

  return (
    <>
      <Form {...form} key={brokerage?.id || 'new-brokerage'}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log('Validation Errors:', errors)
          )}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brokerage Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="authorisedDomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Authorised Domain (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* <FormField
            control={form.control}
            name="logos.0.url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://example.com/logo.png"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <Button className="w-full" type="submit" disabled={isSubmitting}>
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
        </form>
      </Form>
      <Toaster
        toastOptions={{
          classNames: {
            error: 'bg-red-50! border-red-200! text-red-900!',
            success: 'bg-green-50! border-green-200! text-green-900!',
            warning: 'bg-yellow-50! border-yellow-200! text-yellow-900!',
            info: 'bg-blue-50! border-blue-200! text-blue-900!',
          },
        }}
      />
    </>
  )
}
