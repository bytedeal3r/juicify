import { useRef, useEffect } from 'react'
import { usePlayerStore } from '@/store/player.store'
import { useLibraryStore } from '@/store/library.store'
import { ProgressSlider } from './ProgressSlider'
import { getFallbackCover } from '@/utils/coverArt'

export function FullscreenPlayer() {
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    playMode,
    pause,
    resume,
    next,
    prev,
    setPlayMode,
    toggleFullscreen,
    toggleQueue,
    isFullscreen,
    isQueueOpen,
  } = usePlayerStore()
  const { isLiked, toggleLike } = useLibraryStore()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  if (!isFullscreen || !currentTrack) return null

  const cover = currentTrack.imageUrl || getFallbackCover(currentTrack.name)
  const cycleModes = () => {
    const modes = ['normal', 'shuffle', 'repeat-one', 'repeat-all'] as const
    const n = modes[(modes.indexOf(playMode) + 1) % modes.length]
    setPlayMode(n)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0f] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={toggleFullscreen}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-[#a0a0b8] hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-[#a0a0b8] text-xs font-medium tracking-widest uppercase">Now Playing</span>
        <button
          onClick={() => toggleLike(currentTrack.id)}
          className={`text-xl transition-colors ${isLiked(currentTrack.id) ? 'text-[#00ff88]' : 'text-[#606078] hover:text-white'}`}
        >
          ♥
        </button>
      </div>

      {/* Cover art */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="relative max-w-sm w-full aspect-square">
          <img
            src={cover}
            alt={currentTrack.name}
            className="w-full h-full object-cover rounded-2xl"
            style={{ boxShadow: '0 0 60px rgba(191,95,255,0.3)' }}
            onError={(e) => { (e.target as HTMLImageElement).src = getFallbackCover(currentTrack.name) }}
          />
        </div>
      </div>

      {/* Info + controls */}
      <div className="px-8 pb-8 space-y-6">
        <div>
          <h2 className="text-white text-2xl font-bold truncate">{currentTrack.name}</h2>
          <p className="text-[#a0a0b8] text-sm">
            {currentTrack.creditedArtists.join(', ') || 'Juice WRLD'}
          </p>
        </div>

        <ProgressSlider />

        <div className="flex items-center justify-between">
          <button
            onClick={cycleModes}
            title={playMode}
            className={`text-lg transition-colors ${playMode !== 'normal' ? 'text-[#bf5fff]' : 'text-[#606078]'}`}
          >
            {{ normal: '⇄', shuffle: '⇀', 'repeat-one': '↺₁', 'repeat-all': '↺' }[playMode]}
          </button>
          <button onClick={prev} className="text-white text-3xl">⏮</button>
          <button
            onClick={isPlaying ? pause : resume}
            className="w-16 h-16 rounded-full bg-[#bf5fff] flex items-center justify-center hover:scale-105 transition-transform"
            style={{ boxShadow: '0 0 20px rgba(191,95,255,0.4)' }}
          >
            {isBuffering ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="text-white text-xl">{isPlaying ? '⏸' : '▶'}</span>
            )}
          </button>
          <button onClick={next} className="text-white text-3xl">⏭</button>
          <button
            onClick={() => { toggleQueue(); toggleFullscreen() }}
            className={`text-xl transition-colors ${isQueueOpen ? 'text-[#bf5fff]' : 'text-[#606078]'}`}
            title="Queue"
          >
            ≡
          </button>
        </div>

        {/* Notes/Lyrics */}
        {(currentTrack.notes || currentTrack.producers?.length > 0) && (
          <details className="bg-[#12121a] rounded-xl p-4 border border-white/5">
            <summary className="text-[#a0a0b8] text-sm cursor-pointer">Song Info</summary>
            <div className="mt-3 space-y-2 text-sm text-[#606078]">
              {currentTrack.producers?.length > 0 && (
                <p><span className="text-[#a0a0b8]">Produced by:</span> {currentTrack.producers.join(', ')}</p>
              )}
              {currentTrack.eraName && (
                <p><span className="text-[#a0a0b8]">Era:</span> {currentTrack.eraName}</p>
              )}
              {currentTrack.leakType && (
                <p><span className="text-[#a0a0b8]">Type:</span> {currentTrack.leakType}</p>
              )}
              {currentTrack.notes && (
                <p className="whitespace-pre-wrap text-[#606078]">{currentTrack.notes}</p>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
