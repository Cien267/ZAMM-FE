import { CompanyInfoCard } from './CompanyInfoCard'
import { CompanyContactCard } from './CompanyContactCard'
import { CompanyAddressCard } from './CompanyAddressCard'
import { CompanyPeopleCard } from './CompanyPeopleCard'
import { EventTimeline } from '@/features/events/components/EventTimeline'
import type { Company } from '../../types'

interface CompanyOverviewTabProps {
  company: Company
}

export const CompanyOverviewTab = ({ company }: CompanyOverviewTabProps) => {
  return (
    <div className="flex justify-between gap-10">
      <div className="space-y-6 w-3/4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CompanyInfoCard company={company} />
          <CompanyContactCard company={company} />
        </div>

        <CompanyAddressCard company={company} />

        <CompanyPeopleCard company={company} />
      </div>
      <EventTimeline
        type="company"
        personId={null}
        companyId={company.id}
        liabilityId={null}
      />
    </div>
  )
}
