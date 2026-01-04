import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, Globe, Briefcase, User } from 'lucide-react'
import type { Company } from '../../types'

interface CompanyContactCardProps {
  company: Company
}

export const CompanyContactCard = ({ company }: CompanyContactCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Email Address
          </p>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">{company.email || '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Phone</p>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{company.phoneWork || '-'}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Website</p>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              {company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {company.website}
                </a>
              ) : (
                <p className="text-sm">-</p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Contact Person</p>
          </div>

          {company.isContactExistingPerson && company.contactPerson ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                {company.contactPerson.fullName}
              </p>
              {company.contactPerson.email && (
                <p className="text-sm text-muted-foreground">
                  {company.contactPerson.email}
                </p>
              )}
              {company.contactPerson.phoneMobile && (
                <p className="text-sm text-muted-foreground">
                  {company.contactPerson.phoneMobile}
                </p>
              )}
            </div>
          ) : company.externalContactName ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold">
                {company.externalContactName}
              </p>
              {company.externalContactEmail && (
                <p className="text-sm text-muted-foreground">
                  {company.externalContactEmail}
                </p>
              )}
              {company.externalContactPhone && (
                <p className="text-sm text-muted-foreground">
                  {company.externalContactPhone}
                </p>
              )}
              <Badge variant="outline" className="mt-2">
                External Contact
              </Badge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No contact person assigned
            </p>
          )}
        </div>

        {company.referrer && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Referred By
            </p>
            <p className="text-sm font-semibold">{company.referrer.fullName}</p>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              Assigned Broker
            </p>
          </div>
          <p className="text-sm mt-1">{company.brokerName || '-'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
