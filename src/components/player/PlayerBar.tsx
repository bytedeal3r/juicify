import { usePlayerStore } from '@/store/player.store'
import { TrackInfo } from './TrackInfo'
import { ProgressSlider } from './ProgressSlider'
import { VolumeControl } from './VolumeControl'

export function PlayerBar() {
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
    toggleQueue,
    toggleFullscreen,
    isQueueOpen,
  } = usePlayerStore()

  if (!currentTrack) return null

  const playModeIcon = {
    normal: '⇄',
    shuffle: '⇀',
    'repeat-one': '↺₁',
    'repeat-all': '↺',
  }[playMode]

  const cycleModes = () => {
    const modes = ['normal', 'shuffle', 'repeat-one', 'repeat-all'] as const
    const next = modes[(modes.indexOf(playMode) + 1) % modes.length]
    setPlayMode(next)
  }

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-20 bg-[#0a0a0f]/95 backdrop-blur-md border-t border-white/5">
      <ProgressSlider compact />
      <div className="flex items-center justify-between px-4 py-3">
        {/* Track info */}
        <div className="flex-1 min-w-0 max-w-xs">
          <TrackInfo compact />
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={cycleModes}
              className={`text-sm transition-colors ${
                playMode !== 'normal' ? 'text-[#bf5fff]' : 'text-[#606078] hover:text-white'
              }`}
              title={playMode}
            >
              {playModeIcon}
            </button>
            <button
              onClick={prev}
              className="text-[#a0a0b8] hover:text-white transition-colors text-xl"
            >
              ⏮
            </button>
            <button
              onClick={isPlaying ? pause : resume}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isBuffering ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="text-black text-sm">{isPlaying ? '⏸' : '▶'}</span>
              )}
            </button>
            <button
              onClick={next}
              className="text-[#a0a0b8] hover:text-white transition-colors text-xl"
            >
              ⏭
            </button>
            <button
              onClick={toggleFullscreen}
              className="text-[#606078] hover:text-white transition-colors text-sm"
            >
              ⤢
            </button>
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 flex items-center justify-end gap-3">
          <VolumeControl />
          <button
            onClick={toggleQueue}
            className={`text-sm transition-colors ${
              isQueueOpen ? 'text-[#bf5fff]' : 'text-[#606078] hover:text-white'
            }`}
          >
            ≡
          </button>
        </div>
      </div>
    </div>
  )
}
