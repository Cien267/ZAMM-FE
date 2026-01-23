import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { useLendersQueries } from '../../hooks/useLendersQueries'
import { LenderHeader } from '../../components/admin/detail/LenderHeader'
import { LenderOverviewTab } from '../../components/admin/detail/LenderOverviewTab'
import { useAllLoansByLenderId } from '@/hooks/useSharedData'
import { useBreadcrumbStore } from '@/store/breadcrumbStore'
import { ErrorState } from '@/components/common/ErrorState'
import LoansTable from '@/features/loans/components/LoansTable'

export const AdminLenderDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { useLender } = useLendersQueries()
  const setLabel = useBreadcrumbStore((state) => state.setLabel)

  const {
    data: lender,
    isLoading: isLoadingLender,
    error,
    refetch,
  } = useLender(id || '', !!id)

  const { data: loansData } = useAllLoansByLenderId(id || '', !!id)
  const loans = loansData || []

  useEffect(() => {
    if (lender?.name && id) {
      setLabel(id, lender.name)
    }
  }, [lender, id, setLabel])

  if (isLoadingLender) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !lender) {
    return <ErrorState message={error?.message} onRetry={refetch} />
  }

  return (
    <div className="mx-auto space-y-6">
      <LenderHeader lender={lender} />
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-100">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">
            Loans
            {loans.length > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                {loans.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <LenderOverviewTab lender={lender} />
        </TabsContent>

        <TabsContent value="assets">
          <LoansTable lender={lender} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminLenderDetailPage
