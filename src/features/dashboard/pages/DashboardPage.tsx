import { WelcomeHeader } from '../components/WelcomeHeader'
import { StatsSection } from '../components/StatsSection'
import { LoanBookChart } from '../components/LoanBookChart'
import { UpcomingEventTable } from '@/features/events/components/UpcomingEventTable'
import { usePageTitle } from '@/hooks/usePageTitle'
// import { InterestRateChart } from "../components/InterestRateChart"

export const DashboardPage = () => {
  usePageTitle('Dashboard')
  return (
    <div className="flex-1 space-y-6">
      <WelcomeHeader />
      <UpcomingEventTable />
      <StatsSection />
      <LoanBookChart />
    </div>
  )
}

export default DashboardPage
