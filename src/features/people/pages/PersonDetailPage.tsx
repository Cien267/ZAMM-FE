import { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { PersonHeader } from '../components/detail/PersonHeader'
import { DetailStatsCards } from '@/features/clients/components/DetailStatsCards'
import { PersonOverviewTab } from '../components/detail/PersonOverviewTab'
import { AssetsTable } from '@/features/assets/components/AssetsTable'
import { LiabilitiesTable } from '@/features/liabilities/components/LiabilitiesTable'
import { useBreadcrumbStore } from '@/store/breadcrumbStore'
import { ErrorState } from '@/components/common/ErrorState'
import {
  PersonDetailProvider,
  usePersonDetail,
} from '../context/PersonDetailContext'

export const PersonDetailContent = () => {
  const { person, id, assets, liabilities, totals, isLoading, error, refetch } =
    usePersonDetail()
  const setLabel = useBreadcrumbStore((state) => state.setLabel)

  useEffect(() => {
    if (person?.fullName && id) {
      setLabel(id, person.fullName)
    }
  }, [person, id, setLabel])

  if (isLoading) {
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

      <DetailStatsCards
        assetsCount={assets.length}
        liabilitiesCount={liabilities.length}
        totalAssetValue={totals.assets}
        totalLiabilityBalance={totals.liabilities}
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-100">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">
            Assets
            {assets.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                {assets.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="liabilities">
            Liabilities
            {liabilities.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                {liabilities.length}
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

export const PersonDetailPage = () => {
  return (
    <PersonDetailProvider>
      <PersonDetailContent />
    </PersonDetailProvider>
  )
}

export default PersonDetailPage
