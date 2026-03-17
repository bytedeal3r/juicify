import { usePlayerStore } from '@/store/player.store'
import { useLibraryStore } from '@/store/library.store'
import { useUIStore } from '@/store/ui.store'
import { getFallbackCover } from '@/utils/coverArt'
import { formatDuration } from '@/utils/time'
import { parseDuration } from '@/utils/time'
import type { DBSong } from '@/types/db.types'

interface Props {
  song: DBSong
  index?: number
  queue?: DBSong[]
  source?: string
}

export function SongRow({ song, index, queue, source }: Props) {
  const { currentTrack, isPlaying, play, pause, resume } = usePlayerStore()
  const { isLiked, toggleLike } = useLibraryStore()
  const { openContextMenu } = useUIStore()

  const isCurrentTrack = currentTrack?.id === song.id
  const cover = song.imageUrl || getFallbackCover(song.name)

  const handlePlay = () => {
    if (isCurrentTrack) {
      isPlaying ? pause() : resume()
    } else {
      play(song, queue || [song], source)
    }
  }

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault()
        openContextMenu(song, { x: e.clientX, y: e.clientY })
      }}
      className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-white/5 ${
        isCurrentTrack ? 'bg-[#bf5fff11]' : ''
      }`}
    >
      {/* Index / play button */}
      <div className="w-8 flex items-center justify-center flex-shrink-0">
        <button
          onClick={handlePlay}
          className="text-sm"
        >
          {isCurrentTrack && isPlaying ? (
            <span className="text-[#bf5fff]">⏸</span>
          ) : (
            <>
              <span className={`group-hover:hidden ${isCurrentTrack ? 'text-[#bf5fff]' : 'text-[#606078]'}`}>
                {index !== undefined ? index + 1 : '•'}
              </span>
              <span className="hidden group-hover:inline text-white">▶</span>
            </>
          )}
        </button>
      </div>

      {/* Cover + info */}
      <img
        src={cover}
        alt=""
        className="w-9 h-9 rounded object-cover flex-shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).src = getFallbackCover(song.name) }}
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate font-medium ${isCurrentTrack ? 'text-[#bf5fff]' : 'text-white'}`}>
          {song.name}
        </p>
        <p className="text-[#606078] text-xs truncate">
          {song.creditedArtists.join(', ') || 'Juice WRLD'}
        </p>
      </div>

      {/* Era badge */}
      <span className="hidden sm:inline text-[#606078] text-xs truncate max-w-[100px]">
        {song.eraName}
      </span>

      {/* Like button */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleLike(song.id) }}
        className={`opacity-0 group-hover:opacity-100 transition-all text-sm ${
          isLiked(song.id) ? 'opacity-100 text-[#00ff88]' : 'text-[#606078] hover:text-white'
        }`}
      >
        ♥
      </button>

      {/* Duration */}
      <span className="text-[#606078] text-xs w-10 text-right flex-shrink-0">
        {formatDuration(parseDuration(song.length))}
      </span>
    </div>
  )
}
