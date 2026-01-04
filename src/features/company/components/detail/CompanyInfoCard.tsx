import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, Calendar, Shield, FileText } from 'lucide-react'
import type { Company } from '../../types'
import { format } from 'date-fns'

interface CompanyInfoCardProps {
  company: Company
}

export const CompanyInfoCard = ({ company }: CompanyInfoCardProps) => {
  const formatDate = (date?: Date) => {
    if (!date) return '-'
    return format(new Date(date), 'PPP')
  }

  const formatABN = (abn?: string) => {
    if (!abn) return '-'
    return abn.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
  }

  const formatACN = (acn?: string) => {
    if (!acn) return '-'
    return acn.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Legal Name
            </p>
            <p className="text-sm font-semibold">{company.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Trading Name
            </p>
            <p className="text-sm">{company.tradingName || '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Company Type
            </p>
            {company.type ? (
              <Badge variant="outline">{company.type}</Badge>
            ) : (
              <p className="text-sm">-</p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Industry
            </p>
            {company.industry ? (
              <Badge variant="secondary">{company.industry}</Badge>
            ) : (
              <p className="text-sm">-</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">ABN</p>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{formatABN(company.abn)}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">ACN</p>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{formatACN(company.acn)}</p>
            </div>
          </div>
        </div>

        {company.registrationDate && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Registration Date
            </p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{formatDate(company.registrationDate)}</p>
            </div>
          </div>
        )}

        {company.actingOnTrust && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Trust Information</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {company.trustName || 'Acting on Trust'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
