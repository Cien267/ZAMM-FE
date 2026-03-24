import React, { createContext, useContext, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { usePeopleQueries } from '../hooks/usePeopleQueries'
import {
  useAllAssetsByPersonId,
  useAllLiabilitiesByPersonId,
} from '@/hooks/useSharedData'
import type { Person } from '../types'
import type { Asset } from '@/features/assets/types'
import type { Liability } from '@/features/liabilities/types'

interface PersonDetailContextType {
  person: Person | undefined
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

const PersonDetailContext = createContext<PersonDetailContextType | undefined>(
  undefined
)

export const PersonDetailProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { id = '' } = useParams<{ id: string }>()
  const { usePerson } = usePeopleQueries()

  const {
    data: person,
    isLoading: isLoadingPerson,
    error,
    refetch,
  } = usePerson(id, !!id)
  const { data: assetsData, isLoading: isLoadingAssets } =
    useAllAssetsByPersonId(id, !!id)
  const { data: liabilitiesData, isLoading: isLoadingLiabilities } =
    useAllLiabilitiesByPersonId(id, !!id)

  const assets = useMemo(() => assetsData || [], [assetsData])
  const liabilities = useMemo(() => liabilitiesData || [], [liabilitiesData])

  const totals = useMemo(() => {
    const totalAssetValue = assets.reduce((sum, asset) => {
      const ownership = asset.assetPeople?.find((ap: any) => ap.personId === id)
      return sum + (Number(asset.value || 0) * (ownership?.percent || 0)) / 100
    }, 0)

    const totalLiabilityBalance = liabilities.reduce((sum, liability) => {
      const ownership = liability.liabilityPeople?.find(
        (lp: any) => lp.personId === id
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
    person,
    id,
    assets,
    liabilities,
    totals,
    isLoading: isLoadingPerson || isLoadingAssets || isLoadingLiabilities,
    error,
    refetch,
  }

  return (
    <PersonDetailContext.Provider value={value}>
      {children}
    </PersonDetailContext.Provider>
  )
}

export const usePersonDetail = () => {
  const context = useContext(PersonDetailContext)
  if (!context)
    throw new Error('usePersonDetail must be used within PersonDetailProvider')
  return context
}
