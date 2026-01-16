import { useExport } from '@/hooks/useExport'
import type { ExportSettings } from '@/types'
import {
  PEOPLE_COLUMNS,
  COMPANY_COLUMNS,
  ASSET_COLUMNS,
  LIABILITY_COLUMNS,
} from '@/constants/export'
import { useReports } from '../hooks/useReports'

export const useReportExport = () => {
  const { handleExport: sharedExport, isExporting } = useExport()

  const query = {
    pageNumber: 1,
    pageSize: 1000,
    sortBy: 'CreatedAt',
    sortDescending: true,
  }

  const {
    usePeopleReport,
    useCompanyReport,
    useAssetReport,
    useLiabilityReport,
  } = useReports()

  const { data: peopleData } = usePeopleReport(query)
  const people = peopleData?.data || []
  const { data: companiesData } = useCompanyReport(query)
  const companies = companiesData?.data || []
  const { data: assetsData } = useAssetReport(query)
  const assets = assetsData?.data || []
  const { data: liabilitiesData } = useLiabilityReport(query)
  const liabilities = liabilitiesData?.data || []

  const getNestedValue = (obj: any, key: string): any => {
    if (key.includes('.')) {
      const keys = key.split('.')
      let value = obj
      for (const k of keys) {
        value = value?.[k]
      }
      return value
    }
    return obj[key]
  }

  const transformData = (
    items: any[],
    columns: string[],
    columnDefinitions: any[]
  ) => {
    return items.map((item) => {
      const row: any = {}
      columns.forEach((colKey) => {
        const colDef = columnDefinitions.find((c) => c.key === colKey)
        if (colDef) {
          if (colKey === 'owners' && item.assetPeople) {
            row[colDef.label] = item.assetPeople
              .map((ap: any) => `${ap.personName} (${ap.percent}%)`)
              .join(', ')
          } else if (colKey === 'owners' && item.assetCompanies) {
            const companies = item.assetCompanies
              .map((ac: any) => `${ac.companyName} (${ac.percent}%)`)
              .join(', ')
            row[colDef.label] = companies
          } else if (colKey === 'borrowers' && item.liabilityPeople) {
            row[colDef.label] = item.liabilityPeople
              .map((lp: any) => `${lp.personName} (${lp.percent}%)`)
              .join(', ')
          } else if (colKey === 'borrowers' && item.liabilityCompanies) {
            const companies = item.liabilityCompanies
              .map((lc: any) => `${lc.companyName} (${lc.percent}%)`)
              .join(', ')
            row[colDef.label] = companies
          } else if (colKey === 'address' && item.address) {
            const addr = item.address
            row[colDef.label] = [
              addr.street,
              addr.city,
              addr.state,
              addr.postcode,
              addr.country,
            ]
              .filter(Boolean)
              .join(', ')
          } else if (colKey === 'contactPerson' && item.contactPerson) {
            row[colDef.label] = item.contactPerson.fullName
          } else {
            const value = getNestedValue(item, colKey)
            if (value === null || value === undefined) {
              row[colDef.label] = ''
            } else if (typeof value === 'boolean') {
              row[colDef.label] = value ? 'Yes' : 'No'
            } else if (value instanceof Date) {
              row[colDef.label] = value.toLocaleDateString()
            } else {
              row[colDef.label] = String(value)
            }
          }
        }
      })
      return row
    })
  }

  const handleExport = async (settings: ExportSettings) => {
    try {
      const sheets = []

      if (settings.entities.people && people && people.length > 0) {
        const peopleData = transformData(
          people,
          settings.columns.people,
          PEOPLE_COLUMNS
        )
        sheets.push({ name: 'People', data: peopleData })
      }

      if (settings.entities.companies && companies && companies.length > 0) {
        const companiesData = transformData(
          companies,
          settings.columns.companies,
          COMPANY_COLUMNS
        )
        sheets.push({ name: 'Companies', data: companiesData })
      }

      if (settings.entities.assets && assets && assets.length > 0) {
        const assetsData = transformData(
          assets,
          settings.columns.assets,
          ASSET_COLUMNS
        )
        sheets.push({ name: 'Assets', data: assetsData })
      }

      if (
        settings.entities.liabilities &&
        liabilities &&
        liabilities.length > 0
      ) {
        const liabilitiesData = transformData(
          liabilities,
          settings.columns.liabilities,
          LIABILITY_COLUMNS
        )
        sheets.push({ name: 'Liabilities', data: liabilitiesData })
      }

      await sharedExport(sheets, {
        fileName: settings.fileName,
        format: settings.format,
        includeHeaders: settings.includeHeaders,
      })
    } catch (error) {
      console.error('Report export failed:', error)
      throw error
    }
  }

  return {
    handleExport,
    isExporting,
  }
}
