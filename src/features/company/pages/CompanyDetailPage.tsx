import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { useCompanyQueries } from '../hooks/useCompaniesQueries'
import { CompanyHeader } from '../components/detail/CompanyHeader'
import { PersonStatsCards } from '@/features/people/components/detail/PersonStatsCards'
import { CompanyOverviewTab } from '../components/detail/CompanyOverviewTab'
import { AssetsTable } from '@/features/assets/components/AssetsTable'
import { LiabilitiesTable } from '@/features/liabilities/components/LiabilitiesTable'
import {
  useAllAssetsByCompanyId,
  useAllLiabilitiesByCompanyId,
} from '@/hooks/useSharedData'
import { useBreadcrumbStore } from '@/store/breadcrumbStore'

export const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { useCompany } = useCompanyQueries()
  const setLabel = useBreadcrumbStore((state) => state.setLabel)

  const {
    data: company,
    isLoading: isLoadingCompany,
    error,
  } = useCompany(id || '', !!id)

  const { data: assetsData } = useAllAssetsByCompanyId(id || '')

  const { data: liabilitiesData } = useAllLiabilitiesByCompanyId(id || '')

  useEffect(() => {
    if (company?.name && id) {
      setLabel(id, company.name)
    }
  }, [company, id, setLabel])

  const companyAssets = assetsData?.data || []
  const companyLiabilities = liabilitiesData?.data || []

  const totalAssetValue = companyAssets.reduce((sum, asset) => {
    const ownership = asset.assetCompanies?.find((ac) => ac.companyId === id)
    const ownershipPercent = ownership?.percent || 0
    return sum + (Number(asset.value || 0) * ownershipPercent) / 100
  }, 0)

  const totalLiabilityBalance = companyLiabilities.reduce((sum, liability) => {
    const ownership = liability.liabilityCompanies?.find(
      (lc) => lc.companyId === id
    )
    const ownershipPercent = ownership?.percent || 0
    return (
      sum + (Number(liability.initialBalance || 0) * ownershipPercent) / 100
    )
  }, 0)

  if (isLoadingCompany) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-2">
              Error loading company details
            </p>
            <p className="text-sm text-muted-foreground">
              {error?.message || 'Company not found'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto space-y-6">
      <CompanyHeader company={company} />

      <PersonStatsCards
        assetsCount={companyAssets.length}
        liabilitiesCount={companyLiabilities.length}
        totalAssetValue={totalAssetValue}
        totalLiabilityBalance={totalLiabilityBalance}
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-100">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">
            Assets
            {companyAssets.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                {companyAssets.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="liabilities">
            Liabilities
            {companyLiabilities.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                {companyLiabilities.length}
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

export default CompanyDetailPage
