import { create } from 'zustand'
import { addHistoryEntry, getRecentHistory, getTopSongsForWeek } from '@/db/history'
import { putPlaylist, getSystemPlaylist } from '@/db/playlists'
import { getMeta, setMeta } from '@/db'
import { getWeekKey } from '@/utils/weekOfYear'
import type { DBPlaylist } from '@/types/db.types'

interface HistoryStore {
  recentSongIds: number[]
  weeklyTopIds: number[]
  lastWeeklyBuild: string | null
  weeklyPlaylist: DBPlaylist | null

  recordPlay: (songId: number, durationListened: number) => Promise<void>
  loadRecent: () => Promise<void>
  buildWeeklyPlaylist: () => Promise<void>
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  recentSongIds: [],
  weeklyTopIds: [],
  lastWeeklyBuild: null,
  weeklyPlaylist: null,

  recordPlay: async (songId, durationListened) => {
    const weekKey = getWeekKey()
    await addHistoryEntry({ songId, playedAt: Date.now(), durationListened, weekKey })
    set((s) => ({
      recentSongIds: [songId, ...s.recentSongIds.filter((id) => id !== songId)].slice(0, 50),
    }))
  },

  loadRecent: async () => {
    const history = await getRecentHistory(50)
    const seen = new Set<number>()
    const ids: number[] = []
    for (const h of history) {
      if (!seen.has(h.songId)) {
        seen.add(h.songId)
        ids.push(h.songId)
      }
    }
    set({ recentSongIds: ids })

    const weekKey = getWeekKey()
    const existing = await getSystemPlaylist(`weekly-${weekKey}`)
    if (existing) {
      set({ weeklyPlaylist: existing, weeklyTopIds: existing.songIds })
    }
  },

  buildWeeklyPlaylist: async () => {
    const weekKey = getWeekKey()
    const top = await getTopSongsForWeek(weekKey, 20)
    if (top.length < 3) return

    const topIds = top.map((t) => t.songId)
    const playlistId = `weekly-${weekKey}`
    const playlist: DBPlaylist = {
      id: playlistId,
      name: `Top Played — Week ${weekKey}`,
      description: 'Your most played songs this week',
      coverImageUrl: null,
      songIds: topIds,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isSystem: true,
      systemKey: `weekly-${weekKey}`,
    }
    await putPlaylist(playlist)
    await setMeta('lastWeeklyBuild', weekKey)
    set({ weeklyTopIds: topIds, lastWeeklyBuild: weekKey, weeklyPlaylist: playlist })
  },
}))
