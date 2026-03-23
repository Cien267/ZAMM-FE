import { Card, CardContent } from '@/components/ui/card'
import { Briefcase, Receipt, Building2, CreditCard } from 'lucide-react'

interface DetailStatsCardsProps {
  assetsCount: number
  liabilitiesCount: number
  totalAssetValue?: number
  totalLiabilityBalance?: number
}

export const DetailStatsCards = ({
  assetsCount,
  liabilitiesCount,
  totalAssetValue,
  totalLiabilityBalance,
}: DetailStatsCardsProps) => {
  const formatCurrency = (value?: number) => {
    if (!value) return '$0'
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const netWorth = (totalAssetValue || 0) - (totalLiabilityBalance || 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
              <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
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
              <Receipt className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Net Worth
              </p>
              <p
                className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {formatCurrency(netWorth)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {netWorth >= 0 ? 'Positive' : 'Negative'} equity
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">LVR</p>
              <p className="text-2xl font-bold">
                {totalAssetValue && totalAssetValue > 0
                  ? `${(((totalLiabilityBalance || 0) / totalAssetValue) * 100).toFixed(1)}%`
                  : '0%'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Loan to Value Ratio
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
