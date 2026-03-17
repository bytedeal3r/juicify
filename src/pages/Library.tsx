import { useEffect, useState } from 'react'
import { getAllAlbums } from '@/db/albums'
import { useLibraryStore } from '@/store/library.store'
import { AlbumCard } from '@/components/cards/AlbumCard'
import { PlaylistCard } from '@/components/cards/PlaylistCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { useUIStore } from '@/store/ui.store'
import type { DBAlbum } from '@/types/db.types'

type Tab = 'albums' | 'eras' | 'playlists'

export function Library() {
  const [tab, setTab] = useState<Tab>('albums')
  const [officialAlbums, setOfficialAlbums] = useState<DBAlbum[]>([])
  const [eraAlbums, setEraAlbums] = useState<DBAlbum[]>([])
  const [catAlbums, setCatAlbums] = useState<DBAlbum[]>([])
  const [loading, setLoading] = useState(true)
  const { userPlaylists } = useLibraryStore()
  const { openModal } = useUIStore()

  useEffect(() => {
    getAllAlbums().then((albums) => {
      setOfficialAlbums(albums.filter((a) => a.type === 'official'))
      setEraAlbums(albums.filter((a) => a.type === 'era'))
      setCatAlbums(albums.filter((a) => a.type === 'category'))
      setLoading(false)
    })
  }, [])

  const tabs: { key: Tab; label: string }[] = [
    { key: 'albums', label: 'Albums' },
    { key: 'eras', label: 'Eras' },
    { key: 'playlists', label: 'My Playlists' },
  ]

  const currentAlbums = tab === 'albums' ? officialAlbums : tab === 'eras' ? [...eraAlbums, ...catAlbums] : []

  return (
    <div className="p-6 pb-32">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white font-bold text-2xl">Library</h1>
        {tab === 'playlists' && (
          <button
            onClick={() => openModal('create-playlist')}
            className="px-4 py-2 bg-[#bf5fff22] border border-[#bf5fff44] text-[#bf5fff] text-sm rounded-lg hover:bg-[#bf5fff33] transition-colors"
          >
            + New Playlist
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/5">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === key
                ? 'text-white border-[#bf5fff]'
                : 'text-[#606078] border-transparent hover:text-[#a0a0b8]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'playlists' ? (
        <div>
          {userPlaylists.length === 0 ? (
            <div className="text-center py-16 text-[#606078]">
              <p className="text-4xl mb-3">♪</p>
              <p>No playlists yet</p>
              <button
                onClick={() => openModal('create-playlist')}
                className="mt-4 px-4 py-2 text-sm text-[#bf5fff] hover:underline"
              >
                Create your first playlist
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {userPlaylists.map((p) => <PlaylistCard key={p.id} playlist={p} />)}
            </div>
          )}
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentAlbums.map((album) => <AlbumCard key={album.id} album={album} />)}
        </div>
      )}
    </div>
  )
}
