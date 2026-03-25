import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useLendersQueries } from '../../hooks/useLendersQueries'
import { LenderHeader } from '../../components/admin/detail/LenderHeader'
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
      <LoansTable lender={lender} />
    </div>
  )
}

export default AdminLenderDetailPage
