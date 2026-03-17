import { getDB } from './schema'
import type { DBSong } from '@/types/db.types'

export async function getAllSongs(): Promise<DBSong[]> {
  const db = await getDB()
  return db.getAll('songs')
}

export async function getSong(id: number): Promise<DBSong | undefined> {
  const db = await getDB()
  return db.get('songs', id)
}

export async function getSongsByIds(ids: number[]): Promise<DBSong[]> {
  const db = await getDB()
  const songs = await Promise.all(ids.map((id) => db.get('songs', id)))
  return songs.filter(Boolean) as DBSong[]
}

export async function searchSongs(
  query: string,
  filters?: { category?: string; eraName?: string }
): Promise<DBSong[]> {
  const db = await getDB()
  let songs = await db.getAll('songs')
  const q = query.toLowerCase().trim()

  if (q) {
    songs = songs.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.creditedArtists.some((a: string) => a.toLowerCase().includes(q)) ||
        s.eraName.toLowerCase().includes(q)
    )
  }

  if (filters?.category) {
    songs = songs.filter((s) => s.category === filters.category)
  }
  if (filters?.eraName) {
    songs = songs.filter((s) => s.eraName === filters.eraName)
  }

  return songs
}

export async function bulkPutSongs(songs: DBSong[]): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('songs', 'readwrite')
  await Promise.all([...songs.map((s) => tx.store.put(s)), tx.done])
}

export async function updateSongLiked(id: number, liked: boolean): Promise<void> {
  const db = await getDB()
  const song = await db.get('songs', id)
  if (song) {
    song.liked = liked
    await db.put('songs', song)
  }
}

export async function getLikedSongs(): Promise<DBSong[]> {
  const db = await getDB()
  const all = await db.getAll('songs')
  return all.filter((s) => s.liked)
}

export async function getSongsCount(): Promise<number> {
  const db = await getDB()
  return db.count('songs')
}
