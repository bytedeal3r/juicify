import { usePlayerStore } from '@/store/player.store'
import { useLibraryStore } from '@/store/library.store'
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
  const { isLiked, toggleLike } = useLibraryStore()

  if (!currentTrack) return null

  const playModeIcon = {
    normal: '⇄',
    shuffle: '⇀',
    'repeat-one': '↺₁',
    'repeat-all': '↺',
  }[playMode]

  const cycleModes = () => {
    const modes = ['normal', 'shuffle', 'repeat-one', 'repeat-all'] as const
    setPlayMode(modes[(modes.indexOf(playMode) + 1) % modes.length])
  }

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-20 bg-[#0a0a0f]/95 backdrop-blur-md border-t border-white/5">
      <ProgressSlider compact />

      <div className="flex items-center px-4 py-2 gap-2">

        {/* Left — track info */}
        <div className="flex-1 min-w-0">
          <TrackInfo compact />
        </div>

        {/* Center — playback controls (absolutely centered) */}
        <div className="flex items-center gap-5 flex-shrink-0">
          {/* Shuffle/mode — desktop only */}
          <button
            onClick={cycleModes}
            title={playMode}
            className={`hidden md:block text-sm transition-colors ${
              playMode !== 'normal' ? 'text-[#bf5fff]' : 'text-[#606078] hover:text-white'
            }`}
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
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0"
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

          {/* Repeat/mode cycle — desktop only */}
          <button
            onClick={toggleFullscreen}
            className="hidden md:block text-[#606078] hover:text-white transition-colors text-sm"
          >
            ⤢
          </button>
        </div>

        {/* Right — secondary controls */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {/* Like */}
          <button
            onClick={() => toggleLike(currentTrack.id)}
            className={`transition-colors flex-shrink-0 ${
              isLiked(currentTrack.id) ? 'text-[#00ff88]' : 'text-[#606078] hover:text-white'
            }`}
          >
            ♥
          </button>

          {/* Volume */}
          <VolumeControl />

          {/* Queue */}
          <button
            onClick={toggleQueue}
            className={`hidden md:block text-sm transition-colors ${
              isQueueOpen ? 'text-[#bf5fff]' : 'text-[#606078] hover:text-white'
            }`}
          >
            ≡
          </button>

          {/* Fullscreen — mobile only */}
          <button
            onClick={toggleFullscreen}
            className="md:hidden text-[#606078] hover:text-white transition-colors text-sm"
          >
            ⤢
          </button>
        </div>

      </div>
    </div>
  )
}
