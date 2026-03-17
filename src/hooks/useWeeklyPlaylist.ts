import { useEffect } from 'react'
import { useHistoryStore } from '@/store/history.store'

export function useWeeklyPlaylist() {
  const { weeklyPlaylist, weeklyTopIds, buildWeeklyPlaylist } = useHistoryStore()

  useEffect(() => {
    buildWeeklyPlaylist()
  }, [])

  return { weeklyPlaylist, weeklyTopIds }
}
