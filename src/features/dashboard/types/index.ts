export interface ClientEvent {
  id: string
  clientName: string
  details: string
  date: string
  broker: string
  isDismissed: boolean
  type: "birthday" | "loan_review" | "meeting" | "other"
}

export interface LoanStats {
  totalValue: number
  loanCount: number
  clientCount: number
  lastUpdated: string
}

export interface InterestRateData {
  bankName: string
  rate: number
}

export interface DashboardData {
  user: {
    name: string
  }
  events: ClientEvent[]
  stats: LoanStats
  interestRates: InterestRateData[]
}
