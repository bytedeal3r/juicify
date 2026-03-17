import { create } from 'zustand'
import { updateSongLiked, getLikedSongs } from '@/db/songs'
import { getAllPlaylists, putPlaylist, deletePlaylist as dbDeletePlaylist } from '@/db/playlists'
import type { DBPlaylist } from '@/types/db.types'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

interface LibraryStore {
  likedSongIds: Set<number>
  userPlaylists: DBPlaylist[]
  hydrated: boolean

  hydrate: () => Promise<void>
  toggleLike: (songId: number) => Promise<void>
  isLiked: (songId: number) => boolean
  createPlaylist: (name: string, description?: string) => Promise<DBPlaylist>
  deletePlaylist: (id: string) => Promise<void>
  addSongToPlaylist: (playlistId: string, songId: number) => Promise<void>
  removeSongFromPlaylist: (playlistId: string, songId: number) => Promise<void>
}

export const useLibraryStore = create<LibraryStore>((set, get) => ({
  likedSongIds: new Set(),
  userPlaylists: [],
  hydrated: false,

  hydrate: async () => {
    const [likedSongs, playlists] = await Promise.all([getLikedSongs(), getAllPlaylists()])
    set({
      likedSongIds: new Set(likedSongs.map((s) => s.id)),
      userPlaylists: playlists.filter((p) => !p.isSystem),
      hydrated: true,
    })
  },

  toggleLike: async (songId) => {
    const { likedSongIds } = get()
    const liked = !likedSongIds.has(songId)
    await updateSongLiked(songId, liked)
    set((s) => {
      const next = new Set(s.likedSongIds)
      if (liked) next.add(songId)
      else next.delete(songId)
      return { likedSongIds: next }
    })
  },

  isLiked: (songId) => get().likedSongIds.has(songId),

  createPlaylist: async (name, description = '') => {
    const playlist: DBPlaylist = {
      id: generateId(),
      name,
      description,
      coverImageUrl: null,
      songIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isSystem: false,
      systemKey: null,
    }
    await putPlaylist(playlist)
    set((s) => ({ userPlaylists: [...s.userPlaylists, playlist] }))
    return playlist
  },

  deletePlaylist: async (id) => {
    await dbDeletePlaylist(id)
    set((s) => ({ userPlaylists: s.userPlaylists.filter((p) => p.id !== id) }))
  },

  addSongToPlaylist: async (playlistId, songId) => {
    const { userPlaylists } = get()
    const playlist = userPlaylists.find((p) => p.id === playlistId)
    if (!playlist || playlist.songIds.includes(songId)) return
    const updated = { ...playlist, songIds: [...playlist.songIds, songId], updatedAt: Date.now() }
    await putPlaylist(updated)
    set((s) => ({
      userPlaylists: s.userPlaylists.map((p) => (p.id === playlistId ? updated : p)),
    }))
  },

  removeSongFromPlaylist: async (playlistId, songId) => {
    const { userPlaylists } = get()
    const playlist = userPlaylists.find((p) => p.id === playlistId)
    if (!playlist) return
    const updated = {
      ...playlist,
      songIds: playlist.songIds.filter((id) => id !== songId),
      updatedAt: Date.now(),
    }
    await putPlaylist(updated)
    set((s) => ({
      userPlaylists: s.userPlaylists.map((p) => (p.id === playlistId ? updated : p)),
    }))
  },
}))
