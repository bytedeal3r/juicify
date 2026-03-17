import { useRef, useState, useEffect } from 'react'
import { Volume2, Volume1, VolumeX } from 'lucide-react'
import { usePlayerStore } from '@/store/player.store'

export function VolumeControl() {
  const { volume, isMuted, setVolume, toggleMute } = usePlayerStore()
  const [popupOpen, setPopupOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const display = isMuted ? 0 : volume
  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2

  useEffect(() => {
    if (!popupOpen) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setPopupOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('touchstart', handler)
    }
  }, [popupOpen])

  return (
    <div ref={ref} className="relative flex items-center gap-2">
      <button
        onClick={() => {
          if (window.innerWidth < 768) {
            setPopupOpen((o) => !o)
          } else {
            toggleMute()
          }
        }}
        className="text-[#606078] hover:text-white transition-colors flex-shrink-0"
      >
        <VolumeIcon size={16} />
      </button>

      {/* Horizontal slider — desktop only */}
      <input
        type="range"
        min={0}
        max={1}
        step={0.02}
        value={display}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="hidden md:block w-20 accent-[#bf5fff] cursor-pointer"
      />

      {/* Vertical popup — mobile only */}
      {popupOpen && (
        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-[#1a1a28] border border-white/10 rounded-xl px-3 py-4 flex flex-col items-center gap-2 z-50 shadow-xl">
          <span className="text-[10px] text-[#606078]">{Math.round(display * 100)}%</span>
          <div className="h-24 flex items-center justify-center">
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={display}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ writingMode: 'vertical-lr', direction: 'rtl', width: '4px', height: '96px' }}
              className="accent-[#bf5fff] cursor-pointer"
            />
          </div>
          <button onClick={toggleMute} className="text-[#606078] hover:text-white transition-colors">
            <VolumeIcon size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
