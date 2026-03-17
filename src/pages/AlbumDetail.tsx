import { useParams } from 'react-router-dom'
import { useAlbum } from '@/hooks/useAlbum'
import { usePlayerStore } from '@/store/player.store'
import { SongRow } from '@/components/cards/SongRow'
import { Skeleton } from '@/components/ui/Skeleton'
import { NeonBadge } from '@/components/ui/NeonBadge'
import { getFallbackCover } from '@/utils/coverArt'
import type { AlbumType } from '@/types/db.types'

const typeColors: Record<AlbumType, 'purple' | 'blue' | 'green'> = {
  official: 'purple',
  era: 'blue',
  category: 'green',
}

export function AlbumDetail() {
  const { id } = useParams<{ id: string }>()
  const { album, songs, loading } = useAlbum(id!)
  const { playAlbum } = usePlayerStore()

  if (loading) {
    return (
      <div className="p-6 space-y-6 pb-32">
        <Skeleton className="h-48 rounded-2xl" />
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
        </div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="flex items-center justify-center h-64 text-[#606078]">
        Album not found
      </div>
    )
  }

  const cover = album.coverImageUrl || getFallbackCover(album.title)

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="relative">
        <div
          className="h-64 bg-cover bg-center"
          style={{ backgroundImage: `url(${cover})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0f]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-4">
          <img
            src={cover}
            alt={album.title}
            className="w-24 h-24 rounded-xl object-cover flex-shrink-0 border-2 border-white/10"
            onError={(e) => { (e.target as HTMLImageElement).src = getFallbackCover(album.title) }}
          />
          <div className="flex-1 min-w-0">
            <NeonBadge label={album.type} color={typeColors[album.type]} />
            <h1 className="text-white text-2xl font-black mt-1 truncate">{album.title}</h1>
            <p className="text-[#a0a0b8] text-sm">{album.trackCount} songs · {album.releaseDate || 'Unknown date'}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 flex gap-3">
        <button
          onClick={() => playAlbum(songs, 0, album.id)}
          className="px-6 py-2.5 bg-[#bf5fff] text-white rounded-xl font-medium text-sm hover:bg-[#bf5fff]/90 transition-colors"
          style={{ boxShadow: '0 0 20px rgba(191,95,255,0.3)' }}
        >
          ▶ Play
        </button>
        <button
          onClick={() => {
            const { playAlbum: pa } = usePlayerStore.getState()
            pa([...songs].sort(() => Math.random() - 0.5), 0, album.id)
          }}
          className="px-6 py-2.5 bg-white/10 text-white rounded-xl font-medium text-sm hover:bg-white/15 transition-colors"
        >
          ⇀ Shuffle
        </button>
      </div>

      {/* Song list */}
      <div className="px-3">
        {songs.map((song, i) => (
          <SongRow key={song.id} song={song} index={i} queue={songs} source={album.id} />
        ))}
      </div>
    </div>
  )
}
