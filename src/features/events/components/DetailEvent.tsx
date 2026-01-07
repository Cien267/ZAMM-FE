import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import {
  Calendar,
  User,
  Info,
  Repeat,
  FileText,
  Database,
  Link as LinkIcon,
  Paperclip,
  Loader2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { type Event } from '../types'
import { Modal } from '@/components/common/modal'
import { CUSTOM_EVENT, LIABILITY_MODIFIED_EVENT } from '../constants'
import { useAlert } from '@/contexts/AlertContext'
import { useEvents } from '../hooks/useEvents'
import { openUpSertEventModal } from '../components/UpsertEvent'
import { useEventQueries } from '../hooks/useEventsQueries'
import { ErrorState } from '@/components/common/ErrorState'

interface EventFormDialogProps {
  id: string
  type: 'person' | 'company' | 'liability'
  parentId?: string
  onClose: () => void
}

export const DetailEventModalContent = ({
  id,
  type,
  parentId,
  onClose,
}: EventFormDialogProps) => {
  const { openAlert } = useAlert()
  const { useEvent } = useEventQueries()
  const {
    data: event,
    isLoading: isLoadingEvent,
    error,
  } = useEvent(id || '', !!id)
  const { deleteEvent, toggleDismissEvent } = useEvents()
  if (isLoadingEvent) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !event) {
    return <ErrorState message={error?.message} />
  }

  const isCustom = event.type === CUSTOM_EVENT
  const isLiabilityModified = event.type === LIABILITY_MODIFIED_EVENT

  const onToggleDismiss = async (event: Event) => {
    await toggleDismissEvent(event.id)
  }

  const onDeleteConfirm = (event: Event) => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete the event "${event.title}".`,
      confirmText: 'Delete',
      onConfirm: async () => {
        await deleteEvent(event.id, {
          onSuccess: () => {
            onClose()
          },
        })
      },
    })
  }

  return (
    <>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Badge variant={event.isSystem ? 'secondary' : 'outline'}>
              {event.type.replace(/_/g, ' ')}
            </Badge>
            {event.isSystem && (
              <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-none">
                System Generated
              </Badge>
            )}
            {event.isDismissed && <Badge variant={'muted'}>Dismissed</Badge>}
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(new Date(event.date), 'PPP')}
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              Added by <strong>{event.addedByUserName || 'Unknown'}</strong>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            Description
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {event.description || 'No description provided.'}
          </p>
        </div>

        {isCustom && event.isRepeating && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              Recurrence Rules
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Repeat Every</span>{' '}
                <span className="font-medium">
                  {event.repeatNumber} {event.repeatUnit}
                </span>
              </div>
              {event.repeatingDateDismissed && (
                <div>
                  <p className="text-muted-foreground">Dismissed On</p>
                  <p className="font-medium">
                    {format(new Date(event.repeatingDateDismissed), 'PP')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {isLiabilityModified && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Database className="h-4 w-4" />
              Modification Data
            </h4>
            <div className="grid gap-3">
              {event.modifiedValuesJson && (
                <div className="rounded-md bg-zinc-950 p-4 overflow-x-auto">
                  <pre className="text-xs text-zinc-400 font-mono">
                    {JSON.stringify(
                      JSON.parse(event.modifiedValuesJson),
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {(event.liabilityName || event.personName || event.companyName) && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Associated Entities
            </h4>
            <div className="flex flex-wrap gap-2">
              {event.liabilityName && (
                <Badge variant="secondary">
                  Liability: {event.liabilityName}
                </Badge>
              )}
              {event.personName && (
                <Badge variant="secondary">Person: {event.personName}</Badge>
              )}
              {event.companyName && (
                <Badge variant="secondary">Company: {event.companyName}</Badge>
              )}
            </div>
          </div>
        )}

        {event.files && event.files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Attachments ({event.files.length})
            </h4>
            <div className="grid gap-2">
              {event.files.map((file, idx) => (
                <a
                  key={idx}
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 rounded-md border border-input bg-background hover:bg-accent transition-colors group"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm truncate max-w-50">
                      {file.fileName}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground group-hover:text-primary underline">
                    Download
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3 pt-10">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => onToggleDismiss(event)}
        >
          {event.isDismissed ? 'Un-dismiss' : 'Dismiss'}
        </Button>
        <Button
          type="button"
          onClick={() => {
            onClose()
            openUpSertEventModal({
              event,
              type: type,
              parentId: parentId,
            })
          }}
        >
          Edit
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => onDeleteConfirm(event)}
        >
          Delete
        </Button>
      </div>
    </>
  )
}

export const openDetailEventModal = ({
  event,
  type,
  parentId,
}: {
  event: Event
  type: 'person' | 'company' | 'liability'
  parentId?: string
}) => {
  const updateFooter = () => {
    Modal.open({
      title: event.title,
      content: (
        <DetailEventModalContent
          id={event.id}
          type={type}
          parentId={parentId}
          onClose={() => Modal.close()}
        />
      ),
      className: 'max-w-3xl!',
    })
  }

  updateFooter()
}
