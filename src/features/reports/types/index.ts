import type { Asset } from '@/features/assets/types'
import type { Liability } from '@/features/liabilities/types'
import type { PaginationParams } from '@/types'

export interface IReportFilters {
  dateFrom?: string
  dateTo?: string
  brokerId?: string
  searchQuery?: string
}

export interface IReportSummary {
  totalPeople: number
  totalCompanies: number
  totalAssets: number
  totalLiabilities: number
  totalAssetValue: number
  totalLiabilityAmount: number
  netWorth: number
  topAssets: Asset[]
  topLiabilities: Liability[]
}

export interface ReportQuery extends PaginationParams {
  dateFrom?: string
  dateTo?: string
}

export interface PeopleReportQuery extends ReportQuery {
  name?: string
  email?: string
}

export interface CompanyReportQuery extends ReportQuery {
  name?: string
  industry?: string
}

export interface AssetReportQuery extends ReportQuery {
  personId?: string
  companyId?: string
  propertyType?: string
  isInvestment?: boolean
}

export interface LiabilityReportQuery extends ReportQuery {
  personId?: string
  companyId?: string
  financePurpose?: string
}
