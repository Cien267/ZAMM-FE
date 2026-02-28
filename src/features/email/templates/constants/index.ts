export const emailTemplateKeys = {
  all: ['emailTemplates'] as const,
  emailTemplates: () => [...emailTemplateKeys.all, 'emailTemplates'] as const,
  emailTemplatesList: (query: any) =>
    [...emailTemplateKeys.emailTemplates(), 'list', query] as const,
  emailTemplateDetail: (id: string) =>
    [...emailTemplateKeys.emailTemplates(), 'detail', id] as const,
  emailTemplateVariables: () =>
    [...emailTemplateKeys.emailTemplates(), 'variables'] as const,
}
