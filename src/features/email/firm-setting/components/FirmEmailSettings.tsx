import type { FirmEmailSetting } from '../types'
import { Mail, ShieldCheck, Server, ImageIcon, Layout } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const FirmEmailSettings = ({
  firmEmailSetting,
}: {
  firmEmailSetting: FirmEmailSetting
}) => {
  return (
    <div className="max-w-full space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-500" />
              Sender Identity
            </CardTitle>
            <CardDescription>Public info seen by recipients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-start gap-16">
              {firmEmailSetting.logoUrl ? (
                <img
                  src={firmEmailSetting.logoUrl}
                  alt="Firm Logo"
                  className="w-34 object-contain rounded-full"
                />
              ) : (
                <div className="flex flex-col items-center text-muted-foreground">
                  <ImageIcon className="h-8 w-8 mb-1 opacity-20" />
                  <span className="text-[10px] uppercase font-bold">
                    No Logo Uploaded
                  </span>
                </div>
              )}
              <div className="space-y-4 w-1/2">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Firm Name
                  </p>
                  <p className="font-medium text-sm">
                    {firmEmailSetting.firmName}
                  </p>
                </div>
                <div className="space-y-1 mt-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Display Name
                  </p>
                  <p className="font-medium text-sm">
                    {firmEmailSetting.fromName}
                  </p>
                </div>
                <div className="space-y-1 ">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Sender Email
                  </p>
                  <p className="font-medium text-sm text-blue-600">
                    {firmEmailSetting.fromEmail}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="h-5 w-5 text-orange-500" />
              SMTP Configuration
            </CardTitle>
            <CardDescription>Technical connection details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Host
                </p>
                <p className="font-medium text-sm">
                  {firmEmailSetting.smtpHost || '---'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Port
                </p>
                <p className="font-medium text-sm">
                  {firmEmailSetting.smtpPort}
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  User
                </p>
                <p className="font-medium text-sm">
                  {firmEmailSetting.smtpUser || '---'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase">
                  Security
                </p>
                <div className="flex items-center gap-1">
                  {firmEmailSetting.useSsl ? (
                    <ShieldCheck className="h-3 w-3 text-green-500" />
                  ) : null}
                  <span className="font-medium text-sm">
                    {firmEmailSetting.useSsl ? 'SSL/TLS' : 'None'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layout className="h-5 w-5" /> Email Branded Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="space-y-4">
                <div className="font-semibold">Header</div>
                <iframe
                  title="Footer Preview"
                  className="w-full h-full"
                  srcDoc={firmEmailSetting.headerHtml || ''}
                  sandbox="allow-popups"
                />
              </div>
              <div className="space-y-4">
                <div className="font-semibold">Footer</div>
                <iframe
                  title="Footer Preview"
                  className="w-full h-full"
                  srcDoc={firmEmailSetting.footerHtml || ''}
                  sandbox="allow-popups"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
