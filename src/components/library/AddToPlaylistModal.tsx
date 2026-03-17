import { Modal } from '@/components/ui/Modal'
import { useLibraryStore } from '@/store/library.store'
import { useUIStore } from '@/store/ui.store'
import type { DBSong } from '@/types/db.types'

export function AddToPlaylistModal() {
  const { userPlaylists, addSongToPlaylist } = useLibraryStore()
  const { closeModal, modalPayload } = useUIStore()
  const song = modalPayload as DBSong

  return (
    <Modal title="Add to Playlist">
      <div className="space-y-2">
        {userPlaylists.length === 0 ? (
          <p className="text-[#606078] text-sm text-center py-4">No playlists yet</p>
        ) : (
          userPlaylists.map((p) => (
            <button
              key={p.id}
              onClick={() => { addSongToPlaylist(p.id, song.id); closeModal() }}
              className="w-full text-left px-4 py-3 rounded-lg bg-[#0a0a0f] border border-white/5 hover:border-[#bf5fff44] transition-colors"
            >
              <p className="text-white text-sm">{p.name}</p>
              <p className="text-[#606078] text-xs">{p.songIds.length} songs</p>
            </button>
          ))
        )}
      </div>
    </Modal>
  )
}
