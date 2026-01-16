import {
  useAllLenders,
  useLendersAssignedToBrokerage,
} from '@/hooks/useSharedData'
import { useLenders } from '../../hooks/useLenders'
import { ErrorState } from '@/components/common/ErrorState'
import { useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export const AssignLender = () => {
  const {
    data: lenderData,
    isLoading: isLoadingLenders,
    error,
    refetch,
  } = useAllLenders()
  const { user } = useAuth()
  const { data: brokerageLenderData, isLoading: isLoadingBrokerLenderData } =
    useLendersAssignedToBrokerage(user?.brokerageId || '')

  const {
    assignLenderAsync,
    isAssigningLender,
    unassignLenderAsync,
    isUnassigningLender,
  } = useLenders()
  const isProcessing = isAssigningLender || isUnassigningLender

  const lenders = useMemo(() => lenderData?.data ?? [], [lenderData])
  const brokerageLenders = useMemo(
    () => brokerageLenderData ?? [],
    [brokerageLenderData]
  )

  const selectedLenderIds = useMemo(() => {
    return new Set(brokerageLenders.map((bl: any) => bl.id))
  }, [brokerageLenders])

  const handleToggle = async (lenderId: string, isSelected: boolean) => {
    if (isProcessing) return

    try {
      if (isSelected) {
        await unassignLenderAsync(lenderId)
      } else {
        await assignLenderAsync(lenderId)
      }
    } catch (err) {
      console.error('Failed to update lender assignment:', err)
    }
  }

  if (isLoadingLenders || isLoadingBrokerLenderData) {
    return (
      <div className="container mx-auto space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {lenders.map((lender) => {
        const isSelected = selectedLenderIds.has(lender.id)

        return (
          <div
            onClick={() => handleToggle(lender.id, isSelected)}
            key={lender.id}
            className={cn(
              'relative group cursor-pointer rounded-xl border-2 p-6 transition-all duration-200 bg-background text-foreground',
              'hover:shadow-md hover:-translate-y-1',
              isSelected
                ? 'border-sky-500 bg-sky-50'
                : 'border-slate-200 hover:border-slate-300'
            )}
          >
            {isSelected && (
              <div className="absolute top-3 right-3 text-primary">
                <CheckCircle2 className="w-6 h-6 fill-sky-600 text-white" />
              </div>
            )}

            <div className="flex flex-col items-center space-y-4">
              <div className="w-40 h-40 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-slate-50 shadow-sm group-hover:scale-105 transition-transform duration-200">
                <img
                  src={lender.logoUrl}
                  alt={`${lender.name} logo`}
                  className="object-contain w-full h-full p-2"
                />
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-slate-800 text-lg group-hover:text-primary transition-colors">
                  {lender.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-medium">
                  {lender.loans?.length || 0} Loan Products
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
