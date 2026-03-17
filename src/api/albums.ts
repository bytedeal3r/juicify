import { apiClient } from './client'
import type { ApiAlbum, ApiPaginated } from '@/types/api.types'

export async function fetchAlbums(): Promise<ApiAlbum[]> {
  const { data } = await apiClient.get<ApiPaginated<ApiAlbum>>('/albums/')
  return Array.isArray(data?.results) ? data.results : []
}
