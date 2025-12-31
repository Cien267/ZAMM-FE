import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useClients } from "../../hooks/useClients"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MapPin, Loader2 } from "lucide-react"
import {
  TITLE_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PHONE_PREFERENCE_OPTIONS,
} from "../../constants"
import {
  CreatePersonSchema,
  UpdatePersonSchema,
  type CreatePersonInput,
} from "../../types"
import { DependentFields } from "./DependentFields"
import type { Person, UpdatePersonInput } from "../../types"
import { Modal } from "@/components/common/modal"
import { DatePicker } from "@/components/common/DatePicker"
import { InputNumber } from "@/components/common/InputNumber"
import type { User } from "@/features/auth/types/auth.types"

interface PeopleFormDialogProps {
  person?: Person | null
  brokers: User[]
  onClose: () => void
  onSubmittingChange?: (isSubmitting: boolean) => void
  onSubmit: (createdPerson: Person | null, action: "exit" | "add-asset") => void
}

export const PersonModalContent = ({
  person,
  brokers,
  onClose,
  onSubmittingChange,
  onSubmit: handleSubmit,
}: PeopleFormDialogProps) => {
  const isEditing = !!person
  const {
    createPersonAsync,
    updatePersonAsync,
    isCreatingPerson,
    isUpdatingPerson,
  } = useClients()

  const form = useForm<CreatePersonInput | UpdatePersonInput>({
    resolver: zodResolver(isEditing ? UpdatePersonSchema : CreatePersonSchema),
    defaultValues: {
      title: person?.title || "Mr",
      firstName: person?.firstName || "",
      middleName: person?.middleName || "",
      lastName: person?.lastName || "",
      preferredName: person?.preferredName || "",
      dateOfBirth: person?.dateOfBirth
        ? new Date(person.dateOfBirth)
        : undefined,
      notifyOfBirthday: person?.notifyOfBirthday || false,
      gender: person?.gender || "Male",
      maritalStatus: person?.maritalStatus || "Single",
      email: person?.email || "",
      phoneWork: person?.phoneWork || "",
      phoneMobile: person?.phoneMobile || "",
      phonePreference: person?.phonePreference || "Mobile",
      actingOnTrust: person?.actingOnTrust || false,
      trustName: person?.trustName || "",
      spouseId: person?.spouseId || null,
      brokerId: person?.brokerId || brokers[0]?.id,
      address: "",
      dependents: person?.dependents || [],
      ...(isEditing && person ? { id: person.id } : {}),
    },
  })

  const onSubmit = async (data: CreatePersonInput) => {
    try {
      let createdPerson = null
      if (isEditing && person) {
        await updatePersonAsync({ ...data, id: person.id })
      } else {
        createdPerson = await createPersonAsync(data)
      }
      const action = (window as any).__personFormAction || "exit"
      onClose()
      form.reset()
      handleSubmit(createdPerson, action)
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const isSubmitting = isCreatingPerson || isUpdatingPerson

  useEffect(() => {
    onSubmittingChange?.(isSubmitting)
  }, [isSubmitting])

  return (
    <Form {...form} key={person?.id || "new-person"}>
      <form
        id="person-form"
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log("Validation Errors:", errors)
        )}
        className="space-y-6"
      >
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Title</FormLabel>
                  <RadioGroup
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    defaultValue="Mr"
                    className="flex justify-start items-center gap-2"
                  >
                    {TITLE_OPTIONS.map((title) => (
                      <RadioGroupItem key={title} value={title} id={title}>
                        <Label htmlFor={title} className="cursor-pointer">
                          {title}
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
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-destructive">*</span>
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
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-destructive">*</span>
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
              name="preferredName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
              name="notifyOfBirthday"
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
                      Notify of birthday
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <RadioGroup
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    defaultValue="Male"
                    className="flex justify-start items-center gap-2"
                  >
                    {GENDER_OPTIONS.map((gender) => (
                      <RadioGroupItem key={gender} value={gender} id={gender}>
                        <Label htmlFor={gender} className="cursor-pointer">
                          {gender}
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
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                  <RadioGroup
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    defaultValue="Single"
                    className="flex justify-start items-center gap-2"
                  >
                    {MARITAL_STATUS_OPTIONS.map((status) => (
                      <RadioGroupItem key={status} value={status} id={status}>
                        <Label htmlFor={status} className="cursor-pointer">
                          {status}
                        </Label>
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
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
              name="phonePreference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Preference</FormLabel>
                  <RadioGroup
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    defaultValue="Mobile"
                    className="flex justify-start items-center gap-2"
                  >
                    {PHONE_PREFERENCE_OPTIONS.map((prefer) => (
                      <RadioGroupItem key={prefer} value={prefer} id={prefer}>
                        <Label htmlFor={prefer} className="cursor-pointer">
                          {prefer}
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="example@example.com"
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
                  <FormLabel>Work Phone</FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="Enter phone"
                      {...field}
                      allowDecimal={true}
                      maxDecimals={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneMobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Phone</FormLabel>
                  <FormControl>
                    <InputNumber
                      placeholder="Enter phone"
                      {...field}
                      allowDecimal={true}
                      maxDecimals={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Address</FormLabel>
                  <FormItem className="relative">
                    <Input {...field} />
                    <MapPin className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                  </FormItem>
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
                    onValueChange={(value) => {
                      field.onChange(value)
                    }}
                    value={field.value || ""}
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

        <DependentFields control={form.control} />
      </form>
    </Form>
  )
}

export const openUpSertPersonModal = ({
  person,
  users,
}: {
  person: Person | null
  users: User[]
}) => {
  const isEditing = !!person
  let isSubmitting = false

  const handleFormSubmit = async (
    createdPerson: Person | null,
    action: "exit" | "add-asset"
  ) => {
    console.log({ action, createdPerson })
    if (action == "add-asset" && createdPerson?.id) {
      // openUpSertAssetModal({ person: createdPerson, users })
    }
  }

  const updateFooter = () => {
    Modal.open({
      title: isEditing ? "Edit Person" : "Add New Person",
      description: isEditing
        ? "Update person information"
        : "Enter person details",
      content: (
        <PersonModalContent
          person={person}
          brokers={users}
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
            form="person-form"
            disabled={isSubmitting}
            onClick={() => {
              ;(window as any).__personFormAction = "exit"
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : isEditing ? (
              "Update"
            ) : (
              "Create & Exit"
            )}
          </Button>

          {!isEditing && (
            <Button
              type="submit"
              form="person-form"
              disabled={isSubmitting}
              onClick={() => {
                ;(window as any).__personFormAction = "add-asset"
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create & Add Asset"
              )}
            </Button>
          )}
        </div>
      ),
      className: "max-w-4xl!",
    })
  }

  updateFooter()
}
