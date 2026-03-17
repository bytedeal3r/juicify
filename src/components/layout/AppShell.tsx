import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { PlayerBar } from '@/components/player/PlayerBar'
import { FullscreenPlayer } from '@/components/player/FullscreenPlayer'
import { QueuePanel } from '@/components/player/QueuePanel'
import { ContextMenu } from '@/components/ui/ContextMenu'
import { CreatePlaylistModal } from '@/components/library/CreatePlaylistModal'
import { AddToPlaylistModal } from '@/components/library/AddToPlaylistModal'
import { useLibraryStore } from '@/store/library.store'
import { useUIStore } from '@/store/ui.store'
import { useAudio } from '@/hooks/useAudio'
import { usePlayerStore } from '@/store/player.store'

export function AppShell() {
  // Mount audio engine once
  useAudio()

  const { hydrate } = useLibraryStore()
  const { activeModal } = useUIStore()
  const { isQueueOpen } = usePlayerStore()

  useEffect(() => {
    hydrate()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f] text-white">
      {/* Sidebar (desktop) */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Main content */}
      <main
        className={`flex-1 overflow-y-auto transition-all ${
          isQueueOpen ? 'mr-72' : ''
        }`}
      >
        <Outlet />
      </main>

      {/* Queue panel */}
      <QueuePanel />

      {/* Player */}
      <PlayerBar />

      {/* Fullscreen player */}
      <FullscreenPlayer />

      {/* Mobile nav */}
      <MobileNav />

      {/* Context menu */}
      <ContextMenu />

      {/* Modals */}
      {activeModal === 'create-playlist' && <CreatePlaylistModal />}
      {activeModal === 'add-to-playlist' && <AddToPlaylistModal />}
    </div>
  )
}
