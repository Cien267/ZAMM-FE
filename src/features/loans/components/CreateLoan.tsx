import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
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
import { Loader2, X, Plus } from 'lucide-react'
import { Modal } from '@/components/common/modal'
import type { Lender } from '@/features/lenders/types'
import { InterestRateFields } from './InterestRateFields'
import { type CreateLoanInput, BatchCreateLoanSchema } from '../types'

interface loansFormDialogProps {
  lender: Lender
  onClose: () => void
  onSubmittingChange?: (isSubmitting: boolean) => void
}

export const LoanModalContent = ({
  lender,
  onClose,
  onSubmittingChange,
}: loansFormDialogProps) => {
  const { createLoanAsync, isCreatingLoan } = useLoans()

  const form = useForm<{ loans: CreateLoanInput[] }>({
    resolver: zodResolver(BatchCreateLoanSchema),
    defaultValues: {
      loans: [
        {
          name: '',
          lenderId: lender.id,
          interestRates: [],
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'loans',
  })

  const onSubmit = async (data: { loans: any[] }) => {
    try {
      await Promise.all(
        data.loans.map((loanData) => {
          return createLoanAsync(loanData)
        })
      )
      onClose()
    } catch (error) {
      console.error('Submission failed', error)
    }
  }

  const isSubmitting = isCreatingLoan

  useEffect(() => {
    onSubmittingChange?.(isSubmitting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting])

  return (
    <Form {...form}>
      <form
        id="loan-form"
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log('Validation Errors:', errors)
        )}
        className="space-y-8"
      >
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-4 border rounded-xl bg-muted/30 relative"
          >
            <div className="flex justify-between mb-4">
              <span className="font-bold text-lg">Loan #{index + 1}</span>
              {fields.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => remove(index)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid gap-4">
              <FormField
                control={form.control}
                name={`loans.${index}.name`}
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
              <InterestRateFields control={form.control} nestIndex={index} />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={() =>
            append({ name: '', lenderId: lender.id, interestRates: [] })
          }
        >
          <Plus className="mr-2 h-4 w-4" /> Add Another Loan
        </Button>
      </form>
    </Form>
  )
}

export const openCreateLoanModal = ({ lender }: { lender: Lender }) => {
  let isSubmitting = false

  const updateFooter = () => {
    Modal.open({
      title: 'Add New Loan',
      description: 'Enter loan details',
      content: (
        <LoanModalContent
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
          <Button
            variant="sky"
            type="submit"
            form="loan-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
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
