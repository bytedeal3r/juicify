import { apiClient } from './client'
import type { ApiCategory } from '@/types/api.types'

export async function fetchCategories(): Promise<ApiCategory[]> {
  const { data } = await apiClient.get<{ categories: ApiCategory[] }>('/categories/')
  return Array.isArray(data?.categories) ? data.categories : []
}
