import { usePlayerStore } from '@/store/player.store'
import { getFallbackCover } from '@/utils/coverArt'

export function TrackInfo({ compact = false }: { compact?: boolean }) {
  const { currentTrack } = usePlayerStore()

  if (!currentTrack) return null

  const cover = currentTrack.imageUrl || getFallbackCover(currentTrack.name)

  return (
    <div className={`flex items-center gap-3 ${compact ? 'min-w-0' : ''}`}>
      <img
        src={cover}
        alt={currentTrack.name}
        className={`rounded object-cover flex-shrink-0 ${compact ? 'w-10 h-10' : 'w-12 h-12'}`}
        onError={(e) => {
          ;(e.target as HTMLImageElement).src = getFallbackCover(currentTrack.name)
        }}
      />
      <div className="min-w-0 flex-1">
        <p className={`font-medium truncate ${compact ? 'text-xs' : 'text-sm'} text-white`}>
          {currentTrack.name}
        </p>
        <p className="text-[#606078] truncate text-xs">
          {currentTrack.creditedArtists.join(', ') || 'Juice WRLD'}
        </p>
      </div>
    </div>
  )
}
