import { usePlayerStore } from '@/store/player.store'

export function VolumeControl() {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleMute}
        className="text-[#606078] hover:text-white transition-colors w-5 text-center"
      >
        {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.02}
        value={isMuted ? 0 : volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="w-20 accent-[#bf5fff] cursor-pointer"
      />
    </div>
  )
}
