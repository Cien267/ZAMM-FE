import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFirmEmailSettings } from '../hooks/useFirmEmailSettings'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import {
  CreateFirmEmailSettingSchema,
  UpdateFirmEmailSettingSchema,
  TestSmtpConnectionSchema,
  type CreateFirmEmailSettingInput,
  type FirmEmailSetting,
} from '../types'
import { InputNumber } from '@/components/common/InputNumber'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Switch } from '@/components/ui/switch'
import Editor from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { Plug, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface FirmEmailSettingFormDialogProps {
  firmEmailSetting?: FirmEmailSetting | null
  onSubmit: (createdFirmEmailSetting: FirmEmailSetting | null) => void
  onCancel: () => void
}

export const UpsertFirmEmailSetting = ({
  firmEmailSetting,
  onSubmit: handleSubmit,
  onCancel,
}: FirmEmailSettingFormDialogProps) => {
  const isEditing = !!firmEmailSetting
  const { user } = useAuth()
  const {
    createFirmEmailSettingAsync,
    updateFirmEmailSettingAsync,
    testSmtpConnectionAsync,
    isTestingSmtpConnection,
    isCreatingFirmEmailSetting,
    isUpdatingFirmEmailSetting,
  } = useFirmEmailSettings()
  const [toEmail, setToEmail] = useState('')
  const [toEmailError, setToEmailError] = useState<string | null>(null)
  const form = useForm<CreateFirmEmailSettingInput>({
    resolver: zodResolver(
      isEditing ? UpdateFirmEmailSettingSchema : CreateFirmEmailSettingSchema
    ),
    defaultValues: {
      fromEmail: firmEmailSetting?.fromEmail || '',
      fromName: firmEmailSetting?.fromName || '',
      firmName: firmEmailSetting?.firmName || user?.brokerage?.name || '',
      logoUrl: firmEmailSetting?.logoUrl || '',
      headerHtml: firmEmailSetting?.headerHtml || '',
      footerHtml: firmEmailSetting?.footerHtml || '',
      smtpHost: firmEmailSetting?.smtpHost || '',
      smtpPort: firmEmailSetting?.smtpPort || 587,
      smtpUser: firmEmailSetting?.smtpUser || '',
      smtpPassword: firmEmailSetting?.smtpPassword || '',
      useSsl: firmEmailSetting?.useSsl ?? true,
      brokerageId: user?.brokerageId || '',
      ...(isEditing && firmEmailSetting ? { id: firmEmailSetting.id } : {}),
    },
  })

  const onSubmit = async (data: CreateFirmEmailSettingInput) => {
    try {
      let createdFirmEmailSetting = null
      if (isEditing && firmEmailSetting) {
        await updateFirmEmailSettingAsync({ ...data, id: firmEmailSetting.id })
      } else {
        createdFirmEmailSetting = await createFirmEmailSettingAsync(data)
      }
      form.reset()
      handleSubmit(createdFirmEmailSetting)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const watchedValues = useWatch({
    control: form.control,
    name: [
      'smtpHost',
      'smtpPort',
      'smtpUser',
      'smtpPassword',
      'useSsl',
      'headerHtml',
      'footerHtml',
    ],
  })
  const [
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPassword,
    useSsl,
    headerHtml,
    footerHtml,
  ] = watchedValues

  const generateLivePreview = (header: string = '', footer: string = '') => {
    const baseStyle = `
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
      .sample-content { border: 2px dashed #e2e8f0; padding: 20px; border-radius: 8px; background-color: #f8fafc; margin: 20px 0; }
      img { max-width: 100%; height: auto; }
    </style>
  `

    return `
    <!DOCTYPE html>
    <html>
      <head>${baseStyle}</head>
      <body>
        <div id="header-preview">${header || '<p style="color: #94a3b8; text-align: center;">[Your Header]</p>'}</div>
        
        <div class="sample-content">
          <p>This is sample content to demonstrate how the Header and Footer appear in a real email.</p>
          <p>The system will automatically insert the chosen template content between these two sections when the email is sent.</p>
        </div>

        <div id="footer-preview">${footer || '<p style="color: #94a3b8; text-align: center;">[Your Footer]</p>'}</div>
      </body>
    </html>
  `
  }

  const handleTestConnection = async () => {
    try {
      const data = {
        smtpHost: smtpHost ?? '',
        smtpPort: smtpPort ?? 587,
        smtpUser: smtpUser ?? '',
        smtpPassword: smtpPassword ?? '',
        useSsl: useSsl ?? true,
        toEmail: toEmail ?? '',
      }
      const result = TestSmtpConnectionSchema.safeParse(data)
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        Object.entries(errors).forEach(([field, messages]) => {
          if (messages?.[0]) {
            if (field === 'toEmail') {
              setToEmailError(messages[0])
            } else {
              form.setError(field as any, {
                type: 'manual',
                message: messages[0],
              })
            }
          }
        })

        return
      } else {
        await testSmtpConnectionAsync(data)
      }
    } catch (e: any) {
      console.error('Error while testing connection: ', e)
    }
  }

  const isSubmitting = isCreatingFirmEmailSetting || isUpdatingFirmEmailSetting

  return (
    <Form {...form}>
      <form
        id="firmEmailSetting-form"
        onSubmit={form.handleSubmit(onSubmit, (errors) =>
          console.log('Validation Errors:', errors)
        )}
        className="space-y-6"
      >
        <div className="flex justify-end gap-3">
          <Button
            form="firmEmailSetting-form"
            variant={'sky'}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save'
            )}
          </Button>
          <Button onClick={onCancel} variant={'outline'} className="gap-2">
            Cancel
          </Button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fromEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    From Email <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fromName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    From Name <span className="text-destructive">*</span>
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
              name="firmName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Firm Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter firm name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter url" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">HTML Configuration</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="headerHtml"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Header Email</FormLabel>
                    <FormControl>
                      <div className="border rounded-md overflow-hidden">
                        <Editor
                          height="400px"
                          defaultLanguage="html"
                          value={field.value}
                          onChange={field.onChange}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 12,
                            padding: {
                              top: 16,
                              bottom: 16,
                            },
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="footerHtml"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Footer Email</FormLabel>
                    <FormControl>
                      <div className="border rounded-md overflow-hidden">
                        <Editor
                          height="400px"
                          defaultLanguage="html"
                          value={field.value}
                          onChange={field.onChange}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 12,
                            padding: {
                              top: 16,
                              bottom: 16,
                            },
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col h-full space-y-2">
              <FormLabel>Live Preview</FormLabel>
              <div className="flex-1 border rounded-lg bg-white shadow-inner overflow-hidden flex flex-col">
                <div className="bg-slate-100 p-2 border-b flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <iframe
                  title="Email Preview"
                  className="w-full h-full"
                  srcDoc={generateLivePreview(headerHtml, footerHtml)}
                  sandbox="allow-popups"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">SMTP Configuration</h3>
            <Button
              variant="outline"
              type="button"
              onClick={handleTestConnection}
            >
              {isTestingSmtpConnection ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Plug />
                  Test Connection
                </>
              )}
            </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="smtpHost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SMTP Host</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter SMTP Host" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="smtpPort"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SMTP Port</FormLabel>
                  <FormControl>
                    <InputNumber
                      allowDecimal={false}
                      allowNegative={false}
                      {...field}
                      placeholder="Enter SMTP Port"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="smtpUser"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SMTP User</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter SMTP User" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="smtpPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SMTP Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter SMTP Password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="useSsl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Use SSL{' '}
                  <span className="text-sm font-normal text-accent-foreground">
                    (Recommended)
                  </span>
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem className="w-1/2">
            <FormLabel>
              To Email{' '}
              <span className="text-sm font-normal text-accent-foreground">
                (Only for Test Connection)
              </span>
            </FormLabel>
            <FormControl>
              <Input
                type="email"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="Enter To Email"
              />
            </FormControl>
            {toEmailError && (
              <p className="text-sm font-normal text-destructive">
                {toEmailError}
              </p>
            )}
          </FormItem>
        </div>
      </form>
    </Form>
  )
}
