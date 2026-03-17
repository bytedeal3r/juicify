import { useEffect } from 'react'
import { useUIStore } from '@/store/ui.store'
import { usePlayerStore } from '@/store/player.store'
import { useLibraryStore } from '@/store/library.store'

export function ContextMenu() {
  const { contextMenuSong, contextMenuPosition, closeContextMenu, openModal } = useUIStore()
  const { play, addToQueue, playNext } = usePlayerStore()
  const { toggleLike, isLiked } = useLibraryStore()

  useEffect(() => {
    const handler = () => closeContextMenu()
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  if (!contextMenuSong || !contextMenuPosition) return null

  const song = contextMenuSong
  const { x, y } = contextMenuPosition

  const actions = [
    { label: 'Play Now', action: () => play(song) },
    { label: 'Play Next', action: () => playNext(song) },
    { label: 'Add to Queue', action: () => addToQueue(song) },
    { label: isLiked(song.id) ? '✓ Liked' : '♥ Like', action: () => toggleLike(song.id) },
    { label: 'Add to Playlist', action: () => openModal('add-to-playlist', song) },
    { label: 'Song Details', action: () => openModal('song-details', song) },
  ]

  return (
    <div
      className="fixed z-50 bg-[#1a1a28] border border-white/10 rounded-xl overflow-hidden py-1 min-w-[160px]"
      style={{ left: Math.min(x, window.innerWidth - 180), top: Math.min(y, window.innerHeight - 200) }}
      onClick={(e) => e.stopPropagation()}
    >
      {actions.map(({ label, action }) => (
        <button
          key={label}
          onClick={() => { action(); closeContextMenu() }}
          className="w-full text-left px-4 py-2 text-sm text-[#a0a0b8] hover:text-white hover:bg-white/5 transition-colors"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
