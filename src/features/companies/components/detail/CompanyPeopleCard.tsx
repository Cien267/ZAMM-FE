import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Mail, Phone } from 'lucide-react'
import type { Company } from '../../types'
import { useAllPeopleByCompanyId } from '@/hooks/useSharedData'

interface CompanyPeopleCardProps {
  company: Company
}

export const CompanyPeopleCard = ({ company }: CompanyPeopleCardProps) => {
  const companyPeople = company.companyPeople || []

  const { data: people } = useAllPeopleByCompanyId(company.id)

  if (companyPeople.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Associated People
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No people associated with this company
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Associated People ({companyPeople.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(people || []).map((person) => {
            if (!person) return null

            return (
              <div
                key={person.id}
                className="p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{person.fullName}</h4>
                    {person.title && (
                      <p className="text-sm text-muted-foreground">
                        {person.title}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {person.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">
                        {person.email}
                      </span>
                    </div>
                  )}

                  {person.phoneMobile && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {person.phoneMobile}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
