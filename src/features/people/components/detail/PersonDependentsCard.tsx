import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, GraduationCap } from 'lucide-react'
import type { Person } from '../../types'

interface PersonDependentsCardProps {
  person: Person
}

export const PersonDependentsCard = ({ person }: PersonDependentsCardProps) => {
  const dependents = person.dependents || []

  if (dependents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Dependents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No dependents registered
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
          Dependents ({dependents.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dependents.map((dependent) => (
            <div
              key={dependent.id}
              className="p-4 border rounded-lg hover:shadow-md transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold">{dependent.fullName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {dependent.age} years old
                  </p>
                </div>
                {dependent.isStudent && (
                  <Badge variant="secondary" className="gap-1">
                    <GraduationCap className="h-3 w-3" />
                    Student
                  </Badge>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Year of Birth</span>
                  <span className="font-medium">{dependent.yearOfBirth}</span>
                </div>

                {dependent.gender && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gender</span>
                    <span className="font-medium">{dependent.gender}</span>
                  </div>
                )}

                {dependent.relationship && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Relationship</span>
                    <Badge variant="outline" className="font-normal">
                      {dependent.relationship}
                    </Badge>
                  </div>
                )}

                {dependent.notes && (
                  <div className="pt-4 border-t mt-4 flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      {dependent.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
