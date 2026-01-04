import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import type { Person } from '../../types'

interface PersonAddressCardProps {
  person: Person
}

export const PersonAddressCard = ({ person }: PersonAddressCardProps) => {
  const address = person.address

  if (!address) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No address information available
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Address
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Formatted Address Line */}
        {person.addressLine && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">{person.addressLine}</p>
          </div>
        )}

        {/* Detailed Address Fields */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {address.level && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">Level</p>
              <p className="text-sm">{address.level}</p>
            </div>
          )}

          {address.building && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Building
              </p>
              <p className="text-sm">{address.building}</p>
            </div>
          )}

          {address.unitNumber && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Unit Number
              </p>
              <p className="text-sm">{address.unitNumber}</p>
            </div>
          )}

          {address.streetNumber && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Street Number
              </p>
              <p className="text-sm">{address.streetNumber}</p>
            </div>
          )}

          {address.streetName && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Street Name
              </p>
              <p className="text-sm">{address.streetName}</p>
            </div>
          )}

          {address.suburb && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Suburb
              </p>
              <p className="text-sm">{address.suburb}</p>
            </div>
          )}

          {address.state && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">State</p>
              <p className="text-sm">{address.state}</p>
            </div>
          )}

          {address.postcode && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Postcode
              </p>
              <p className="text-sm">{address.postcode}</p>
            </div>
          )}

          {address.country && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Country
              </p>
              <p className="text-sm">{address.country}</p>
            </div>
          )}
        </div>

        {address.offPlan && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Note:</span> This is an off-plan
              property
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
