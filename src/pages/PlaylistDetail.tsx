import { useParams } from 'react-router-dom'
import { usePlaylist } from '@/hooks/usePlaylist'
import { usePlayerStore } from '@/store/player.store'
import { useLibraryStore } from '@/store/library.store'
import { SongRow } from '@/components/cards/SongRow'
import { Skeleton } from '@/components/ui/Skeleton'
import { getFallbackCover } from '@/utils/coverArt'

export function PlaylistDetail() {
  const { id } = useParams<{ id: string }>()
  const { playlist, songs, loading } = usePlaylist(id!)
  const { playAlbum } = usePlayerStore()
  const { deletePlaylist } = useLibraryStore()

  if (loading) {
    return (
      <div className="p-6 space-y-4 pb-32">
        <Skeleton className="h-48 rounded-2xl" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-64 text-[#606078]">Playlist not found</div>
    )
  }

  const cover = playlist.coverImageUrl || getFallbackCover(playlist.name)

  return (
    <div className="pb-32">
      {/* Header */}
      <div
        className="p-8 relative"
        style={{ background: 'linear-gradient(135deg, #bf5fff22, #00d4ff11)' }}
      >
        <div className="flex items-end gap-6">
          <div
            className="w-32 h-32 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #bf5fff, #00d4ff)' }}
          >
            <span className="text-5xl">♪</span>
          </div>
          <div>
            <p className="text-[#a0a0b8] text-xs uppercase tracking-wider mb-1">Playlist</p>
            <h1 className="text-white text-3xl font-black">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-[#a0a0b8] text-sm mt-1">{playlist.description}</p>
            )}
            <p className="text-[#606078] text-sm mt-2">{songs.length} songs</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 flex gap-3">
        {songs.length > 0 && (
          <button
            onClick={() => playAlbum(songs, 0, playlist.id)}
            className="px-6 py-2.5 bg-[#bf5fff] text-white rounded-xl font-medium text-sm hover:bg-[#bf5fff]/90 transition-colors"
          >
            ▶ Play All
          </button>
        )}
        {!playlist.isSystem && (
          <button
            onClick={() => deletePlaylist(playlist.id)}
            className="px-6 py-2.5 bg-white/5 text-[#ff4444] rounded-xl text-sm hover:bg-white/10 transition-colors"
          >
            Delete
          </button>
        )}
      </div>

      {/* Songs */}
      <div className="px-3">
        {songs.length === 0 ? (
          <div className="text-center py-16 text-[#606078]">
            <p>No songs in this playlist</p>
            <p className="text-sm mt-1">Right-click any song to add it here</p>
          </div>
        ) : (
          songs.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} queue={songs} source={playlist.id} />
          ))
        )}
      </div>
    </div>
  )
}
