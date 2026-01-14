import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useLenders } from '../../hooks/useLenders'
import { openUpSertLenderModal } from '../UpSertLender'
import type { Lender } from '../../types'
import { useAlert } from '@/contexts/AlertContext'

interface LenderHeaderProps {
  lender: Lender
}

export const LenderHeader = ({ lender }: LenderHeaderProps) => {
  const navigate = useNavigate()
  const { openAlert } = useAlert()
  const { deleteLender } = useLenders()

  const handleEdit = () => {
    openUpSertLenderModal({ lender })
  }

  const handleDelete = () => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete ${lender.name} and all associated
              data.`,
      confirmText: 'Delete',
      onConfirm: () => {
        deleteLender(lender.id, {
          onSuccess: () => {
            navigate('/admin/lenders')
          },
        })
      },
    })
  }

  const getInitials = () => {
    return `${lender.name?.[0] || ''}`.toUpperCase()
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

      <div className="flex items-center gap-6 mb-8">
        <div className="h-24 w-24 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-primary-foreground shrink-0">
          {getInitials()}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{lender.name}</h1>
        </div>
      </div>
    </>
  )
}
