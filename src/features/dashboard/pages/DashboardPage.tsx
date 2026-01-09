import { WelcomeHeader } from '../components/WelcomeHeader'
import { StatsSection } from '../components/StatsSection'
import { UpcomingEvents } from '../components/UpcomingEvents'
import { usePageTitle } from '@/hooks/usePageTitle'
// import { InterestRateChart } from "../components/InterestRateChart"

export const DashboardPage = () => {
  usePageTitle('Dashboard')
  return (
    <div className="flex-1 space-y-6">
      <WelcomeHeader />

      <UpcomingEvents />

      <StatsSection />

      {/* <div className="grid gap-4">
        <InterestRateChart />
      </div>  */}
    </div>
  )
}

export default DashboardPage
