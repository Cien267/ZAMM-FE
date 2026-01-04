import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Users, Shield } from 'lucide-react'
import type { Person } from '../../types'
import { formatDate } from '@/lib/utils'
import {
  GENDER_VARIANT_MAPPING,
  MARITAL_STATUS_VARIANT_MAPPING,
} from '../../constants'

interface PersonInfoCardProps {
  person: Person
}

export const PersonInfoCard = ({ person }: PersonInfoCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Title</p>
            <p className="text-sm">{person.title || '-'}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Preferred Name
            </p>
            <p className="text-sm">{person.preferredName || '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Date of Birth
            </p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{formatDate(person.dateOfBirth)}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Birthday Notifications
            </p>
            <Badge variant={person.notifyOfBirthday ? 'default' : 'secondary'}>
              {person.notifyOfBirthday ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Gender</p>
            <p className="text-sm">
              {person.gender ? (
                <Badge
                  variant={GENDER_VARIANT_MAPPING[person.gender] || 'default'}
                  className="font-normal"
                >
                  {person.gender}
                </Badge>
              ) : (
                '-'
              )}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Marital Status
            </p>
            <p className="text-sm">
              {person.maritalStatus ? (
                <Badge
                  variant={
                    MARITAL_STATUS_VARIANT_MAPPING[person.maritalStatus] ||
                    'default'
                  }
                  className="font-normal"
                >
                  {person.maritalStatus}
                </Badge>
              ) : (
                '-'
              )}
            </p>
          </div>
        </div>

        {person.spouseName && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Spouse</p>
            <p className="text-sm">{person.spouseName}</p>
          </div>
        )}

        {person.actingOnTrust && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Trust Information</p>
            </div>
            <p className="text-sm text-muted-foreground">
              {person.trustName || 'Acting on Trust'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
