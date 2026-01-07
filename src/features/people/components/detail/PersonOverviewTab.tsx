import { PersonInfoCard } from './PersonInfoCard'
import { PersonContactCard } from './PersonContactCard'
import { PersonAddressCard } from './PersonAddressCard'
import { PersonDependentsCard } from './PersonDependentsCard'
import { EventTimeline } from '@/features/events/components/EventTimeline'
import type { Person } from '../../types'

interface PersonOverviewTabProps {
  person: Person
}

export const PersonOverviewTab = ({ person }: PersonOverviewTabProps) => {
  return (
    <div className="flex justify-between gap-10">
      <div className="space-y-6 w-3/4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PersonInfoCard person={person} />
          <PersonContactCard person={person} />
        </div>

        <PersonAddressCard person={person} />

        <PersonDependentsCard person={person} />
      </div>
      <EventTimeline type="person" parentId={person.id} />
    </div>
  )
}
