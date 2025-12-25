import { useQuery } from "@tanstack/react-query"
import { dashboardService } from "../services/dashboardService"

export const keys = {
  all: ["dashboard"] as const,
  events: () => [...keys.all, "events"] as const,
  stats: () => [...keys.all, "stats"] as const,
  interestRates: () => [...keys.all, "interestRates"] as const,
  data: () => [...keys.all, "data"] as const,
}

export const useDashboardData = () => {
  const upcomingEventQuery = useQuery({
    queryKey: keys.events(),
    queryFn: () => dashboardService.getUpcomingEvents(),
    enabled: true,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  const loanBookQuery = useQuery({
    queryKey: keys.stats(),
    queryFn: () => dashboardService.getLoanBook(),
    enabled: true,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  const interestRatesQuery = useQuery({
    queryKey: keys.interestRates(),
    queryFn: () => dashboardService.getInterestRates(),
    enabled: true,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  return {
    upcomingEventQuery,
    loanBookQuery,
    interestRatesQuery,
  }
}
