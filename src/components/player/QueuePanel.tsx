import { usePlayerStore } from '@/store/player.store'
import { getFallbackCover } from '@/utils/coverArt'

export function QueuePanel() {
  const { queue, queueIndex, isQueueOpen, toggleQueue, play, clearQueue } = usePlayerStore()

  if (!isQueueOpen) return null

  return (
    <div className="fixed right-0 top-0 bottom-0 w-72 bg-[#12121a] border-l border-white/5 z-30 flex flex-col">
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
        <h3 className="text-white font-semibold text-sm">Queue</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={clearQueue}
            className="text-[#606078] hover:text-red-400 transition-colors text-xs"
            title="Clear queue"
          >
            Clear
          </button>
          <button
            onClick={toggleQueue}
            className="text-[#606078] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {queue.map((track, i) => (
          <button
            key={`${track.id}-${i}`}
            onClick={() => play(track, queue, undefined)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left ${
              i === queueIndex ? 'bg-[#bf5fff11]' : ''
            }`}
          >
            <span className="text-[#606078] text-xs w-5 text-right flex-shrink-0">
              {i === queueIndex ? '▶' : i + 1}
            </span>
            <img
              src={track.imageUrl || getFallbackCover(track.name)}
              alt=""
              className="w-8 h-8 rounded object-cover flex-shrink-0"
              onError={(e) => { (e.target as HTMLImageElement).src = getFallbackCover(track.name) }}
            />
            <div className="min-w-0 flex-1">
              <p className={`text-xs truncate ${i === queueIndex ? 'text-[#bf5fff]' : 'text-white'}`}>
                {track.name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
