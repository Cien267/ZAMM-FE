import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAssets } from '../hooks/useAssets'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import {
  ZONING_TYPES,
  PROPERTY_TYPES,
  RENTAL_INCOME_FREQUENCIES,
} from '../constants'
import {
  CreateAssetSchema,
  UpdateAssetSchema,
  type CreateAssetInput,
  type UpdateAssetInput,
  type Asset,
} from '../types'
import { Modal } from '@/components/common/modal'
import { DatePicker } from '@/components/common/DatePicker'
import { InputNumber } from '@/components/common/InputNumber'
import type { Person } from '@/features/people/types'
import type { Company } from '@/features/companies/types'
import { AssetOwnershipFields } from './AssetOwnershipFields'
import { LinkedLiabilitiesFields } from './LinkedLiabilitiesFields'
import { openUpSertLiabilityModal } from '@/features/liabilities/components/UpsertLiability'
import { AddressFields } from '@/features/address/components/AddressFields'
import { useActivityLogs } from '@/features/activity-logs/hooks/useActivityLogs'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  ACTION_TYPE_CREATED,
  ACTION_TYPE_UPDATED,
  ENTITY_TYPE_ASSET,
} from '@/features/activity-logs/constants'

interface AssetFormDialogProps {
  initialPerson: Person | null
  initialCompany: Company | null
  asset?: Asset | null
  type: 'person' | 'company'
  onClose: () => void
  onSubmittingChange?: (isSubmitting: boolean) => void
  onSubmit: (
    createdAsset: Asset | null,
    action: 'exit' | 'add-liability'
  ) => void
}

export const AssetModalContent = ({
  initialPerson,
  initialCompany,
  asset,
  type,
  onClose,
  onSubmittingChange,
  onSubmit: handleSubmit,
}: AssetFormDialogProps) => {
  const isEditing = !!asset
  const {
    createAssetAsync,
    updateAssetAsync,
    isCreatingAsset,
    isUpdatingAsset,
  } = useAssets()
  const { createActivityLog } = useActivityLogs()
  const { user } = useAuth()
  const form = useForm<CreateAssetInput | UpdateAssetInput>({
    resolver: zodResolver(isEditing ? UpdateAssetSchema : CreateAssetSchema),
    defaultValues: {
      name: asset?.name || '',
      propertyType: asset?.propertyType || PROPERTY_TYPES[0],
      zoningType: asset?.zoningType || ZONING_TYPES[0],
      value: asset?.value ?? null,
      valuationDate: asset?.valuationDate
        ? new Date(asset.valuationDate)
        : undefined,
      addressOffPlan: asset?.addressOffPlan ?? false,
      valueIsCertified: asset?.valueIsCertified ?? false,
      isInvestment: asset?.isInvestment ?? false,
      isUnencumbered: asset?.isUnencumbered ?? false,
      rentalHasAgent: asset?.rentalHasAgent ?? false,
      rentalIncomeValue: asset?.rentalIncomeValue ?? null,
      rentalIncomeFrequency: asset?.rentalIncomeFrequency || '',
      rentalAgentContact: asset?.rentalAgentContact || '',
      address: asset?.address || {
        level: '',
        building: '',
        unitNumber: '',
        streetNumber: '',
        streetName: '',
        suburb: '',
        state: '',
        postcode: '',
        country: '',
        offPlan: false,
      },
      addressText: '',
      assetPeople:
        asset?.assetPeople ||
        (initialPerson
          ? [
              {
                personId: initialPerson.id,
                percent: 100,
              },
            ]
          : []),
      assetCompanies:
        asset?.assetCompanies ||
        (initialCompany
          ? [
              {
                companyId: initialCompany.id,
                percent: 100,
              },
            ]
          : []),
      assetLiabilities: asset?.assetLiabilities || [],
      ...(isEditing && asset ? { id: asset.id } : {}),
    },
  })

  const isInvestment = form.watch('isInvestment')

  useEffect(() => {
    if (isInvestment) {
      if (!isEditing) {
        const currentFrequency = form.getValues('rentalIncomeFrequency')
        if (!currentFrequency) {
          setTimeout(() => {
            form.setValue(
              'rentalIncomeFrequency',
              RENTAL_INCOME_FREQUENCIES[0],
              {
                shouldValidate: true,
                shouldDirty: true,
              }
            )
          }, 0)
        }
      }
    } else {
      form.setValue('rentalIncomeValue', null)
      form.setValue('rentalIncomeFrequency', '')
    }
  }, [isInvestment, isEditing, form])

  const onSubmit = async (data: CreateAssetInput) => {
    try {
      let createdAsset = null
      if (isEditing && asset) {
        await updateAssetAsync({ ...data, id: asset.id })
        createActivityLog({
          brokerId: user?.id || '',
          brokerageId: user?.brokerageId || '',
          actionType: ACTION_TYPE_UPDATED,
          entityType: ENTITY_TYPE_ASSET,
          entityId: asset.id,
        })
      } else {
        createdAsset = await createAssetAsync(data)
        createActivityLog({
          brokerId: user?.id || '',
          brokerageId: user?.brokerageId || '',
          actionType: ACTION_TYPE_CREATED,
          entityType: ENTITY_TYPE_ASSET,
          entityId: createdAsset.id,
        })
      }
      const action = (window as any).__assetFormAction || 'exit'
      onClose()
      form.reset()
      handleSubmit(createdAsset, action)
    } catch (error) {
      console.error('Asset submission error:', error)
    }
  }

  const isSubmitting = isCreatingAsset || isUpdatingAsset

  useEffect(() => {
    onSubmittingChange?.(isSubmitting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting])

  return (
    <Form {...form} key={asset?.id || 'new-asset'}>
      <form
        id="asset-form"
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
                    Asset Name <span className="text-destructive">*</span>
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
              name="zoningType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zoning</FormLabel>
                  <RadioGroup
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    defaultValue="Residential"
                    className="flex justify-start items-center gap-2"
                  >
                    {ZONING_TYPES.map((type) => (
                      <RadioGroupItem key={type} value={type} id={type}>
                        <Label htmlFor={type} className="cursor-pointer">
                          {type}
                        </Label>
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                    value={field.value || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Property Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PROPERTY_TYPES.map((type) => (
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
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Value</FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="Enter value"
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
              name="valuationDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Valuation Date</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick a date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="isInvestment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value ? 'investment' : 'owner-occupier'}
                      onValueChange={(value) =>
                        field.onChange(value === 'investment')
                      }
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="owner-occupier"
                          id="owner-occupier"
                        >
                          <Label
                            htmlFor="owner-occupier"
                            className="cursor-pointer font-normal"
                          >
                            Owner Occupier
                          </Label>
                        </RadioGroupItem>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="investment" id="investment">
                          <Label
                            htmlFor="investment"
                            className="cursor-pointer font-normal"
                          >
                            Investment
                          </Label>
                        </RadioGroupItem>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isInvestment && (
              <div className="flex justify-between gap-1">
                <FormField
                  control={form.control}
                  name="rentalIncomeValue"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Rental Income</FormLabel>
                      <FormControl>
                        <InputNumber
                          placeholder="Enter amount"
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
                  name="rentalIncomeFrequency"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Frequency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {RENTAL_INCOME_FREQUENCIES.map((frequency) => (
                            <SelectItem key={frequency} value={frequency}>
                              {frequency}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </div>

        <AddressFields toggleName="addressOffPlan" />
        <LinkedLiabilitiesFields
          control={form.control}
          type={type}
          initialPerson={initialPerson}
          initialCompany={initialCompany}
        />
        <AssetOwnershipFields
          control={form.control}
          type={type}
          setValue={form.setValue}
        />
      </form>
    </Form>
  )
}

export const openUpSertAssetModal = ({
  asset,
  type,
  initialPerson,
  initialCompany,
}: {
  asset: Asset | null
  type: 'person' | 'company'
  initialPerson: Person | null
  initialCompany: Company | null
}) => {
  const isEditing = !!asset
  let isSubmitting = false

  const handleFormSubmit = async (
    createdAsset: Asset | null,
    action: 'exit' | 'add-liability'
  ) => {
    if (action == 'add-liability' && createdAsset?.id) {
      openUpSertLiabilityModal({
        liability: null,
        type: type,
        initialCompany: initialCompany,
        initialPerson: initialPerson,
        initialAsset: createdAsset,
      })
    }
  }

  const updateFooter = () => {
    Modal.open({
      title: isEditing ? 'Edit Asset' : 'Add New Asset',
      description: isEditing
        ? 'Update asset information'
        : 'Enter asset details',
      content: (
        <AssetModalContent
          asset={asset}
          type={type}
          initialPerson={initialPerson}
          initialCompany={initialCompany}
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
            form="asset-form"
            disabled={isSubmitting}
            onClick={() => {
              ;(window as any).__assetFormAction = 'exit'
            }}
          >
            {isSubmitting && (window as any).__assetFormAction === 'exit' ? (
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
              form="asset-form"
              disabled={isSubmitting}
              onClick={() => {
                ;(window as any).__assetFormAction = 'add-liability'
              }}
            >
              {isSubmitting &&
              (window as any).__assetFormAction === 'add-liability' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create & Add Liability'
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
