import { useNavigate } from 'react-router-dom'
import { usePlayerStore } from '@/store/player.store'
import { getSongsByIds } from '@/db/songs'
import { getFallbackCover } from '@/utils/coverArt'
import type { DBAlbum } from '@/types/db.types'

interface Props {
  album: DBAlbum
}

export function AlbumCard({ album }: Props) {
  const navigate = useNavigate()
  const { playAlbum } = usePlayerStore()
  const cover = album.coverImageUrl || getFallbackCover(album.title)

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const songs = await getSongsByIds(album.trackIds)
    if (songs.length) playAlbum(songs, 0, album.id)
  }

  return (
    <div
      onClick={() => navigate(`/album/${album.id}`)}
      className="group cursor-pointer"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <img
          src={cover}
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = getFallbackCover(album.title) }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <button
            onClick={handlePlay}
            className="opacity-0 group-hover:opacity-100 w-12 h-12 rounded-full bg-[#bf5fff] flex items-center justify-center transition-all hover:scale-110"
            style={{ boxShadow: '0 0 20px rgba(191,95,255,0.5)' }}
          >
            <span className="text-white text-lg">▶</span>
          </button>
        </div>
      </div>
      <p className="text-white text-sm font-medium truncate">{album.title}</p>
      <p className="text-[#606078] text-xs mt-0.5">{album.trackCount} songs</p>
    </div>
  )
}
