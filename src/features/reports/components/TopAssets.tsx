import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, MapPin } from 'lucide-react'
import { formatCurrency, formatAddress } from '@/lib/utils'
import type { Asset } from '@/features/assets/types'
import { useNavigate } from 'react-router-dom'

interface TopAssetsProps {
  assets: Asset[]
}

export const TopAssets = ({ assets }: TopAssetsProps) => {
  const navigate = useNavigate()

  const formatOwners = (asset: Asset) => {
    const owners = []
    if (asset.assetPeople) {
      owners.push(...asset.assetPeople.map((ap) => ap.personName))
    }
    if (asset.assetCompanies) {
      owners.push(...asset.assetCompanies.map((ac) => ac.companyName))
    }
    return owners.slice(0, 2).join(', ') + (owners.length > 2 ? '...' : '')
  }

  if (assets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Top 5 Assets by Value
          </CardTitle>
          <CardDescription>Highest valued assets in portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No assets with values found
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Top 5 Assets by Value
        </CardTitle>
        <CardDescription>Highest valued assets in portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assets.map((asset, index) => (
            <div
              key={asset.id}
              className="flex items-start gap-4 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/clients/assets/${asset.id}`)}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold shrink-0">
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{asset.name}</h4>
                    {asset.address && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">
                          {formatAddress(asset.address)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-lg text-green-600">
                      {formatCurrency(asset.value || 0)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {asset.propertyType && (
                    <Badge variant="outline" className="text-xs">
                      {asset.propertyType}
                    </Badge>
                  )}
                  {asset.isInvestment && (
                    <Badge variant="default" className="text-xs">
                      Investment
                    </Badge>
                  )}
                  {asset.isUnencumbered && (
                    <Badge variant="secondary" className="text-xs">
                      Unencumbered
                    </Badge>
                  )}
                </div>

                {asset.assetPeople?.length || asset.assetCompanies?.length ? (
                  <p className="text-xs text-muted-foreground mt-2">
                    Owners: {formatOwners(asset)}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
