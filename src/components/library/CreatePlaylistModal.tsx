import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { useLibraryStore } from '@/store/library.store'
import { useUIStore } from '@/store/ui.store'

export function CreatePlaylistModal() {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const { createPlaylist } = useLibraryStore()
  const { closeModal } = useUIStore()

  const handleCreate = async () => {
    if (!name.trim()) return
    await createPlaylist(name.trim(), desc.trim())
    closeModal()
  }

  return (
    <Modal title="New Playlist">
      <div className="space-y-4">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          placeholder="Playlist name"
          className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-[#606078] focus:outline-none focus:border-[#bf5fff]"
        />
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder:text-[#606078] focus:outline-none focus:border-[#bf5fff] resize-none"
        />
        <div className="flex gap-3">
          <button
            onClick={closeModal}
            className="flex-1 py-2 border border-white/10 text-[#a0a0b8] rounded-lg text-sm hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="flex-1 py-2 bg-[#bf5fff] text-white rounded-lg text-sm font-medium hover:bg-[#bf5fff]/90 transition-colors disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    </Modal>
  )
}
