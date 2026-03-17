import { getDB } from './schema'
import type { DBPlaylist } from '@/types/db.types'

export async function getAllPlaylists(): Promise<DBPlaylist[]> {
  const db = await getDB()
  return db.getAll('playlists')
}

export async function getPlaylist(id: string): Promise<DBPlaylist | undefined> {
  const db = await getDB()
  return db.get('playlists', id)
}

export async function putPlaylist(playlist: DBPlaylist): Promise<void> {
  const db = await getDB()
  await db.put('playlists', playlist)
}

export async function deletePlaylist(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('playlists', id)
}

export async function getSystemPlaylist(systemKey: string): Promise<DBPlaylist | undefined> {
  const db = await getDB()
  const results = await db.getAllFromIndex('playlists', 'systemKey', systemKey)
  return results[0]
}
