import { apiClient } from './client'
import type { ApiPaginated, ApiSong } from '@/types/api.types'

export async function fetchStats(): Promise<{ totalSongs: number }> {
  const { data } = await apiClient.get<ApiPaginated<ApiSong>>('/songs/', {
    params: { page: 1, page_size: 1 },
  })
  return { totalSongs: data.count }
}
