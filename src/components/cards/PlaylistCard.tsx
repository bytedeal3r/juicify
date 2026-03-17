import { useNavigate } from 'react-router-dom'
import { getFallbackCover } from '@/utils/coverArt'
import type { DBPlaylist } from '@/types/db.types'

export function PlaylistCard({ playlist }: { playlist: DBPlaylist }) {
  const navigate = useNavigate()
  const cover = playlist.coverImageUrl || getFallbackCover(playlist.name)

  return (
    <div
      onClick={() => navigate(`/playlist/${playlist.id}`)}
      className="group cursor-pointer"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <img
          src={cover}
          alt={playlist.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = getFallbackCover(playlist.name) }}
        />
      </div>
      <p className="text-white text-sm font-medium truncate">{playlist.name}</p>
      <p className="text-[#606078] text-xs mt-0.5">{playlist.songIds.length} songs</p>
    </div>
  )
}
