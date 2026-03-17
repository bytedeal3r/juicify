import { useRef, useState } from 'react'
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

const SWIPE_THRESHOLD = 80
const SWIPE_MAX = 120

export function SongRow({ song, index, queue, source }: Props) {
  const { currentTrack, isPlaying, play, pause, resume, addToQueue } = usePlayerStore()
  const { isLiked, toggleLike } = useLibraryStore()
  const { openContextMenu } = useUIStore()

  const isCurrentTrack = currentTrack?.id === song.id
  const cover = song.imageUrl || getFallbackCover(song.name)

  // Swipe state
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const [swipeDx, setSwipeDx] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const [queued, setQueued] = useState(false)

  const handlePlay = () => {
    if (swiping) return
    if (isCurrentTrack) {
      isPlaying ? pause() : resume()
    } else {
      play(song, queue || [song], source)
    }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    setQueued(false)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchStartX.current
    const dy = e.touches[0].clientY - touchStartY.current
    // Only hijack horizontal swipes
    if (!swiping && Math.abs(dy) > Math.abs(dx)) return
    if (dx > 0) {
      setSwiping(true)
      setSwipeDx(Math.min(dx, SWIPE_MAX))
    }
  }

  const onTouchEnd = () => {
    if (swipeDx >= SWIPE_THRESHOLD) {
      addToQueue(song)
      setQueued(true)
    }
    setSwipeDx(0)
    setSwiping(false)
  }

  const progress = Math.min(swipeDx / SWIPE_THRESHOLD, 1)
  const reached = swipeDx >= SWIPE_THRESHOLD

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Swipe reveal background */}
      <div
        className="absolute inset-0 flex items-center pl-4 pointer-events-none"
        style={{ opacity: progress }}
      >
        <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${reached ? 'text-[#00ff88]' : 'text-[#606078]'}`}>
          <span className={`text-lg transition-transform ${reached ? 'scale-125' : 'scale-100'}`}>+</span>
          <span>{reached ? 'Add to queue' : 'Swipe to queue'}</span>
        </div>
      </div>

      {/* Row content */}
      <div
        onContextMenu={(e) => {
          e.preventDefault()
          openContextMenu(song, { x: e.clientX, y: e.clientY })
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateX(${swipeDx}px)`,
          transition: swipeDx === 0 ? 'transform 0.25s ease' : 'none',
        }}
        className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-white/5 bg-[#0a0a0f] ${
          isCurrentTrack ? 'bg-[#bf5fff11]' : ''
        }`}
      >
        {/* Index / play button */}
        <div className="w-8 flex items-center justify-center flex-shrink-0">
          <button onClick={handlePlay} className="text-sm">
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

        {/* Like button (desktop hover) */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleLike(song.id) }}
          className={`opacity-0 group-hover:opacity-100 transition-all text-sm hidden sm:block ${
            isLiked(song.id) ? 'opacity-100 text-[#00ff88]' : 'text-[#606078] hover:text-white'
          }`}
        >
          ♥
        </button>

        {/* Three-dot menu (mobile) / queued feedback */}
        {queued ? (
          <span className="sm:hidden text-[#00ff88] text-xs">✓</span>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              openContextMenu(song, { x: e.currentTarget.getBoundingClientRect().left, y: e.currentTarget.getBoundingClientRect().top })
            }}
            className="sm:hidden text-[#606078] hover:text-white px-1 text-lg leading-none"
          >
            ⋮
          </button>
        )}

        {/* Duration */}
        <span className="text-[#606078] text-xs w-10 text-right flex-shrink-0">
          {formatDuration(parseDuration(song.length))}
        </span>
      </div>
    </div>
  )
}
