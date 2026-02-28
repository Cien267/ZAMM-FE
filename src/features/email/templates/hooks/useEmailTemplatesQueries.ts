import { useQuery } from '@tanstack/react-query'
import { emailTemplateService } from '../services/emailTemplatesService'
import type { EmailTemplateQuery } from '../types'
import { emailTemplateKeys } from '../constants'

export const useEmailTemplateQueries = () => {
  const useAllEmailTemplates = (query: EmailTemplateQuery) => {
    return useQuery({
      queryKey: emailTemplateKeys.emailTemplatesList(query),
      queryFn: () => emailTemplateService.getAllEmailTemplates(query),
    })
  }

  const useEmailTemplatesList = (query: EmailTemplateQuery) => {
    return useQuery({
      queryKey: emailTemplateKeys.emailTemplatesList(query),
      queryFn: () => emailTemplateService.getEmailTemplates(query),
    })
  }

  const useEmailTemplate = (id: string, enabled = true) => {
    return useQuery({
      queryKey: emailTemplateKeys.emailTemplateDetail(id),
      queryFn: () => emailTemplateService.getEmailTemplate(id),
      enabled: enabled && !!id,
    })
  }

  const useEmailTemplateVariables = () => {
    return useQuery({
      queryKey: emailTemplateKeys.emailTemplateVariables(),
      queryFn: () => emailTemplateService.getEmailTemplateVariables(),
    })
  }

  return {
    useAllEmailTemplates,
    useEmailTemplatesList,
    useEmailTemplate,
    useEmailTemplateVariables,
  }
}
