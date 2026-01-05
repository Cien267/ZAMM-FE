import { Card, CardContent } from '@/components/ui/card'
import { Users, Building2, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ReportSummaryCardsProps {
  peopleCount: number
  companiesCount: number
  assetsCount: number
  liabilitiesCount: number
  totalAssetValue: number
  totalLiabilityBalance: number
}

export const ReportSummaryCards = ({
  peopleCount,
  companiesCount,
  assetsCount,
  liabilitiesCount,
  totalAssetValue,
  totalLiabilityBalance,
}: ReportSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                People
              </p>
              <p className="text-2xl font-bold">{peopleCount}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Companies
              </p>
              <p className="text-2xl font-bold">{companiesCount}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Assets
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(totalAssetValue)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {assetsCount} assets
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Liabilities
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(totalLiabilityBalance)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {liabilitiesCount} liabilities
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
