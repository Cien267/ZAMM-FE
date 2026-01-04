import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, FileText } from 'lucide-react'
import { ReportFilters } from '../components/ReportFilters'
import { ReportSummaryCards } from '../components/ReportSummaryCards'
import { PeopleReportTable } from '../components/PeopleReportTable'
import { CompaniesReportTable } from '../components/CompaniesReportTable'
import { AssetsReportTable } from '../components/AssetsReportTable'
import { LiabilitiesReportTable } from '../components/LiabilitiesReportTable'
import { ExportModal } from '../components/ExportModal'
import { useReportSummary } from '../hooks/useReportData'
import { useReportExport } from '../hooks/useReportExport'
import type { IReportFilters } from '../types'

export const ReportsPage = () => {
  const [filters, setFilters] = useState<IReportFilters>({
    dateFrom: '',
    dateTo: '',
    brokerId: '',
    searchQuery: '',
  })

  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const { summary, isLoading: isSummaryLoading } = useReportSummary(filters)
  const { handleExport } = useReportExport(filters)

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive overview of people, companies, assets, and liabilities
          </p>
        </div>
        <Button onClick={() => setExportModalOpen(true)}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <ReportFilters filters={filters} onFilterChange={setFilters} />

      {/* Summary Cards */}
      {!isSummaryLoading && (
        <ReportSummaryCards
          peopleCount={summary.peopleCount}
          companiesCount={summary.companiesCount}
          assetsCount={summary.assetsCount}
          liabilitiesCount={summary.liabilitiesCount}
          totalAssetValue={summary.totalAssetValue}
          totalLiabilityBalance={summary.totalLiabilityBalance}
        />
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="people">
            People ({summary.peopleCount})
          </TabsTrigger>
          <TabsTrigger value="companies">
            Companies ({summary.companiesCount})
          </TabsTrigger>
          <TabsTrigger value="assets">
            Assets ({summary.assetsCount})
          </TabsTrigger>
          <TabsTrigger value="liabilities">
            Liabilities ({summary.liabilitiesCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-6">
          <PeopleReportTable filters={filters} />
          <CompaniesReportTable filters={filters} />
          <AssetsReportTable filters={filters} />
          <LiabilitiesReportTable filters={filters} />
        </TabsContent>

        <TabsContent value="people" className="mt-6">
          <PeopleReportTable filters={filters} />
        </TabsContent>

        <TabsContent value="companies" className="mt-6">
          <CompaniesReportTable filters={filters} />
        </TabsContent>

        <TabsContent value="assets" className="mt-6">
          <AssetsReportTable filters={filters} />
        </TabsContent>

        <TabsContent value="liabilities" className="mt-6">
          <LiabilitiesReportTable filters={filters} />
        </TabsContent>
      </Tabs>

      {/* Export Modal */}
      <ExportModal
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        onExport={handleExport}
        defaultFileName={`report_${new Date().toISOString().split('T')[0]}`}
      />
    </div>
  )
}
