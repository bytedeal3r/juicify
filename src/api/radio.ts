import { apiClient } from './client'
import type { ApiSong } from '@/types/api.types'

interface RadioResponse {
  id: string
  title: string
  path: string
  song: ApiSong
}

async function fetchOneRadioSong(): Promise<ApiSong> {
  const { data } = await apiClient.get<RadioResponse>('/radio/random/')
  return data.song
}

export async function fetchRadioSongs(count = 25): Promise<ApiSong[]> {
  const results = await Promise.allSettled(
    Array.from({ length: count }, () => fetchOneRadioSong())
  )
  return results
    .filter((r): r is PromiseFulfilledResult<ApiSong> => r.status === 'fulfilled')
    .map((r) => r.value)
}
