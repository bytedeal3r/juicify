import { fetchStats } from '@/api/stats'
import { fetchSongsPage } from '@/api/songs'
import type { ApiSong } from '@/types/api.types'
import type { InitPhase } from './InitProgressStore'

type ProgressCallback = (phase: InitPhase, progress: number, message: string) => void

export async function fetchAllSongs(onProgress: ProgressCallback): Promise<ApiSong[]> {
  onProgress('stats', 0, 'Fetching song count...')

  let totalSongs = 2700
  try {
    const stats = await fetchStats()
    totalSongs = stats.totalSongs || 2700
  } catch {
    console.warn('Stats fetch failed, using default 2700')
  }

  const pageSize = 100
  const totalPages = Math.ceil(totalSongs / pageSize)
  const allSongs: ApiSong[] = []

  onProgress('songs', 0, `Fetching ${totalSongs} songs...`)

  const concurrency = 3
  let completed = 0

  for (let batch = 0; batch < totalPages; batch += concurrency) {
    const pageNums = Array.from(
      { length: Math.min(concurrency, totalPages - batch) },
      (_, i) => batch + i + 1
    )

    const settled = await Promise.allSettled(
      pageNums.map((page) => fetchSongsPage(page, pageSize))
    )

    for (const result of settled) {
      if (result.status === 'fulfilled') {
        const songs = result.value.results || []
        allSongs.push(...songs)
      }
      completed++
      const pct = Math.round((completed / totalPages) * 60)
      onProgress('songs', pct, `Fetched ${allSongs.length} / ~${totalSongs} songs...`)
    }

    if (batch + concurrency < totalPages) {
      await new Promise((r) => setTimeout(r, 100))
    }
  }

  return allSongs
}
