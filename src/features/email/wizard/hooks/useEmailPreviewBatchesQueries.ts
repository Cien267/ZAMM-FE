import { useQuery } from '@tanstack/react-query'
import { emailPreviewBatchService } from '../services/emailPreviewBatchService'
import { emailPreviewBatchKeys } from '../constants'

export const useEmailPreviewBatchQueries = () => {
  const useEmailPreviewBatch = (id: string, enabled = true) => {
    return useQuery({
      queryKey: emailPreviewBatchKeys.emailPreviewBatchDetail(id),
      queryFn: () => emailPreviewBatchService.getEmailPreviewBatch(id),
      enabled: enabled && !!id,
    })
  }

  return {
    useEmailPreviewBatch,
  }
}
