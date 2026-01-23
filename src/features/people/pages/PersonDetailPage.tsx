import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { usePeopleQueries } from '../hooks/usePeopleQueries'
import { PersonHeader } from '../components/detail/PersonHeader'
import { PersonStatsCards } from '../components/detail/PersonStatsCards'
import { PersonOverviewTab } from '../components/detail/PersonOverviewTab'
import { AssetsTable } from '@/features/assets/components/AssetsTable'
import { LiabilitiesTable } from '@/features/liabilities/components/LiabilitiesTable'
import {
  useAllAssetsByPersonId,
  useAllLiabilitiesByPersonId,
} from '@/hooks/useSharedData'
import { useBreadcrumbStore } from '@/store/breadcrumbStore'
import { ErrorState } from '@/components/common/ErrorState'

export const PersonDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { usePerson } = usePeopleQueries()
  const setLabel = useBreadcrumbStore((state) => state.setLabel)

  const {
    data: person,
    isLoading: isLoadingPerson,
    error,
    refetch,
  } = usePerson(id || '', !!id)

  const { data: assetsData } = useAllAssetsByPersonId(id || '', !!id)

  const { data: liabilitiesData } = useAllLiabilitiesByPersonId(id || '', !!id)

  useEffect(() => {
    if (person?.fullName && id) {
      setLabel(id, person.fullName)
    }
  }, [person, id, setLabel])

  const personAssets = assetsData || []
  const personLiabilities = liabilitiesData || []

  const totalAssetValue = personAssets.reduce((sum, asset) => {
    const ownership = asset.assetPeople?.find((ap) => ap.personId === id)
    const ownershipPercent = ownership?.percent || 0
    return sum + (Number(asset.value || 0) * ownershipPercent) / 100
  }, 0)

  const totalLiabilityBalance = personLiabilities.reduce((sum, liability) => {
    const ownership = liability.liabilityPeople?.find(
      (lp) => lp.personId === id
    )
    const ownershipPercent = ownership?.percent || 0
    return (
      sum + (Number(liability.initialBalance || 0) * ownershipPercent) / 100
    )
  }, 0)

  if (isLoadingPerson) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !person) {
    return <ErrorState message={error?.message} onRetry={refetch} />
  }

  return (
    <div className="mx-auto space-y-6">
      <PersonHeader person={person} />

      <PersonStatsCards
        assetsCount={personAssets.length}
        liabilitiesCount={personLiabilities.length}
        totalAssetValue={totalAssetValue}
        totalLiabilityBalance={totalLiabilityBalance}
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-100">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">
            Assets
            {personAssets.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                {personAssets.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="liabilities">
            Liabilities
            {personLiabilities.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                {personLiabilities.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PersonOverviewTab person={person} />
        </TabsContent>

        <TabsContent value="assets">
          <AssetsTable initialData={person} type="person" />
        </TabsContent>

        <TabsContent value="liabilities">
          <LiabilitiesTable initialData={person} type="person" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PersonDetailPage
