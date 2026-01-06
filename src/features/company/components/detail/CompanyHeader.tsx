import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Pencil, Trash2, Building2 } from 'lucide-react'
import { useCompanies } from '../../hooks/useCompanies'
import { openUpSertCompanyModal } from '../UpsertCompany'
import type { Company } from '../../types'
import { useAlert } from '@/contexts/AlertContext'

interface CompanyHeaderProps {
  company: Company
}

export const CompanyHeader = ({ company }: CompanyHeaderProps) => {
  const navigate = useNavigate()
  const { openAlert } = useAlert()
  const { deleteCompany } = useCompanies()

  const handleEdit = () => {
    openUpSertCompanyModal({ company })
  }

  const handleDelete = () => {
    openAlert({
      title: 'Are you sure?',
      description: `This action cannot be undone. This will permanently delete ${company.name} and all associated
              data.`,
      confirmText: 'Delete',
      onConfirm: () => {
        deleteCompany(company.id, {
          onSuccess: () => {
            navigate('/clients/companies')
          },
        })
      },
    })
  }

  const getInitials = () => {
    const words = company.name.split(' ')
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase()
    }
    return company.name.slice(0, 2).toUpperCase()
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
        <div className="h-24 w-24 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {getInitials()}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{company.name}</h1>
            {company.tradingName && (
              <span className="text-lg text-muted-foreground">
                (Trading as: {company.tradingName})
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {company.type && (
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>{company.type}</span>
              </div>
            )}
            {company.industry && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Industry:</span>
                <span>{company.industry}</span>
              </div>
            )}
            {company.abn && (
              <div className="flex items-center gap-1">
                <span className="font-medium">ABN:</span>
                <span>
                  {company.abn.replace(
                    /(\d{2})(\d{3})(\d{3})(\d{3})/,
                    '$1 $2 $3 $4'
                  )}
                </span>
              </div>
            )}
            {company.brokerName && (
              <div className="flex items-center gap-1">
                <span className="font-medium">Broker:</span>
                <span>{company.brokerName}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
