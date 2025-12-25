import { useState } from "react"
import { Lock, CalendarIcon } from "lucide-react"
import { useForm, type Noop, type RefCallBack } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { Modal } from "@/components/common/modal"
import { cn } from "@/lib/utils"
import {
  UpdateProfileSchema,
  type UpdateProfileRequest,
  ChangePasswordSchema,
  type ChangePasswordRequest,
} from "@/features/auth/types/auth.types"
import { toast } from "sonner"

const ProfileModalContent = ({ onClose }: { onClose: () => void }) => {
  const { user, updateProfileAsync, changePasswordAsync } = useAuth()
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const profileForm = useForm<UpdateProfileRequest>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      fullName: user?.fullName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      dateOfBirth: user?.dateOfBirth ? new Date(user?.dateOfBirth) : undefined,
    },
  })

  const [month, setMonth] = useState<Date>(
    profileForm.getValues("dateOfBirth")
      ? new Date(profileForm.getValues("dateOfBirth") as Date)
      : new Date()
  )

  const passwordForm = useForm<ChangePasswordRequest>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const handleDateChange = (
    field: {
      onChange: any
      onBlur?: Noop
      value?: Date | undefined
      disabled?: boolean | undefined
      name?: "dateOfBirth"
      ref?: RefCallBack
    },
    date: Date | undefined
  ) => {
    if (!date) {
      field.onChange(undefined)
      return
    }
    setMonth(date)
    const normalizedDate = new Date(date)
    normalizedDate.setHours(12, 0, 0, 0)
    field.onChange(normalizedDate)

    setIsCalendarOpen(false)
  }

  const onSubmit = async (data: UpdateProfileRequest) => {
    try {
      await updateProfileAsync(data)
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile")
    }
  }

  const onPasswordSubmit = async (data: ChangePasswordRequest) => {
    try {
      await changePasswordAsync(data)
      passwordForm.reset()
      onClose()
    } catch (error: any) {
      passwordForm.reset()
      toast.error(error.message || "Failed to change password")
    }
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-transparent h-12 w-full justify-start gap-6 p-0 pb-1 border-b rounded-none">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <div className="pt-6">
          <TabsContent value="general" className="mt-0 space-y-6">
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-4"
              >
                <FormField
                  control={profileForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date Of Birth</FormLabel>
                      <Popover
                        open={isCalendarOpen}
                        onOpenChange={setIsCalendarOpen}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value &&
                              field.value instanceof Date &&
                              !isNaN(field.value.getTime()) ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={
                              field.value instanceof Date
                                ? field.value
                                : field.value
                                ? new Date(field.value)
                                : undefined
                            }
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={(date) => handleDateChange(field, date)}
                            disabled={(date) => date > new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter phoneNumber number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value
                            field.onChange(val === "" ? null : val)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-2 flex justify-end gap-3 pt-4">
                  <Button type="button" variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="security" className="mt-0 space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Change Password</h3>
              <p className="text-sm text-muted-foreground">
                Ensure your account is using a long, random password to stay
                secure.
              </p>
            </div>

            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
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
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
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

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => passwordForm.reset()}
                  >
                    Reset Form
                  </Button>
                  <Button type="submit">
                    <Lock className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export const openEditProfileModal = () => {
  Modal.open({
    title: "Account Settings",
    description: "Manage your public profile and security preferences.",
    content: <ProfileModalContent onClose={() => Modal.close()} />,
    className: "max-w-2xl!",
  })
}

export const EditProfile = () => {
  return (
    <span className="w-full" onClick={openEditProfileModal}>
      Profile
    </span>
  )
}
