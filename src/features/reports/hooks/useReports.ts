import { useQuery } from '@tanstack/react-query'
import { reportService } from '../services/reportService'
import { reportKeys } from '../constants'
import type {
  PeopleReportQuery,
  CompanyReportQuery,
  AssetReportQuery,
  LiabilityReportQuery,
} from '../types'

export const useReports = () => {
  const useReportSummary = () => {
    return useQuery({
      queryKey: reportKeys.reportSummary(),
      queryFn: () => reportService.getReportSummary(),
    })
  }

  const usePeopleReport = (query: PeopleReportQuery) => {
    return useQuery({
      queryKey: reportKeys.peopleReport(query),
      queryFn: () => reportService.getPeopleReport(query),
    })
  }
  const useCompanyReport = (query: CompanyReportQuery) => {
    return useQuery({
      queryKey: reportKeys.companiesReport(query),
      queryFn: () => reportService.getCompanyReport(query),
    })
  }
  const useAssetReport = (query: AssetReportQuery) => {
    return useQuery({
      queryKey: reportKeys.assetsReport(query),
      queryFn: () => reportService.getAssetReport(query),
    })
  }
  const useLiabilityReport = (query: LiabilityReportQuery) => {
    return useQuery({
      queryKey: reportKeys.liabilitiesReport(query),
      queryFn: () => reportService.getLiabilityReport(query),
    })
  }

  return {
    useReportSummary,
    usePeopleReport,
    useCompanyReport,
    useAssetReport,
    useLiabilityReport,
  }
}
