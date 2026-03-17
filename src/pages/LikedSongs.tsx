import { useEffect, useState } from 'react'
import { getLikedSongs } from '@/db/songs'
import { usePlayerStore } from '@/store/player.store'
import { useLibraryStore } from '@/store/library.store'
import { SongRow } from '@/components/cards/SongRow'
import { Skeleton } from '@/components/ui/Skeleton'
import { RadioButton } from '@/components/ui/RadioButton'
import type { DBSong } from '@/types/db.types'

export function LikedSongs() {
  const [songs, setSongs] = useState<DBSong[]>([])
  const [loading, setLoading] = useState(true)
  const { playAlbum } = usePlayerStore()
  const { likedSongIds } = useLibraryStore()

  const loadSongs = () => {
    getLikedSongs().then((s) => { setSongs(s); setLoading(false) })
  }

  useEffect(() => { loadSongs() }, [likedSongIds])

  return (
    <div className="p-6 pb-32">
      {/* Header */}
      <div
        className="rounded-2xl p-8 mb-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #00ff8822, #00d4ff11)' }}
      >
        <h1 className="text-3xl font-black text-white mb-1">Liked Songs</h1>
        <p className="text-[#a0a0b8]">{songs.length} songs</p>
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          {songs.length > 0 && (
            <button
              onClick={() => playAlbum(songs, 0, 'liked')}
              className="px-6 py-2.5 bg-[#00ff88] text-black rounded-xl font-semibold text-sm hover:bg-[#00ff88]/90 transition-colors"
            >
              ▶ Play All
            </button>
          )}
          <RadioButton />
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
        </div>
      ) : songs.length === 0 ? (
        <div className="text-center py-16 text-[#606078]">
          <p className="text-4xl mb-3">♥</p>
          <p>No liked songs yet</p>
          <p className="text-sm mt-1">Like songs while browsing to add them here</p>
        </div>
      ) : (
        <div className="space-y-1">
          {songs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} queue={songs} source="liked" />
          ))}
        </div>
      )}
    </div>
  )
}
