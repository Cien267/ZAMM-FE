import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil, Trash2, Mail, Phone, Cake } from 'lucide-react'
import { usePeople } from '../../hooks/usePeople'
import { openUpSertPersonModal } from '../UpSertPerson'
import type { Person } from '../../types'
import { useAlert } from '@/contexts/AlertContext'
import { useActivityLogs } from '@/features/activity-logs/hooks/useActivityLogs'
import { useAuth } from '@/features/auth/hooks/useAuth'
import {
  ACTION_TYPE_DELETED,
  ENTITY_TYPE_PERSON,
} from '@/features/activity-logs/constants'
import { formatDate } from '@/lib/utils'

interface PersonHeaderProps {
  person: Person
}

export const PersonHeader = ({ person }: PersonHeaderProps) => {
  const navigate = useNavigate()
  const { openAlert } = useAlert()
  const { deletePerson } = usePeople()
  const { createActivityLog } = useActivityLogs()
  const { user } = useAuth()

  const handleEdit = () => {
    openUpSertPersonModal({ person })
  }

  const handleDelete = () => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete ${person.fullName} and all associated
              data.`,
      confirmText: 'Delete',
      onConfirm: () => {
        deletePerson(person.id, {
          onSuccess: () => {
            navigate('/clients/people')
          },
        })
      },
      onSuccess: () => {
        createActivityLog({
          brokerId: user?.id || '',
          brokerageId: user?.brokerageId || '',
          actionType: ACTION_TYPE_DELETED,
          entityType: ENTITY_TYPE_PERSON,
          entityId: person.id,
        })
      },
    })
  }

  const getInitials = () => {
    return `${person.firstName?.[0] || ''}${person.lastName?.[0] || ''}`.toUpperCase()
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-6 mb-8">
        <div className="h-24 w-24 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-primary-foreground shrink-0">
          {getInitials()}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{person.fullName}</h1>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            {person.email && (
              <div className="flex items-center gap-1">
                <Mail className="h-4" />
                <span>{person.email}</span>
              </div>
            )}
            {person.phoneMobile && (
              <div className="flex items-center gap-1">
                <Phone className="h-4" />
                <span>{person.phoneMobile}</span>
              </div>
            )}
            {person.dateOfBirth && (
              <div className="flex items-center gap-1">
                <Cake className="h-4" />
                <span>{formatDate(person.dateOfBirth)}</span>
              </div>
            )}
          </div>
          <div className="text-sm text-muted-foreground mt-2 ml-1">
            {person.brokerName && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Broker:</span>
                <span>{person.brokerName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
