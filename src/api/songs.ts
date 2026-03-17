import { apiClient } from './client'
import type { ApiSong, ApiPaginated } from '@/types/api.types'

export async function fetchSongsPage(
  page: number,
  pageSize = 100
): Promise<ApiPaginated<ApiSong>> {
  const { data } = await apiClient.get<ApiPaginated<ApiSong>>('/songs/', {
    params: { page, page_size: pageSize },
  })
  return data
}

export async function fetchSong(id: number): Promise<ApiSong> {
  const { data } = await apiClient.get<ApiSong>(`/songs/${id}/`)
  return data
}
