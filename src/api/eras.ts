import { apiClient } from './client'
import type { ApiEra, ApiPaginated } from '@/types/api.types'

export async function fetchEras(): Promise<ApiEra[]> {
  const { data } = await apiClient.get<ApiPaginated<ApiEra>>('/eras/')
  return Array.isArray(data?.results) ? data.results : []
}
