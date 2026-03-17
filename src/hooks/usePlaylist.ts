import { useEffect, useState } from 'react'
import { getPlaylist } from '@/db/playlists'
import { getSongsByIds } from '@/db/songs'
import type { DBPlaylist, DBSong } from '@/types/db.types'

export function usePlaylist(id: string) {
  const [playlist, setPlaylist] = useState<DBPlaylist | null>(null)
  const [songs, setSongs] = useState<DBSong[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPlaylist(id).then(async (p) => {
      if (!p) { setLoading(false); return }
      setPlaylist(p)
      const s = await getSongsByIds(p.songIds)
      setSongs(s)
      setLoading(false)
    })
  }, [id])

  return { playlist, songs, loading }
}
