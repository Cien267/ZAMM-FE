import { useState } from 'react'
import { Pencil, MailWarning } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/common/ErrorState'
import { useFirmEmailSettingsQueries } from '../hooks/useFirmEmailSettingsQueries'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { UpsertFirmEmailSetting } from '../components/UpsertFirmEmailSetting'
import { FirmEmailSettings } from '../components/FirmEmailSettings'

export const FirmEmailSettingPage = () => {
  const { useFirmEmailSettingByBrokerageId } = useFirmEmailSettingsQueries()
  const { user } = useAuth()
  const { data, error, isLoading, refetch } = useFirmEmailSettingByBrokerageId(
    user?.brokerageId || '',
    !!user?.brokerageId
  )
  const [isEditing, setIsEditing] = useState(false)

  if (isLoading) {
    return <Skeleton className="h-12 w-full" />
  }

  if (error && (error as any).statusCode !== 404) {
    return <ErrorState message={error.message} onRetry={refetch} />
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Firm Email Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your brokerage firm's email settings
          </p>
        </div>
      </div>
      {!data && !isEditing && (
        <div className="flex items-center justify-center min-h-100 w-full p-4">
          <Card className="w-full max-w-md border-dashed">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <MailWarning className="h-10 w-10 text-muted-foreground" />
              </div>
              <CardTitle className="text-xl">
                No Firm Email Settings Found
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button
                className="gap-2"
                variant={'sky'}
                onClick={() => setIsEditing(true)}
              >
                Configure Firm Email Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {isEditing ? (
        <UpsertFirmEmailSetting
          firmEmailSetting={data}
          onSubmit={() => {
            setIsEditing(false)
            refetch()
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        data && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => setIsEditing(true)}
                variant={'outline'}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </div>
            <FirmEmailSettings firmEmailSetting={data} />
          </div>
        )
      )}
    </>
  )
}

export default FirmEmailSettingPage
