import { useEffect, useState } from 'react'
import { useHistoryStore } from '@/store/history.store'
import { getSongsByIds } from '@/db/songs'
import { SongRow } from '@/components/cards/SongRow'
import { Skeleton } from '@/components/ui/Skeleton'
import type { DBSong } from '@/types/db.types'

export function RecentlyPlayed() {
  const { recentSongIds } = useHistoryStore()
  const [songs, setSongs] = useState<DBSong[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!recentSongIds.length) { setLoading(false); return }
    getSongsByIds(recentSongIds.slice(0, 10)).then((s) => {
      setSongs(s)
      setLoading(false)
    })
  }, [recentSongIds])

  if (!loading && songs.length === 0) return null

  return (
    <section>
      <h2 className="text-white font-bold text-lg mb-4">Recently Played</h2>
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
        </div>
      ) : (
        <div className="space-y-1">
          {songs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} queue={songs} source="recent" />
          ))}
        </div>
      )}
    </section>
  )
}
