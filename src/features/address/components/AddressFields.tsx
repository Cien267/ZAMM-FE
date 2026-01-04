import React, { useState } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { MapPin } from 'lucide-react'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { InputNumber } from '@/components/common/InputNumber'

interface AddressFieldsProps {
  toggleName?: string
}

export function AddressFields({ toggleName }: AddressFieldsProps) {
  const { control, setValue } = useFormContext()

  const [internalIsOffPlan, setInternalIsOffPlan] = useState(false)

  const formIsOffPlan = useWatch({
    control,
    name: toggleName || '_unused_',
    disabled: !toggleName,
  })

  const isOffPlan = toggleName ? !!formIsOffPlan : internalIsOffPlan

  const handleToggle = (checked: boolean) => {
    if (toggleName) {
      setValue(toggleName, checked, { shouldValidate: true })
    } else {
      setInternalIsOffPlan(checked)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Address Information</h3>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="off-plan-toggle"
            checked={isOffPlan}
            onCheckedChange={handleToggle}
          />
          <label
            htmlFor="off-plan-toggle"
            className="text-sm font-medium cursor-pointer"
          >
            Off-plan address
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!isOffPlan ? (
          <AddressInputField
            name="addressText"
            label="Address"
            isSearch
            className="col-span-full"
          />
        ) : (
          <>
            <div className="flex justify-between gap-1">
              <AddressInputField
                name="address.level"
                label="Level"
                className="w-1/2"
              />
              <AddressInputField
                name="address.building"
                label="Building"
                className="w-1/2"
              />
            </div>
            <div className="flex justify-between gap-1">
              <AddressInputField
                name="address.unitNumber"
                label="Unit Number"
                className="w-1/2"
              />
              <AddressInputField
                name="address.streetNumber"
                label="Street Number"
                className="w-1/2"
              />
            </div>
            <AddressInputField name="address.streetName" label="Street Name" />
            <AddressInputField name="address.suburb" label="Suburb" />
            <AddressInputField name="address.state" label="State" />
            <AddressInputField name="address.country" label="Country" />
            <FormField
              control={control}
              name="address.postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postcode</FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="Enter postcode"
                      {...field}
                      allowDecimal={false}
                      allowNegative={false}
                      returnString={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </div>
    </div>
  )
}

function AddressInputField({
  name,
  label,
  className,
  isSearch,
}: {
  name: string
  label: string
  className?: string
  isSearch?: boolean
}) {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <div className="relative">
            <FormControl>
              <Input {...field} value={field.value || ''} />
            </FormControl>
            {isSearch && (
              <MapPin className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
