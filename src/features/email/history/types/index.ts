import type { BaseEntity, PaginationParams } from '@/types'

export type RecipientType = 'Person' | 'Company'
export type SentEmailStatusType = 'Pending' | 'Sent' | 'Failed'
export type SentEmailStatusBadgeVariantType =
  | 'warning'
  | 'success'
  | 'destructive'

export interface SentEmail extends BaseEntity {
  brokerId?: string
  brokerName?: string
  templateId?: string
  templateName?: string
  previewItemId?: string
  recipientType: RecipientType
  recipientId: string
  recipientEmail: string
  subject: string
  headerHtml: string
  bodyHtml: string
  footerHtml: string
  fromEmail: string
  fromName: string
  firmName: string
  logoUrl: string
  status: SentEmailStatusType
  failureReason: string
  sentAt: Date
}

export interface SentEmailQuery extends PaginationParams {
  recipientEmail?: string
  subject?: string
  status?: SentEmailStatusType
  fromSentAt?: Date
  toSentAt?: Date
  brokerId?: string
  templateId?: string
}

export interface FirmEmailStatsQuery {
  fromSentAt?: Date
  toSentAt?: Date
  brokerId?: string
}
