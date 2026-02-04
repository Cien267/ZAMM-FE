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
  DollarSign,
  Calendar,
  Users,
  Building2,
  Link as LinkIcon,
  CreditCard,
  Percent,
  Clock,
  BadgePercent,
} from 'lucide-react'
import { useLiabilityQueries } from '../hooks/useLiabilityQueries'
import { useLiabilities } from '../hooks/useLiabilities'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useBreadcrumbStore } from '@/store/breadcrumbStore'
import { openUpSertLiabilityModal } from '../components/UpsertLiability'
import { useAlert } from '@/contexts/AlertContext'
import { EventTimeline } from '@/features/events/components/EventTimeline'
import { useSearchParams } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { calculateEffectiveInterestRate } from '@/lib/liabilitySupport'
import { useEvents } from '@/features/events/hooks/useEvents'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ASSET_DELETE_EVENT } from '@/features/events/constants'
import { useActivityLogs } from '@/features/activity-logs/hooks/useActivityLogs'
import {
  ENTITY_TYPE_LIABILITY,
  ACTION_TYPE_DELETED,
} from '@/features/activity-logs/constants'

export const LiabilityDetailPage = () => {
  const { liabilityId } = useParams<{ liabilityId: string }>()
  const navigate = useNavigate()
  const { openAlert } = useAlert()
  const { createEvent } = useEvents()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const setLabel = useBreadcrumbStore((state) => state.setLabel)

  const personId = searchParams.get('personId')
  const companyId = searchParams.get('companyId')

  const { useLiability } = useLiabilityQueries()
  const { deleteLiability } = useLiabilities()
  const { createActivityLog } = useActivityLogs()
  const {
    data: liability,
    isLoading,
    error,
    refetch,
  } = useLiability(liabilityId || '', !!liabilityId)

  useEffect(() => {
    if (liability?.name && liabilityId) {
      setLabel(liabilityId, liability.name)
    }
  }, [liability, liabilityId, setLabel])

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error || !liability) {
    return <ErrorState message={error?.message} onRetry={refetch} />
  }

  const liabilityType =
    (liability.liabilityPeople?.length || 0) > 0 ? 'person' : 'company'

  const handleDelete = () => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete ${liability.name} and all associated
               data.`,
      confirmText: 'Delete',
      showTimelineCheckbox: true,
      onConfirm: () => {
        deleteLiability(liability.id, {
          onSuccess: () => {
            navigate(-1)
          },
        })
      },
      onSuccess: (reason?: string) => {
        createEvent({
          title: `Delete Liability ${liability.name}`,
          description: reason,
          type: ASSET_DELETE_EVENT,
          date: new Date(),
          isSystem: false,
          isRepeating: false,
          isDismissed: false,
          repeatingDateDismissed: undefined,
          addedByUserId: user?.id || '',
          personId:
            liabilityType === 'person' && liability.liabilityPeople
              ? liability.liabilityPeople[0].personId
              : undefined,
          companyId:
            liabilityType === 'company' && liability.liabilityCompanies
              ? liability.liabilityCompanies[0].companyId
              : undefined,
        })
        createActivityLog({
          brokerId: user?.id || '',
          brokerageId: user?.brokerageId || '',
          actionType: ACTION_TYPE_DELETED,
          entityType: ENTITY_TYPE_LIABILITY,
          entityId: liability.id,
        })
      },
    })
  }

  const totalBorrowerPercent =
    (liability.liabilityPeople?.reduce((sum, p) => sum + p.percent, 0) || 0) +
    (liability.liabilityCompanies?.reduce((sum, c) => sum + c.percent, 0) || 0)

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
            <h1 className="text-3xl font-bold tracking-tight">
              {liability.name || 'Unnamed Liability'}
            </h1>
            {liability.financePurpose && (
              <Badge variant="secondary" className="text-sm">
                {liability.financePurpose}
              </Badge>
            )}
          </div>
          {liability.lenderName && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{liability.lenderName}</span>
            </div>
          )}
          {liability.lenderName && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <BadgePercent className="h-4 w-4" />
              <span>
                Effective Rate:{' '}
                <span className="font-bold text-sky-600">
                  {calculateEffectiveInterestRate({
                    loan: liability.loan,
                    financePurpose: liability.financePurpose || 'Investment',
                    commencementDate: liability.startDate
                      ? new Date(liability.startDate)
                      : null,
                    interestOnlyTerm: liability.interestOnlyTerm,
                    discountPercent: liability.discountPercent,
                    introRateYears: liability.introRateYears,
                    introRatePercent: liability.introRatePercent,
                    settlementRate: liability.settlementRate,
                    fixedRatePeriods: liability.fixedRatePeriods,
                  })?.rate || 0}
                  %
                </span>
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              openUpSertLiabilityModal({
                liability: liability,
                type: liabilityType,
                initialCompany: null,
                initialPerson: null,
                initialAsset: null,
              })
            }}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="space-y-6 w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Initial Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {liability.initialBalance
                    ? formatCurrency(liability.initialBalance)
                    : '-'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {liability.amount ? formatCurrency(liability.amount) : '-'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Settlement Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {liability.settlementRate
                    ? `${liability.settlementRate}%`
                    : '-'}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Loan Name
                  </p>
                  <p className="text-base font-semibold mt-1">
                    {liability.loan.name || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Start Date
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base font-semibold">
                      {liability.startDate
                        ? formatDate(new Date(liability.startDate))
                        : '-'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Loan Term
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <p className="text-base font-semibold">
                      {liability.loanTerm ? `${liability.loanTerm} years` : '-'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Interest Only Term
                  </p>
                  <p className="text-base font-semibold mt-1">
                    {liability.interestOnlyTerm
                      ? `${liability.interestOnlyTerm} years`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Finance Purpose
                  </p>
                  <p className="text-base font-semibold mt-1">
                    {liability.financePurpose || '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Repayment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Repayment Amount
                  </p>
                  <p className="text-xl font-bold text-red-600 mt-1">
                    {liability.repaymentAmount
                      ? formatCurrency(liability.repaymentAmount)
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Repayment Frequency
                  </p>
                  <p className="text-base font-semibold mt-1">
                    {liability.repaymentFrequency || '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5" />
                Interest Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Settlement Rate
                  </p>
                  <p className="text-xl font-bold mt-1">
                    {liability.settlementRate
                      ? `${liability.settlementRate}%`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Discount
                  </p>
                  <p className="text-xl font-bold text-green-600 mt-1">
                    {liability.discountPercent
                      ? `${liability.discountPercent}%`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Intro Rate
                  </p>
                  <p className="text-base font-semibold mt-1">
                    {liability.introRatePercent
                      ? `${liability.introRatePercent}%`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Intro Period
                  </p>
                  <p className="text-base font-semibold mt-1">
                    {liability.introRateYears
                      ? `${liability.introRateYears} years`
                      : '-'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {liability.fixedRatePeriods &&
            liability.fixedRatePeriods.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Fixed Rate Periods
                  </CardTitle>
                  <CardDescription>
                    Historical and upcoming fixed rate periods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {liability.fixedRatePeriods.map((period) => (
                      <div
                        key={period.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {formatDate(new Date(period.startDate))}
                            </span>
                          </div>
                          <Badge variant="outline">{period.term} years</Badge>
                        </div>
                        {period.customRate && (
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Custom Rate
                            </p>
                            <p className="font-bold">{period.customRate}%</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {(liability.bankAccountName ||
            liability.bankAccountBsb ||
            liability.offsetAccountBsb) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Bank Account Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Repayment Account
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Account Name
                        </p>
                        <p className="text-sm font-medium">
                          {liability.bankAccountName || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">BSB</p>
                        <p className="text-sm font-medium font-mono">
                          {liability.bankAccountBsb || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Account Number
                        </p>
                        <p className="text-sm font-medium font-mono">
                          {liability.bankAccountNumber || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      Offset Account
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground">BSB</p>
                        <p className="text-sm font-medium font-mono">
                          {liability.offsetAccountBsb || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Account Number
                        </p>
                        <p className="text-sm font-medium font-mono">
                          {liability.offsetAccountNumber || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Borrowers
              </CardTitle>
              <CardDescription>
                Total borrower percentage: {totalBorrowerPercent}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {liability.liabilityPeople &&
                  liability.liabilityPeople.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        Individual Borrowers
                      </h4>
                      <div className="space-y-2">
                        {liability.liabilityPeople.map((person) => (
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
                              <span className="font-medium">
                                {person.personName}
                              </span>
                            </div>
                            <Badge variant="secondary">{person.percent}%</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {liability.liabilityCompanies &&
                  liability.liabilityCompanies.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        Company Borrowers
                      </h4>
                      <div className="space-y-2">
                        {liability.liabilityCompanies.map((company) => (
                          <div
                            key={company.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                            onClick={() =>
                              navigate(
                                `/clients/companies/${company.companyId}`
                              )
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
                            <Badge variant="secondary">
                              {company.percent}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {(!liability.liabilityPeople ||
                  liability.liabilityPeople.length === 0) &&
                  (!liability.liabilityCompanies ||
                    liability.liabilityCompanies.length === 0) && (
                    <p className="text-center text-muted-foreground py-4">
                      No borrower information available
                    </p>
                  )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                Secured Assets
              </CardTitle>
              <CardDescription>Assets securing this liability</CardDescription>
            </CardHeader>
            <CardContent>
              {liability.liabilityAssets &&
              liability.liabilityAssets.length > 0 ? (
                <div className="space-y-2">
                  {liability.liabilityAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() =>
                        navigate(`/clients/assets/${asset.assetId}`)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="font-medium">{asset.assetName}</span>
                      </div>
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No secured assets
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
                    {liability.createdAt
                      ? formatDate(new Date(liability.createdAt))
                      : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Last Updated:</span>
                  <span className="ml-2 font-medium">
                    {liability.updatedAt
                      ? formatDate(new Date(liability.updatedAt))
                      : '-'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-1/4 ml-10">
          <EventTimeline
            type="liability"
            exportTitle={liability.name || ''}
            personId={personId}
            companyId={companyId}
            liabilityId={liability.id}
            height="h-full"
          />
        </div>
      </div>
    </div>
  )
}

export default LiabilityDetailPage
