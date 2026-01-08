import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingDown, Building2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import type { Liability } from '@/features/liabilities/types'
import { useNavigate } from 'react-router-dom'

interface TopLiabilitiesProps {
  liabilities: Liability[]
}

export const TopLiabilities = ({ liabilities }: TopLiabilitiesProps) => {
  const navigate = useNavigate()
  const formatBorrowers = (liability: Liability) => {
    const borrowers = []
    if (liability.liabilityPeople) {
      borrowers.push(...liability.liabilityPeople.map((lp) => lp.personName))
    }
    if (liability.liabilityCompanies) {
      borrowers.push(
        ...liability.liabilityCompanies.map((lc) => lc.companyName)
      )
    }
    return (
      borrowers.slice(0, 2).join(', ') + (borrowers.length > 2 ? '...' : '')
    )
  }

  const formatAssets = (liability: Liability) => {
    if (!liability.liabilityAssets || liability.liabilityAssets.length === 0) {
      return 'No secured assets'
    }
    const assets = liability.liabilityAssets.map((la) => la.assetName)
    return assets.slice(0, 2).join(', ') + (assets.length > 2 ? '...' : '')
  }

  if (liabilities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            Top 5 Liabilities
          </CardTitle>
          <CardDescription>Largest liabilities in portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No liabilities found
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleNavigateLiability = (liability: Liability) => {
    const params = new URLSearchParams()
    if (liability?.liabilityPeople && liability.liabilityPeople.length > 0)
      params.append('personId', liability?.liabilityPeople[0].personId)
    if (
      liability?.liabilityCompanies &&
      liability?.liabilityCompanies.length > 0
    )
      params.append('companyId', liability?.liabilityCompanies[0].companyId)

    navigate(`/clients/liabilities/${liability.id}?${params.toString()}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-red-600" />
          Top 5 Liabilities
        </CardTitle>
        <CardDescription>Largest liabilities in portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {liabilities.map((liability, index) => (
            <div
              key={liability.id}
              className="flex items-start gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => handleNavigateLiability(liability)}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-destructive/10 text-destructive font-bold shrink-0">
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">
                      {liability.name || 'Unnamed Liability'}
                    </h4>
                    {liability.lenderName && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Building2 className="h-3 w-3 shrink-0" />
                        <span className="truncate">{liability.lenderName}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-lg text-red-600">
                      {formatCurrency(liability.initialBalance || 0)}
                    </p>
                    {liability.amount &&
                      liability.amount !== liability.initialBalance && (
                        <p className="text-xs text-muted-foreground">
                          Current: {formatCurrency(liability.amount)}
                        </p>
                      )}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {liability.loanId && (
                    <Badge variant="outline" className="text-xs">
                      {liability.loanId}
                    </Badge>
                  )}
                  {liability.financePurpose && (
                    <Badge variant="secondary" className="text-xs">
                      {liability.financePurpose}
                    </Badge>
                  )}
                  {liability.loanTerm && (
                    <Badge variant="outline" className="text-xs">
                      {liability.loanTerm}y term
                    </Badge>
                  )}
                </div>

                {liability.liabilityPeople?.length ||
                liability.liabilityCompanies?.length ? (
                  <p className="text-xs text-muted-foreground mt-2">
                    Borrowers: {formatBorrowers(liability)}
                  </p>
                ) : null}

                <p className="text-xs text-muted-foreground mt-1">
                  Secured: {formatAssets(liability)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
