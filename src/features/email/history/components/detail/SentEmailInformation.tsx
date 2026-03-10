import type { SentEmail } from '../../types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { User, Mail, Building2, AlertCircle, FileCode } from 'lucide-react'

interface SentEmailInformationProps {
  email: SentEmail
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-slate-400">{icon}</div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-sm font-semibold break-all">{value}</p>
      </div>
    </div>
  )
}

export const SentEmailInformation = ({ email }: SentEmailInformationProps) => {
  return (
    <>
      {email.status === 'Failed' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Delivery Failure</AlertTitle>
          <AlertDescription>
            {email.failureReason ||
              'An unknown error occurred during the SMTP handshake.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Metadata */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transmission Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow
                label="From"
                value={`${email.fromName} <${email.fromEmail}>`}
                icon={<Mail />}
              />
              <InfoRow
                label="To"
                value={email.recipientEmail}
                icon={<User />}
              />
              <InfoRow
                label="Firm"
                value={email.firmName}
                icon={<Building2 />}
              />
              <Separator />
              <InfoRow
                label="Template"
                value={email.templateName || 'No Template'}
                icon={<FileCode />}
              />
              <InfoRow
                label="Broker"
                value={email.brokerName || 'System'}
                icon={<User />}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Subject Line
                </label>
                <p className="text-sm font-medium border p-3 rounded-md bg-slate-50">
                  {email.subject}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-8 flex-1 border rounded-lg bg-white shadow-inner overflow-hidden flex flex-col">
          <div className="bg-slate-100 p-2 border-b flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <iframe
            title="Email Preview"
            className="w-full h-200 max-h-200"
            srcDoc={email.bodyHtml}
            sandbox="allow-popups"
          />
        </div>
      </div>
    </>
  )
}
