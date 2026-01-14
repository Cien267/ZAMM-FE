import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLoans } from '../hooks/useLoans'
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
import { UpdateLoanSchema, type Loan, type UpdateLoanInput } from '../types'
import { Modal } from '@/components/common/modal'
import type { Lender } from '@/features/lenders/types'
import { InterestRateFields } from './InterestRateFields'

interface loansFormDialogProps {
  loan: Loan
  lender: Lender
  onClose: () => void
  onSubmittingChange?: (isSubmitting: boolean) => void
}

export const LoanModalContent = ({
  loan,
  lender,
  onClose,
  onSubmittingChange,
}: loansFormDialogProps) => {
  const { updateLoanAsync, isUpdatingLoan } = useLoans()

  const form = useForm<UpdateLoanInput>({
    resolver: zodResolver(UpdateLoanSchema),
    defaultValues: {
      name: loan?.name || '',
      lenderId: lender.id || '',
      interestRates: loan?.interestRates || [],
      id: loan.id,
    },
  })

  const onSubmit = async (data: UpdateLoanInput) => {
    try {
      await updateLoanAsync(data)
      onClose()
      form.reset()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isSubmitting = isUpdatingLoan

  useEffect(() => {
    onSubmittingChange?.(isSubmitting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting])

  return (
    <Form {...form} key={loan.id}>
      <form
        id="loan-form"
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
                    Loan Name <span className="text-destructive">*</span>
                  </FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <InterestRateFields control={form.control} />
        </div>
      </form>
    </Form>
  )
}

export const openUpdateLoanModal = ({
  loan,
  lender,
}: {
  loan: Loan
  lender: Lender
}) => {
  let isSubmitting = false

  const updateFooter = () => {
    Modal.open({
      title: 'Edit Loan',
      description: 'Update loan information',
      content: (
        <LoanModalContent
          loan={loan}
          lender={lender}
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

          <Button type="submit" form="loan-form" disabled={isSubmitting}>
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
