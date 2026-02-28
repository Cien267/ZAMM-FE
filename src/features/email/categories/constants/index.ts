export const emailCategoryKeys = {
  all: ['emailCategories'] as const,
  emailCategories: () => [...emailCategoryKeys.all, 'emailCategories'] as const,
  emailCategoriesList: (query: any) =>
    [...emailCategoryKeys.emailCategories(), 'list', query] as const,
  emailCategoryDetail: (id: string) =>
    [...emailCategoryKeys.emailCategories(), 'detail', id] as const,
}
