import { z } from 'zod'
import type { BaseEntity } from '@/types'

export interface FirmEmailSetting extends BaseEntity {
  fromEmail: string
  fromName: string
  firmName: string
  logoUrl: string
  headerHtml: string
  footerHtml: string
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPassword: string
  useSsl: boolean
}

export const CreateFirmEmailSettingSchema = z.object({
  fromEmail: z.string().email('Email is not valid'),
  fromName: z.string().min(1, 'Sender name is required'),
  firmName: z.string().min(1, 'Firm name is required'),
  logoUrl: z.string().optional(),
  headerHtml: z.string().optional(),
  footerHtml: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  useSsl: z.boolean(),
  brokerageId: z.string(),
})

export const UpdateFirmEmailSettingSchema = CreateFirmEmailSettingSchema.extend(
  {
    id: z.string(),
  }
)

export const TestSmtpConnectionSchema = z.object({
  smtpHost: z.string().min(1, 'SMTP Host is required'),
  smtpPort: z.number().min(1, 'SMTP Port is required'),
  smtpUser: z.string().min(1, 'SMTP User is required'),
  smtpPassword: z.string().min(1, 'SMTP Password is required'),
  useSsl: z.boolean(),
  toEmail: z.string().email('Recipient email is not valid'),
})

export type CreateFirmEmailSettingInput = z.infer<
  typeof CreateFirmEmailSettingSchema
>
export type UpdateFirmEmailSettingInput = z.infer<
  typeof UpdateFirmEmailSettingSchema
>
export type TestSmtpConnectionInput = z.infer<typeof TestSmtpConnectionSchema>
