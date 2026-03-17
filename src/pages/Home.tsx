import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllAlbums } from '@/db/albums'
import { useHistoryStore } from '@/store/history.store'
import { AlbumCard } from '@/components/cards/AlbumCard'
import { RecentlyPlayed } from '@/components/home/RecentlyPlayed'
import { WeeklyPlaylist } from '@/components/home/WeeklyPlaylist'
import { Skeleton } from '@/components/ui/Skeleton'
import type { DBAlbum } from '@/types/db.types'

export function Home() {
  const [officialAlbums, setOfficialAlbums] = useState<DBAlbum[]>([])
  const [eraAlbums, setEraAlbums] = useState<DBAlbum[]>([])
  const [loading, setLoading] = useState(true)
  const { loadRecent, buildWeeklyPlaylist } = useHistoryStore()
  const navigate = useNavigate()

  useEffect(() => {
    loadRecent()
    buildWeeklyPlaylist()
    getAllAlbums().then((albums) => {
      setOfficialAlbums(albums.filter((a) => a.type === 'official').slice(0, 8))
      setEraAlbums(albums.filter((a) => a.type === 'era').slice(0, 8))
      setLoading(false)
    })
  }, [])

  return (
    <div className="p-6 space-y-10 pb-32">
      {/* Hero */}
      <div
        className="rounded-2xl p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #bf5fff22, #00d4ff11)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#bf5fff08] to-transparent" />
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-white mb-2">
            Juice WRLD
          </h1>
          <p className="text-[#a0a0b8] mb-6">2700+ songs, all eras, all leaks</p>
          <button
            onClick={() => navigate('/search')}
            className="px-6 py-3 bg-[#bf5fff] text-white rounded-xl font-medium hover:bg-[#bf5fff]/90 transition-colors"
            style={{ boxShadow: '0 0 20px rgba(191,95,255,0.4)' }}
          >
            Explore Songs
          </button>
        </div>
      </div>

      <WeeklyPlaylist />
      <RecentlyPlayed />

      {/* Official Albums */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Official Albums</h2>
          <button onClick={() => navigate('/library')} className="text-[#bf5fff] text-sm hover:underline">
            View all
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {officialAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </section>

      {/* Era Albums */}
      {!loading && eraAlbums.length > 0 && (
        <section>
          <h2 className="text-white font-bold text-lg mb-4">Browse by Era</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {eraAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
