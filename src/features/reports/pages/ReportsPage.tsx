import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Download } from 'lucide-react'
import { ReportSummaryCards } from '../components/ReportSummaryCards'
import { PeopleReportTable } from '../components/PeopleReportTable'
import { CompaniesReportTable } from '../components/CompaniesReportTable'
import { AssetsReportTable } from '../components/AssetsReportTable'
import { LiabilitiesReportTable } from '../components/LiabilitiesReportTable'
import { ExportModal } from '../components/ExportModal'
import { useReports } from '../hooks/useReports'
import { useReportExport } from '../hooks/useReportExport'
import { ErrorState } from '@/components/common/ErrorState'
import { TopAssets } from '../components/TopAssets'
import { TopLiabilities } from '../components/TopLiabilities'
import { usePageTitle } from '@/hooks/usePageTitle'

export const ReportsPage = () => {
  usePageTitle('Reports')
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const { useReportSummary } = useReports()
  const { data: summary, isLoading, error } = useReportSummary()
  const { handleExport } = useReportExport()

  if (isLoading) {
    return (
      <>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive overview of people, companies, assets, and liabilities
          </p>
        </div>
        <div className="mx-auto space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            <Skeleton className="h-34" />
            <Skeleton className="h-34" />
            <Skeleton className="h-34" />
            <Skeleton className="h-34" />
          </div>
          <div className="space-y-4 mt-6 grid grid-cols-2 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return <ErrorState message={error.message} />
  }

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive overview of people, companies, assets, and liabilities
          </p>
        </div>
        <Button onClick={() => setExportModalOpen(true)} variant={'sky'}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="people">
            People ({summary?.totalPeople || 0})
          </TabsTrigger>
          <TabsTrigger value="companies">
            Companies ({summary?.totalCompanies || 0})
          </TabsTrigger>
          <TabsTrigger value="assets">
            Assets ({summary?.totalAssets})
          </TabsTrigger>
          <TabsTrigger value="liabilities">
            Liabilities ({summary?.totalLiabilities || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          {!isLoading && (
            <>
              <ReportSummaryCards
                peopleCount={summary?.totalPeople || 0}
                companiesCount={summary?.totalCompanies || 0}
                assetsCount={summary?.totalAssets || 0}
                liabilitiesCount={summary?.totalLiabilities || 0}
                totalAssetValue={summary?.totalAssetValue || 0}
                totalLiabilityBalance={summary?.totalLiabilityAmount || 0}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-8">
                <TopAssets assets={summary?.topAssets || []} />
                <TopLiabilities liabilities={summary?.topLiabilities || []} />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="people" className="mt-6">
          <PeopleReportTable />
        </TabsContent>

        <TabsContent value="companies" className="mt-6">
          <CompaniesReportTable />
        </TabsContent>

        <TabsContent value="assets" className="mt-6">
          <AssetsReportTable />
        </TabsContent>

        <TabsContent value="liabilities" className="mt-6">
          <LiabilitiesReportTable />
        </TabsContent>
      </Tabs>

      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        onExport={handleExport}
        defaultFileName={`report_${new Date().toISOString().split('T')[0]}`}
      />
    </div>
  )
}

export default ReportsPage
