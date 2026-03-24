import { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { CompanyHeader } from '../components/detail/CompanyHeader'
import { DetailStatsCards } from '@/features/clients/components/DetailStatsCards'
import { CompanyOverviewTab } from '../components/detail/CompanyOverviewTab'
import { AssetsTable } from '@/features/assets/components/AssetsTable'
import { LiabilitiesTable } from '@/features/liabilities/components/LiabilitiesTable'
import { useBreadcrumbStore } from '@/store/breadcrumbStore'
import { ErrorState } from '@/components/common/ErrorState'
import {
  CompanyDetailProvider,
  useCompanyDetail,
} from '../context/CompanyDetailContext'

export const CompanyDetailContent = () => {
  const {
    company,
    id,
    assets,
    liabilities,
    totals,
    isLoading,
    error,
    refetch,
  } = useCompanyDetail()
  const setLabel = useBreadcrumbStore((state) => state.setLabel)

  useEffect(() => {
    if (company?.name && id) {
      setLabel(id, company.name)
    }
  }, [company, id, setLabel])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !company) {
    return <ErrorState message={error?.message} onRetry={refetch} />
  }

  return (
    <div className="mx-auto space-y-6">
      <CompanyHeader company={company} />

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
          <CompanyOverviewTab company={company} />
        </TabsContent>

        <TabsContent value="assets">
          <AssetsTable initialData={company} type="company" />
        </TabsContent>

        <TabsContent value="liabilities">
          <LiabilitiesTable initialData={company} type="company" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export const CompanyDetailPage = () => {
  return (
    <CompanyDetailProvider>
      <CompanyDetailContent />
    </CompanyDetailProvider>
  )
}
export default CompanyDetailPage
