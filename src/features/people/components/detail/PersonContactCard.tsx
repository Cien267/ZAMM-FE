import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, Briefcase } from 'lucide-react'
import type { Person } from '../../types'

interface PersonContactCardProps {
  person: Person
}

export const PersonContactCard = ({ person }: PersonContactCardProps) => {
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
            <p className="text-sm">{person.email || '-'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Work Phone
            </p>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{person.phoneWork || '-'}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Mobile Phone
            </p>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{person.phoneMobile || '-'}</p>
            </div>
          </div>
        </div>

        {person.phonePreference && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Phone Preference
            </p>
            <Badge variant="outline">{person.phonePreference}</Badge>
          </div>
        )}

        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              Assigned Broker
            </p>
          </div>
          <p className="text-sm mt-1">{person.brokerName || '-'}</p>
        </div>
      </CardContent>
    </Card>
  )
}
