import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Send, Calendar } from 'lucide-react'
import { useSentEmails } from '../../hooks/useSentEmails'
import type { SentEmail } from '../../types'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

interface SentEmailHeaderProps {
  email: SentEmail
}

export const SentEmailHeader = ({ email }: SentEmailHeaderProps) => {
  const navigate = useNavigate()
  const { resendEmailAsync } = useSentEmails()

  const handleResendEmail = async () => {
    await resendEmailAsync(email.id)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleResendEmail}>
            <Send className="h-4 w-4 mr-2" />
            Resend
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-6 mb-8">
        <div className="flex items-center justify-center text-2xl font-bold">
          {email.subject}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Badge
              className="text-sm px-3 py-1"
              variant={
                email.status === 'Sent'
                  ? 'success'
                  : email.status === 'Failed'
                    ? 'destructive'
                    : 'outline'
              }
            >
              {email.status}
            </Badge>
            <div className="flex items-center gap-1">
              <span className="font-medium">Recipient type:</span>
              <span>{email.recipientType}</span>
            </div>

            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {email.sentAt
                ? formatDate(new Date(email.sentAt))
                : 'Not sent yet'}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
