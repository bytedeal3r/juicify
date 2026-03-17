import {
  SkipBack, SkipForward, Play, Pause, Shuffle, Repeat, Repeat1,
  Maximize2, Heart, ListMusic, Loader2,
} from 'lucide-react'
import { usePlayerStore } from '@/store/player.store'
import { useLibraryStore } from '@/store/library.store'
import { TrackInfo } from './TrackInfo'
import { ProgressSlider } from './ProgressSlider'
import { VolumeControl } from './VolumeControl'

export function PlayerBar() {
  const {
    currentTrack, isPlaying, isBuffering, playMode,
    pause, resume, next, prev, setPlayMode,
    toggleQueue, toggleFullscreen, isQueueOpen,
  } = usePlayerStore()
  const { isLiked, toggleLike } = useLibraryStore()

  if (!currentTrack) return null

  const cycleModes = () => {
    const modes = ['normal', 'shuffle', 'repeat-one', 'repeat-all'] as const
    setPlayMode(modes[(modes.indexOf(playMode) + 1) % modes.length])
  }

  const ShuffleModeIcon = () => {
    if (playMode === 'repeat-one') return <Repeat1 size={15} />
    if (playMode === 'repeat-all') return <Repeat size={15} />
    return <Shuffle size={15} />
  }

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-20 bg-[#0a0a0f]/95 backdrop-blur-md border-t border-white/5">
      <ProgressSlider compact />

      <div className="flex items-center px-4 pt-2 pb-3 gap-2">

        {/* Left — track info */}
        <div className="flex-1 min-w-0">
          <TrackInfo compact />
        </div>

        {/* Center — playback controls */}
        <div className="flex items-center gap-5 flex-shrink-0">
          {/* Shuffle/mode — desktop only */}
          <button
            onClick={cycleModes}
            title={playMode}
            className={`hidden md:flex transition-colors ${
              playMode !== 'normal' ? 'text-[#bf5fff]' : 'text-[#606078] hover:text-white'
            }`}
          >
            <ShuffleModeIcon />
          </button>

          <button onClick={prev} className="text-[#a0a0b8] hover:text-white transition-colors">
            <SkipBack size={20} />
          </button>

          <button
            onClick={isPlaying ? pause : resume}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0"
          >
            {isBuffering
              ? <Loader2 size={18} className="text-black animate-spin" />
              : isPlaying
                ? <Pause size={16} className="text-black" fill="black" />
                : <Play size={16} className="text-black" fill="black" />
            }
          </button>

          <button onClick={next} className="text-[#a0a0b8] hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>

          {/* Fullscreen — desktop only */}
          <button
            onClick={toggleFullscreen}
            className="hidden md:flex text-[#606078] hover:text-white transition-colors"
          >
            <Maximize2 size={15} />
          </button>
        </div>

        {/* Right — secondary controls */}
        <div className="flex-1 flex items-center justify-end gap-4">
          <button
            onClick={() => toggleLike(currentTrack.id)}
            className={`transition-colors flex-shrink-0 ${
              isLiked(currentTrack.id) ? 'text-[#00ff88]' : 'text-[#606078] hover:text-white'
            }`}
          >
            <Heart size={16} fill={isLiked(currentTrack.id) ? 'currentColor' : 'none'} />
          </button>

          <VolumeControl />

          {/* Queue — desktop only */}
          <button
            onClick={toggleQueue}
            className={`hidden md:flex transition-colors ${
              isQueueOpen ? 'text-[#bf5fff]' : 'text-[#606078] hover:text-white'
            }`}
          >
            <ListMusic size={16} />
          </button>

          {/* Fullscreen — mobile only */}
          <button
            onClick={toggleFullscreen}
            className="md:hidden text-[#606078] hover:text-white transition-colors"
          >
            <Maximize2 size={16} />
          </button>
        </div>

      </div>
    </div>
  )
}
