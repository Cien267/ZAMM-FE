import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Calendar,
  Home,
  Users,
  Building2,
  Link as LinkIcon,
  TrendingUp,
} from 'lucide-react'
import { useAssetQueries } from '../hooks/useAssetQueries'
import { useAssets } from '../hooks/useAssets'
import { formatCurrency, formatDate, formatAddress } from '@/lib/utils'
import { openUpSertAssetModal } from '../components/UpSertAsset'
import { useBreadcrumbStore } from '@/store/breadcrumbStore'
import { useAlert } from '@/contexts/AlertContext'
import type { AssetLiability } from '../types'
import { ErrorState } from '@/components/common/ErrorState'
import { useEvents } from '@/features/events/hooks/useEvents'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ASSET_DELETE_EVENT } from '@/features/events/constants'
import { useActivityLogs } from '@/features/activity-logs/hooks/useActivityLogs'
import {
  ENTITY_TYPE_ASSET,
  ACTION_TYPE_DELETED,
} from '@/features/activity-logs/constants'

export const AssetDetailPage = () => {
  const { assetId } = useParams<{ assetId: string }>()
  const navigate = useNavigate()
  const { createEvent } = useEvents()
  const { user } = useAuth()
  const { createActivityLog } = useActivityLogs()
  const { openAlert } = useAlert()
  const setLabel = useBreadcrumbStore((state) => state.setLabel)

  const { useAsset } = useAssetQueries()
  const { deleteAssetAsync } = useAssets()
  const {
    data: asset,
    isLoading,
    error,
    refetch,
  } = useAsset(assetId || '', !!assetId)

  useEffect(() => {
    if (asset?.name && assetId) {
      setLabel(assetId, asset.name)
    }
  }, [asset, assetId, setLabel])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !asset) {
    return <ErrorState message={error?.message} onRetry={refetch} />
  }

  const assetType = (asset.assetPeople?.length || 0) > 0 ? 'person' : 'company'

  const handleDelete = () => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete ${asset.name} and all associated
                data.`,
      confirmText: 'Delete',
      showTimelineCheckbox: true,
      onConfirm: async () => {
        await deleteAssetAsync(asset.id, {
          onSuccess: () => {
            navigate(-1)
          },
        })
      },
      onSuccess: (reason?: string) => {
        createEvent({
          title: `Delete Asset ${asset.name}`,
          description: reason,
          type: ASSET_DELETE_EVENT,
          date: new Date(),
          isSystem: false,
          isRepeating: false,
          isDismissed: true,
          repeatingDateDismissed: undefined,
          addedByUserId: user?.id || '',
          personId:
            assetType === 'person' && asset.assetPeople
              ? asset.assetPeople[0].personId
              : undefined,
          companyId:
            assetType === 'company' && asset.assetCompanies
              ? asset.assetCompanies[0].companyId
              : undefined,
        })
        createActivityLog({
          brokerId: user?.id || '',
          brokerageId: user?.brokerageId || '',
          actionType: ACTION_TYPE_DELETED,
          entityType: ENTITY_TYPE_ASSET,
          entityId: asset.id,
        })
      },
    })
  }

  const handleNavigateLiability = (assetLiability: AssetLiability) => {
    const params = new URLSearchParams()
    if (asset?.assetPeople && asset.assetPeople.length > 0)
      params.append('personId', asset?.assetPeople[0].personId)
    if (asset?.assetCompanies && asset?.assetCompanies.length > 0)
      params.append('companyId', asset?.assetCompanies[0].companyId)

    navigate(
      `/clients/liabilities/${assetLiability.liabilityId}?${params.toString()}`
    )
  }

  const totalOwnership =
    (asset.assetPeople?.reduce((sum, p) => sum + p.percent, 0) || 0) +
    (asset.assetCompanies?.reduce((sum, c) => sum + c.percent, 0) || 0)

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{asset.name}</h1>
            {asset.isInvestment && (
              <Badge variant="default" className="text-sm">
                Investment Property
              </Badge>
            )}
            {asset.isUnencumbered && (
              <Badge variant="secondary" className="text-sm">
                Unencumbered
              </Badge>
            )}
          </div>
          {asset.address && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{formatAddress(asset.address)}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              openUpSertAssetModal({
                asset,
                type: assetType,
                initialCompany: null,
                initialPerson: null,
              })
            }
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => handleDelete()}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Property Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Property Type
              </p>
              <p className="text-base font-semibold mt-1">
                {asset.propertyType || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Zoning Type
              </p>
              <p className="text-base font-semibold mt-1">
                {asset.zoningType || '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Address Status
              </p>
              <p className="text-base font-semibold mt-1">
                {asset.addressOffPlan ? (
                  <Badge variant="outline">Off Plan</Badge>
                ) : (
                  'Established'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Valuation Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Current Value
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {asset.value ? formatCurrency(asset.value) : 'Not valued'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Valuation Date
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-base font-semibold">
                  {asset.valuationDate
                    ? formatDate(new Date(asset.valuationDate))
                    : '-'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Valuation Status
              </p>
              <p className="text-base font-semibold mt-1">
                {asset.valueIsCertified ? (
                  <Badge variant="secondary">Certified</Badge>
                ) : (
                  <Badge variant="outline">Not Certified</Badge>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {asset.isInvestment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Rental Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Rental Income
                </p>
                <p className="text-xl font-bold text-green-600 mt-1">
                  {asset.rentalIncomeValue
                    ? formatCurrency(asset.rentalIncomeValue)
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Payment Frequency
                </p>
                <p className="text-base font-semibold mt-1">
                  {asset.rentalIncomeFrequency || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Property Manager
                </p>
                <p className="text-base font-semibold mt-1">
                  {asset.rentalHasAgent
                    ? asset.rentalAgentContact || 'Yes'
                    : 'Self-managed'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Ownership
          </CardTitle>
          <CardDescription>Total ownership: {totalOwnership}%</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {asset.assetPeople && asset.assetPeople.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Individual Owners
                </h4>
                <div className="space-y-2">
                  {asset.assetPeople.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(`/clients/people/${person.personId}`)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="font-medium">{person.personName}</span>
                      </div>
                      <Badge variant="secondary">{person.percent}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {asset.assetCompanies && asset.assetCompanies.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">
                  Company Owners
                </h4>
                <div className="space-y-2">
                  {asset.assetCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(`/clients/companies/${company.companyId}`)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="font-medium">
                          {company.companyName}
                        </span>
                      </div>
                      <Badge variant="secondary">{company.percent}%</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!asset.assetPeople || asset.assetPeople.length === 0) &&
              (!asset.assetCompanies || asset.assetCompanies.length === 0) && (
                <p className="text-center text-muted-foreground py-4">
                  No ownership information available
                </p>
              )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Secured Liabilities
          </CardTitle>
          <CardDescription>
            {asset.isUnencumbered
              ? 'This asset is unencumbered'
              : 'Liabilities secured against this asset'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {asset.assetLiabilities && asset.assetLiabilities.length > 0 ? (
            <div className="space-y-2">
              {asset.assetLiabilities.map((liability) => (
                <div
                  key={liability.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => handleNavigateLiability(liability)}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="font-medium">
                      {liability.liabilityName}
                    </span>
                  </div>
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">
              {asset.isUnencumbered
                ? 'No liabilities secured against this asset'
                : 'No secured liabilities'}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Record Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span>
              <span className="ml-2 font-medium">
                {asset.createdAt ? formatDate(new Date(asset.createdAt)) : '-'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="ml-2 font-medium">
                {asset.updatedAt ? formatDate(new Date(asset.updatedAt)) : '-'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AssetDetailPage
