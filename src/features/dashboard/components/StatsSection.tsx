import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Users, FileText, DollarSign } from 'lucide-react'
import { useReports } from '@/features/reports/hooks/useReports'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ErrorState } from '@/components/common/ErrorState'
import { Skeleton } from '@/components/ui/skeleton'
import { RecentActivities } from '@/features/activity-logs/components/RecentActivities'

export const StatsSection: React.FC = () => {
  const { useReportSummary } = useReports()
  const { data: summary, isLoading, error, refetch } = useReportSummary()

  const [isRevealed, setIsRevealed] = useState(false)

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-34 col-span-2" />
        <Skeleton className="h-34" />
        <Skeleton className="h-34" />
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-sm h-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-semibold tracking-tight">
            LOAN BOOK VALUE
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isRevealed ? (
            <div className="animate-in fade-in duration-300 w-full">
              <div className="flex justify-between items-center gap-4">
                <div className="text-3xl font-bold text-foreground">
                  {formatCurrency(summary?.totalLiabilityAmount || 0)}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-6 px-0 text-xs text-muted-foreground hover:text-primary"
                  onClick={() => setIsRevealed(false)}
                >
                  <EyeOff className="mr-1 h-3 w-3" /> Hide Value
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Last updated {formatDate(new Date())}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-between space-y-2 w-full">
              <div className="flex justify-between items-center gap-4">
                <div className="h-9 w-50 bg-gray-200 dark:bg-slate-700 animate-pulse rounded" />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-6 px-0 text-xs text-muted-foreground hover:text-primary"
                  onClick={() => setIsRevealed(true)}
                >
                  <Eye className="mr-1 h-4 w-4" /> Reveal Value
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Current total loan book value
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm h-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-semibold tracking-tight">LOANS</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-sky-500">
            {summary?.totalLiabilities || 0}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Active loan applications
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-sm h-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-semibold tracking-tight">
            CLIENTS
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-sky-500">
            {Number(summary?.totalPeople || 0) +
              Number(summary?.totalCompanies || 0)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total active clients
          </p>
        </CardContent>
      </Card>
      <RecentActivities />
    </div>
  )
}
