import React, { createContext, useContext, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useCompanyQueries } from '../hooks/useCompaniesQueries'
import {
  useAllAssetsByCompanyId,
  useAllLiabilitiesByCompanyId,
} from '@/hooks/useSharedData'
import type { Company } from '../types'
import type { Asset } from '@/features/assets/types'
import type { Liability } from '@/features/liabilities/types'

interface CompanyDetailContextType {
  company: Company | undefined
  id: string
  assets: Asset[]
  liabilities: Liability[]
  totals: {
    assets: number
    liabilities: number
  }
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

const CompanyDetailContext = createContext<
  CompanyDetailContextType | undefined
>(undefined)

export const CompanyDetailProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { id = '' } = useParams<{ id: string }>()
  const { useCompany } = useCompanyQueries()

  const {
    data: company,
    isLoading: isLoadingCompany,
    error,
    refetch,
  } = useCompany(id, !!id)
  const { data: assetsData, isLoading: isLoadingAssets } =
    useAllAssetsByCompanyId(id, !!id)
  const { data: liabilitiesData, isLoading: isLoadingLiabilities } =
    useAllLiabilitiesByCompanyId(id, !!id)

  const assets = useMemo(() => assetsData || [], [assetsData])
  const liabilities = useMemo(() => liabilitiesData || [], [liabilitiesData])

  const totals = useMemo(() => {
    const totalAssetValue = assets.reduce((sum, asset) => {
      const ownership = asset.assetCompanies?.find(
        (ap: any) => ap.companyId === id
      )
      return sum + (Number(asset.value || 0) * (ownership?.percent || 0)) / 100
    }, 0)

    const totalLiabilityBalance = liabilities.reduce((sum, liability) => {
      const ownership = liability.liabilityCompanies?.find(
        (lp: any) => lp.companyId === id
      )
      return (
        sum +
        (Number(liability.initialBalance || 0) * (ownership?.percent || 0)) /
          100
      )
    }, 0)

    return { assets: totalAssetValue, liabilities: totalLiabilityBalance }
  }, [assets, liabilities, id])

  const value = {
    company,
    id,
    assets,
    liabilities,
    totals,
    isLoading: isLoadingCompany || isLoadingAssets || isLoadingLiabilities,
    error,
    refetch,
  }

  return (
    <CompanyDetailContext.Provider value={value}>
      {children}
    </CompanyDetailContext.Provider>
  )
}

export const useCompanyDetail = () => {
  const context = useContext(CompanyDetailContext)
  if (!context)
    throw new Error(
      'useCompanyDetail must be used within CompanyDetailProvider'
    )
  return context
}
