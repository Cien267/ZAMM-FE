import { useQuery } from '@tanstack/react-query'
import { emailCategoryService } from '../services/emailCategoriesService'
import type { EmailCategoryQuery } from '../types'
import { emailCategoryKeys } from '../constants'

export const useEmailCategoryQueries = () => {
  const useAllEmailCategories = (query: EmailCategoryQuery) => {
    return useQuery({
      queryKey: emailCategoryKeys.emailCategoriesList(query),
      queryFn: () => emailCategoryService.getAllEmailCategories(query),
    })
  }

  const useEmailCategoriesList = (query: EmailCategoryQuery) => {
    return useQuery({
      queryKey: emailCategoryKeys.emailCategoriesList(query),
      queryFn: () => emailCategoryService.getEmailCategories(query),
    })
  }

  const useEmailCategory = (id: string, enabled = true) => {
    return useQuery({
      queryKey: emailCategoryKeys.emailCategoryDetail(id),
      queryFn: () => emailCategoryService.getEmailCategory(id),
      enabled: enabled && !!id,
    })
  }

  return {
    useAllEmailCategories,
    useEmailCategoriesList,
    useEmailCategory,
  }
}
