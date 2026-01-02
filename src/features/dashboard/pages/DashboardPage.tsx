import { WelcomeHeader } from "../components/WelcomeHeader";
import { StatsSection } from "../components/StatsSection";
import { UpcomingEvents } from "../components/UpcomingEvents";
// import { InterestRateChart } from "../components/InterestRateChart"

export const DashboardPage = () => {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <WelcomeHeader />

      <UpcomingEvents />

      <StatsSection />

      {/* <div className="grid gap-4">
        <InterestRateChart />
      </div>  */}
    </div>
  );
};

export default DashboardPage;
