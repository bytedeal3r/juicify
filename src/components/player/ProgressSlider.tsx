import { useRef } from 'react'
import { usePlayerStore } from '@/store/player.store'
import { formatDuration } from '@/utils/time'

export function ProgressSlider({ compact = false }: { compact?: boolean }) {
  const { currentTime, duration, seek } = usePlayerStore()
  const trackRef = useRef<HTMLDivElement>(null)
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!trackRef.current || !duration) return
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    seek(ratio * duration)
  }

  if (compact) {
    return (
      <div
        ref={trackRef}
        onClick={handleClick}
        className="h-1 w-full bg-white/10 rounded-full cursor-pointer group relative"
      >
        <div
          className="h-full rounded-full bg-[#bf5fff] group-hover:bg-white transition-colors"
          style={{ width: `${pct}%` }}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-[#606078] text-xs w-10 text-right tabular-nums">
        {formatDuration(currentTime)}
      </span>
      <div
        ref={trackRef}
        onClick={handleClick}
        className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer group relative"
      >
        <div
          className="h-full rounded-full bg-[#bf5fff] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[#606078] text-xs w-10 tabular-nums">
        {formatDuration(duration)}
      </span>
    </div>
  )
}
