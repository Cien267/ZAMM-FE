import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ArrowLeft, Pencil, Trash2, Loader2 } from 'lucide-react'
import { usePeople } from '../../hooks/usePeople'
import { openUpSertPersonModal } from '../UpSertPerson'
import type { Person } from '../../types'

interface PersonHeaderProps {
  person: Person
}

export const PersonHeader = ({ person }: PersonHeaderProps) => {
  const navigate = useNavigate()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { deletePerson, isDeletingPerson } = usePeople()

  const handleEdit = () => {
    openUpSertPersonModal({ person })
  }

  const handleDelete = () => {
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    deletePerson(person.id, {
      onSuccess: () => {
        navigate('/clients/people')
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/clients/people')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to People
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
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {person.email && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Email:</span>
                <span>{person.email}</span>
              </div>
            )}
            {person.phoneMobile && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Phone:</span>
                <span>{person.phoneMobile}</span>
              </div>
            )}
            {person.brokerName && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Broker:</span>
                <span>{person.brokerName}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{' '}
              {person.fullName} and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingPerson}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeletingPerson}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingPerson ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
