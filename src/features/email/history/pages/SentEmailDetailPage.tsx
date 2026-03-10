import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useSentEmailQueries } from '../hooks/useSentEmailsQueries'
import { SentEmailHeader } from '../components/detail/SentEmailHeader'
import { SentEmailInformation } from '../components/detail/SentEmailInformation'
import { useBreadcrumbStore } from '@/store/breadcrumbStore'
import { ErrorState } from '@/components/common/ErrorState'

export const SentEmailDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { useSentEmail } = useSentEmailQueries()
  const setLabel = useBreadcrumbStore((state) => state.setLabel)

  const {
    data: sentEmail,
    isLoading: isLoadingSentEmail,
    error,
    refetch,
  } = useSentEmail(id || '', !!id)

  useEffect(() => {
    if (sentEmail?.subject && id) {
      setLabel(id, sentEmail.subject)
    }
  }, [sentEmail, id, setLabel])

  if (isLoadingSentEmail) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !sentEmail) {
    return <ErrorState message={error?.message} onRetry={refetch} />
  }

  return (
    <div className="mx-auto space-y-6">
      <SentEmailHeader email={sentEmail} />
      <SentEmailInformation email={sentEmail} />
    </div>
  )
}

export default SentEmailDetailPage
