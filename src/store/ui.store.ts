import { create } from 'zustand'
import type { DBSong } from '@/types/db.types'

export type ModalType = 'create-playlist' | 'add-to-playlist' | 'song-details' | null

interface UIStore {
  sidebarCollapsed: boolean
  activeModal: ModalType
  modalPayload: unknown
  contextMenuSong: DBSong | null
  contextMenuPosition: { x: number; y: number } | null

  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  openModal: (modal: ModalType, payload?: unknown) => void
  closeModal: () => void
  openContextMenu: (song: DBSong, position: { x: number; y: number }) => void
  closeContextMenu: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  activeModal: null,
  modalPayload: null,
  contextMenuSong: null,
  contextMenuPosition: null,

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  openModal: (modal, payload = null) => set({ activeModal: modal, modalPayload: payload }),
  closeModal: () => set({ activeModal: null, modalPayload: null }),
  openContextMenu: (song, position) => set({ contextMenuSong: song, contextMenuPosition: position }),
  closeContextMenu: () => set({ contextMenuSong: null, contextMenuPosition: null }),
}))
