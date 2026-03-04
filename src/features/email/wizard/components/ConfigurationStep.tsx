import { useState, useMemo } from 'react'
import { Users, Building2, Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  useAllPeople,
  useAllCompanies,
  useAllEmailTemplates,
} from '@/hooks/useSharedData'
import { RECIPIENT_TYPES } from '../constants'
import type { Person } from '@/features/people/types'
import type { Company } from '@/features/companies/types'
import type { CreateRecipientInput } from '../types'
import type { RecipientType } from '../../history/types'
import { useFirmEmailSettingsQueries } from '@/features/email/firm-settings/hooks/useFirmEmailSettingsQueries'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function ConfigurationStep({
  onNext,
  selectedTemplate,
  setTemplate,
  selectedRecipients,
  setRecipients,
}: any) {
  const [searchTermPeople, setSearchTermPeople] = useState('')
  const [searchTermCompanies, setSearchTermCompanies] = useState('')
  const { useFirmEmailSettingByBrokerageId } = useFirmEmailSettingsQueries()
  const { user } = useAuth()
  const { data: firmEmailSetting } = useFirmEmailSettingByBrokerageId(
    user?.brokerageId || '',
    !!user?.brokerageId
  )
  const { data: templates = [] } = useAllEmailTemplates({})
  const { data: people = [] } = useAllPeople()
  const { data: companies = [] } = useAllCompanies()

  const toggleRecipient = <T extends Person | Company>(
    entity: T,
    type: RecipientType,
    getName: (item: T) => string
  ) => {
    setRecipients((prev: CreateRecipientInput[]) => {
      const exists = prev.some((r) => r.id === entity.id && r.type === type)

      if (exists) {
        return prev.filter((r) => !(r.id === entity.id && r.type === type))
      }

      return [
        ...prev,
        {
          id: entity.id,
          email: entity.email,
          name: getName(entity),
          type,
        },
      ]
    })
  }
  const handleSelectAll = <T extends Person | Company>(
    items: T[],
    type: RecipientType,
    getName: (item: T) => string
  ) => {
    const mapped = items.map((item) => ({
      id: item.id,
      email: item.email,
      name: getName(item),
      type,
    }))

    setRecipients((prev: CreateRecipientInput[]) => {
      const alreadySelectedCount = prev.filter((r) => r.type === type).length

      const allSelected = alreadySelectedCount === items.length

      if (allSelected) {
        return prev.filter((r) => r.type !== type)
      }

      const withoutType = prev.filter((r) => r.type !== type)

      return [...withoutType, ...mapped]
    })
  }

  const filteredPeople = people?.filter(
    (p: Person) =>
      p.email &&
      (p.fullName?.toLowerCase().includes(searchTermPeople.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTermPeople.toLowerCase()))
  )

  const filteredCompanies = companies?.filter(
    (c: Company) =>
      c.email &&
      (c.name?.toLowerCase().includes(searchTermCompanies.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTermCompanies.toLowerCase()))
  )

  const selectedByType = useMemo(() => {
    return {
      people: selectedRecipients.filter(
        (r: CreateRecipientInput) => r.type === RECIPIENT_TYPES.PERSON
      ),
      companies: selectedRecipients.filter(
        (r: CreateRecipientInput) => r.type === RECIPIENT_TYPES.COMPANY
      ),
    }
  }, [selectedRecipients])

  return (
    <div className="grid grid-cols-1 gap-8 py-4">
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={!selectedTemplate || selectedRecipients.length === 0}
          className="bg-blue-600 hover:bg-blue-700 px-8"
        >
          Generate Preview
          <ArrowRight />
        </Button>
      </div>
      <div className="space-y-3">
        <Label>
          Email Template <span className="text-destructive">*</span>
        </Label>
        <Select
          onValueChange={(value) => {
            setTemplate(value)
          }}
          value={selectedTemplate || ''}
        >
          <SelectTrigger className="w-1/4">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>
          Firm Setting <span className="text-destructive">*</span>
        </Label>
        <div className="flex items-center justify-start gap-16">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Firm Name
            </p>
            <p className="font-medium text-sm p-4 border rounded-2xl">
              {firmEmailSetting?.firmName}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Display Name
            </p>
            <p className="font-medium text-sm p-4 border rounded-2xl">
              {firmEmailSetting?.fromName}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Sender Email
            </p>
            <p className="font-medium text-sm p-4 border rounded-2xl">
              {firmEmailSetting?.fromEmail}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>
          Select Recipients <span className="text-destructive">*</span>
        </Label>
        <div className="flex justify-between items-start gap-6">
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-500" />
                people ({selectedByType.people.length} selected)
              </Label>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search for people..."
                    className="pl-8!"
                    value={searchTermPeople}
                    onChange={(e) => setSearchTermPeople(e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleSelectAll(
                      people,
                      RECIPIENT_TYPES.PERSON as RecipientType,
                      (p) => p.fullName
                    )
                  }
                >
                  {selectedByType.people.length === people?.length
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <ScrollArea className="h-full">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr className="border-b">
                      <th className="p-3 text-left w-10"></th>
                      <th className="p-3 text-left font-semibold">Full Name</th>
                      <th className="p-3 text-left font-semibold">
                        Email Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPeople?.map((person: Person) => (
                      <tr
                        key={person.id}
                        className="border-b last:border-0 hover:bg-slate-50 cursor-pointer"
                        onClick={() =>
                          toggleRecipient(
                            person,
                            RECIPIENT_TYPES.PERSON as RecipientType,
                            (p) => p.fullName
                          )
                        }
                      >
                        <td
                          className="p-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={selectedRecipients.some(
                              (r: CreateRecipientInput) =>
                                r.id === person.id &&
                                r.type === RECIPIENT_TYPES.PERSON
                            )}
                            onCheckedChange={() =>
                              toggleRecipient(
                                person,
                                RECIPIENT_TYPES.PERSON as RecipientType,
                                (p) => p.fullName
                              )
                            }
                          />
                        </td>
                        <td className="p-3 font-medium">{person.fullName}</td>
                        <td className="p-3 text-slate-500">{person.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          </div>
          <div className="space-y-3 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-500" />
                Select companies ({selectedByType.companies.length} selected)
              </Label>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search companies..."
                    className="pl-8!"
                    value={searchTermCompanies}
                    onChange={(e) => setSearchTermCompanies(e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleSelectAll(
                      companies,
                      RECIPIENT_TYPES.COMPANY as RecipientType,
                      (p) => p.name
                    )
                  }
                >
                  {selectedByType.companies.length === companies?.length
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
              </div>
            </div>

            <div className="border rounded-md">
              <ScrollArea className="h-full">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr className="border-b">
                      <th className="p-3 text-left w-10"></th>
                      <th className="p-3 text-left font-semibold">Name</th>
                      <th className="p-3 text-left font-semibold">
                        Email Address
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies?.map((company: Company) => (
                      <tr
                        key={company.id}
                        className="border-b last:border-0 hover:bg-slate-50 cursor-pointer"
                        onClick={() =>
                          toggleRecipient(
                            company,
                            RECIPIENT_TYPES.COMPANY as RecipientType,
                            (c) => c.name
                          )
                        }
                      >
                        <td
                          className="p-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={selectedRecipients.some(
                              (r: CreateRecipientInput) =>
                                r.id === company.id &&
                                r.type === RECIPIENT_TYPES.COMPANY
                            )}
                            onCheckedChange={() =>
                              toggleRecipient(
                                company,
                                RECIPIENT_TYPES.COMPANY as RecipientType,
                                (c) => c.name
                              )
                            }
                          />
                        </td>
                        <td className="p-3 font-medium">{company.name}</td>
                        <td className="p-3 text-slate-500">{company.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
