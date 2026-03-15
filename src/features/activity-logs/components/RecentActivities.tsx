import { formatDistanceToNow } from 'date-fns'
import {
  User,
  Building2,
  Wallet,
  CreditCard,
  Plus,
  Edit,
  Eye,
  Trash2,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { useActivityLogQueries } from '../hooks/useActivityLogsQueries'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/ErrorState'
import {
  ACTION_TYPE_CREATED,
  ACTION_TYPE_DELETED,
  ACTION_TYPE_UPDATED,
  ACTION_TYPE_VIEWED,
  ENTITY_TYPE_ASSET,
  ENTITY_TYPE_COMPANY,
  ENTITY_TYPE_LIABILITY,
  ENTITY_TYPE_PERSON,
} from '../constants'
import type { ActivityLog } from '../types'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'

const getEntityIcon = (type: string) => {
  switch (type) {
    case ENTITY_TYPE_PERSON:
      return <User className="h-4 w-4" />
    case ENTITY_TYPE_COMPANY:
      return <Building2 className="h-4 w-4" />
    case ENTITY_TYPE_ASSET:
      return <Wallet className="h-4 w-4" />
    case ENTITY_TYPE_LIABILITY:
      return <CreditCard className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getActionStyles = (action: string) => {
  switch (action) {
    case ACTION_TYPE_CREATED:
      return {
        color: 'text-green-600 bg-green-50',
        icon: <Plus className="h-3 w-3" />,
      }
    case ACTION_TYPE_UPDATED:
      return {
        color: 'text-blue-600 bg-blue-50',
        icon: <Edit className="h-3 w-3" />,
      }
    case ACTION_TYPE_VIEWED:
      return {
        color: 'text-slate-600 bg-slate-50',
        icon: <Eye className="h-3 w-3" />,
      }
    case ACTION_TYPE_DELETED:
      return {
        color: 'text-red-600 bg-red-50',
        icon: <Trash2 className="h-3 w-3" />,
      }
    default:
      return { color: 'text-slate-600 bg-slate-50', icon: null }
  }
}

export const RecentActivities = () => {
  const { user } = useAuth()
  const { useActivityLogList } = useActivityLogQueries()
  const {
    data: activities,
    isLoading,
    error,
    refetch,
  } = useActivityLogList({
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    brokerId: user?.id || '',
    sortBy: 'CreatedAt',
    sortDescending: true,
  })

  if (isLoading) {
    return (
      <Card className="col-span-full lg:col-span-1 shadow-sm border-none bg-background/60 backdrop-blur">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  const handleNavigateToEntity = (activity: ActivityLog) => {
    let path = ''
    switch (activity.entityType) {
      case ENTITY_TYPE_PERSON:
        path = `/clients/people/${activity.entityId}`
        break
      case ENTITY_TYPE_COMPANY:
        path = `/clients/companies/${activity.entityId}`
        break
      case ENTITY_TYPE_ASSET:
        path = `/clients/assets/${activity.entityId}`
        break
      case ENTITY_TYPE_LIABILITY:
        path = `/clients/liabilities/${activity.entityId}`
        break
      default:
        path = '/'
    }
    window.location.href = path
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-125 pr-4">
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 before:w-px before:bg-border">
            {(activities?.data || []).map((activity) => {
              const styles = getActionStyles(activity.actionType)
              const isDeleted = activity.actionType.toLowerCase() === 'deleted'

              return (
                <div
                  key={activity.id}
                  className="relative flex gap-4 pl-1 group"
                >
                  <div
                    className={cn(
                      'relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm transition-colors group-hover:border-sky-500',
                      styles.color
                    )}
                  >
                    {getEntityIcon(activity.entityType)}
                  </div>

                  <div className="flex flex-col gap-1 pb-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-[10px] uppercase font-bold px-1.5 py-0 h-5 gap-1',
                          styles.color
                        )}
                      >
                        {styles.icon}
                        {activity.actionType}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-medium">
                        {formatDistanceToNow(new Date(activity.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="text-sm">
                      {isDeleted ? (
                        <span className="text-muted-foreground italic">
                          {activity.description}
                        </span>
                      ) : (
                        <div
                          onClick={() => handleNavigateToEntity(activity)}
                          className="cursor-pointer text-muted-foreground hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-4"
                        >
                          {activity.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
