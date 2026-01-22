import { WelcomeHeader } from '../components/WelcomeHeader'
import { StatsSection } from '../components/StatsSection'
import { LoanBookChart } from '../components/LoanBookChart'
import { UpcomingEvent } from '@/features/events/components/UpcomingEvent'
import { usePageTitle } from '@/hooks/usePageTitle'
// import { InterestRateChart } from '../components/InterestRateChart'

export const DashboardPage = () => {
  usePageTitle('Dashboard')
  return (
    <div className="flex-1 space-y-6">
      <WelcomeHeader />
      <UpcomingEvent />
      <StatsSection />
      <LoanBookChart />
      {/* <InterestRateChart /> */}
    </div>
  )
}

export default DashboardPage
