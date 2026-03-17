import { apiClient } from './client'

export async function getPlayUrl(songId: number): Promise<{ url: string }> {
  const { data } = await apiClient.get<{ url: string }>(`/songs/${songId}/play/`)
  return data
}
