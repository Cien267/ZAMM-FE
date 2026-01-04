import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCompanies } from '../hooks/useCompanies'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { COMPANY_TYPES, INDUSTRIES } from '../constants'
import {
  CreateCompanySchema,
  UpdateCompanySchema,
  type CreateCompanyInput,
  type Company,
} from '../types'
import { CompanyPeopleFields } from './CompanyPeopleFields'
import { Modal } from '@/components/common/modal'
import { DatePicker } from '@/components/common/DatePicker'
import { InputNumber } from '@/components/common/InputNumber'
import { openUpSertAssetModal } from '@/features/assets/components/UpSertAsset'
import { useAllUsers, useAllPeople } from '@/hooks/useSharedData'
import { AddressFields } from '@/features/address/components/AddressFields'

interface CompanyFormDialogProps {
  company?: Company | null
  onClose: () => void
  onSubmittingChange?: (isSubmitting: boolean) => void
  onSubmit: (
    createdCompany: Company | null,
    action: 'exit' | 'add-asset'
  ) => void
}

export const CompanyModalContent = ({
  company,
  onClose,
  onSubmittingChange,
  onSubmit: handleSubmit,
}: CompanyFormDialogProps) => {
  const isEditing = !!company
  const {
    createCompanyAsync,
    updateCompanyAsync,
    isCreatingCompany,
    isUpdatingCompany,
  } = useCompanies()

  const { data: users } = useAllUsers()
  const { data: peopleData } = useAllPeople()
  const brokers = users || []
  const people = peopleData?.data || []

  const form = useForm<CreateCompanyInput>({
    resolver: zodResolver(
      isEditing ? UpdateCompanySchema : CreateCompanySchema
    ),
    defaultValues: {
      name: company?.name || '',
      tradingName: company?.tradingName || '',
      type: company?.type || COMPANY_TYPES[0],
      abn: company?.abn || '',
      acn: company?.acn || '',
      registrationDate: company?.registrationDate
        ? new Date(company.registrationDate)
        : undefined,
      phoneWork: company?.phoneWork || '',
      website: company?.website || '',
      email: company?.email || '',
      industry: company?.industry || INDUSTRIES[0],
      actingOnTrust: company?.actingOnTrust || false,
      trustName: company?.trustName || '',
      isContactExistingPerson: company?.isContactExistingPerson || true,
      contactPersonId: company?.contactPersonId || null,
      externalContactName: company?.externalContactName || '',
      externalContactEmail: company?.externalContactEmail || '',
      externalContactPhone: company?.externalContactPhone || '',
      referrerId: company?.referrerId || null,
      brokerId: company?.brokerId || brokers[0]?.id,
      addressText: '',
      address: company?.address || {
        level: '',
        building: '',
        unitNumber: '',
        streetNumber: '',
        streetName: '',
        suburb: '',
        state: '',
        country: '',
        postcode: '',
        offPlan: false,
      },
      companyPeople: company?.companyPeople || [],
      ...(isEditing && company ? { id: company.id } : {}),
    },
  })

  const actingOnTrust = form.watch('actingOnTrust')
  const isContactExistingPerson = form.watch('isContactExistingPerson')

  const onSubmit = async (data: CreateCompanyInput) => {
    try {
      let createdCompany = null
      if (isEditing && company) {
        await updateCompanyAsync({ ...data, id: company.id })
      } else {
        createdCompany = await createCompanyAsync(data)
      }
      const action = (window as any).__companyFormAction || 'exit'
      onClose()
      form.reset()
      handleSubmit(createdCompany, action)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isSubmitting = isCreatingCompany || isUpdatingCompany

  useEffect(() => {
    onSubmittingChange?.(isSubmitting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting])

  return (
    <Form {...form}>
      <form
        id="company-form"
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log('Validation Errors:', errors)
        )}
        className="space-y-6"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Company Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter company name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tradingName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trading Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter trading name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {COMPANY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
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
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
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
              name="abn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ABN</FormLabel>
                  <FormControl>
                    <InputNumber
                      {...field}
                      placeholder="11 digits"
                      maxLength={11}
                      allowDecimal={false}
                      allowNegative={false}
                      returnString={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ACN</FormLabel>
                  <FormControl>
                    <InputNumber
                      {...field}
                      placeholder="9 digits"
                      maxLength={9}
                      allowDecimal={false}
                      allowNegative={false}
                      returnString={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registrationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Registration Date</FormLabel>
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
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="company@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneWork"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <InputNumber
                      {...field}
                      placeholder="Enter phone"
                      allowDecimal={false}
                      allowNegative={false}
                      returnString={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brokerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Broker</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select broker" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brokers.map((broker) => (
                        <SelectItem key={broker.id} value={broker.id}>
                          {broker.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <AddressFields />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Person</h3>

          <FormField
            control={form.control}
            name="isContactExistingPerson"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    value={field.value ? 'existing' : 'external'}
                    onValueChange={(value) =>
                      field.onChange(value === 'existing')
                    }
                    className="flex justify-start items-center gap-2"
                  >
                    <RadioGroupItem value="existing" id="existing">
                      <Label
                        htmlFor="existing"
                        className="cursor-pointer font-normal"
                      >
                        Existing Person
                      </Label>
                    </RadioGroupItem>

                    <RadioGroupItem value="external" id="external">
                      <Label
                        htmlFor="external"
                        className="cursor-pointer font-normal"
                      >
                        External Contact
                      </Label>
                    </RadioGroupItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isContactExistingPerson ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPersonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Contact Person</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select person" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {people.map((person) => (
                          <SelectItem key={person.id} value={person.id}>
                            {person.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="externalContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="externalContactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="contact@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="externalContactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <InputNumber
                        {...field}
                        placeholder="Enter phone"
                        allowDecimal={false}
                        allowNegative={false}
                        returnString={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="actingOnTrust"
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
                      Acting on Trust
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {actingOnTrust && (
              <FormField
                control={form.control}
                name="trustName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trust Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter trust name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Referrer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="referrerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referred By</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select person" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {people.map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Associated People */}
        <CompanyPeopleFields control={form.control} />
      </form>
    </Form>
  )
}

export const openUpSertCompanyModal = ({
  company,
}: {
  company: Company | null
}) => {
  const isEditing = !!company
  let isSubmitting = false

  const handleFormSubmit = async (
    createdCompany: Company | null,
    action: 'exit' | 'add-asset'
  ) => {
    if (action === 'add-asset' && createdCompany?.id) {
      openUpSertAssetModal({
        asset: null,
        initialPerson: null,
        initialCompany: createdCompany,
      })
    }
  }

  const updateFooter = () => {
    Modal.open({
      title: isEditing ? 'Edit Company' : 'Add New Company',
      description: isEditing
        ? 'Update company information'
        : 'Enter company details',
      content: (
        <CompanyModalContent
          company={company}
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
            type="submit"
            form="company-form"
            disabled={isSubmitting}
            onClick={() => {
              ;(window as any).__companyFormAction = 'exit'
            }}
          >
            {isSubmitting && (window as any).__companyFormAction === 'exit' ? (
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
              type="submit"
              form="company-form"
              disabled={isSubmitting}
              onClick={() => {
                ;(window as any).__companyFormAction = 'add-asset'
              }}
            >
              {isSubmitting &&
              (window as any).__companyFormAction === 'add-asset' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create & Add Asset'
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
