import { useEffect, useState } from 'react'
import { getAlbum } from '@/db/albums'
import { getSongsByIds } from '@/db/songs'
import type { DBAlbum, DBSong } from '@/types/db.types'

export function useAlbum(id: string) {
  const [album, setAlbum] = useState<DBAlbum | null>(null)
  const [songs, setSongs] = useState<DBSong[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getAlbum(id).then(async (a) => {
      if (!a) { setLoading(false); return }
      setAlbum(a)
      const s = await getSongsByIds(a.trackIds)
      setSongs(s)
      setLoading(false)
    })
  }, [id])

  return { album, songs, loading }
}
