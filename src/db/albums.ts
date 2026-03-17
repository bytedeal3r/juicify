import { getDB } from './schema'
import type { DBAlbum, AlbumType } from '@/types/db.types'

export async function getAllAlbums(): Promise<DBAlbum[]> {
  const db = await getDB()
  return db.getAll('albums')
}

export async function getAlbum(id: string): Promise<DBAlbum | undefined> {
  const db = await getDB()
  return db.get('albums', id)
}

export async function getAlbumsByType(type: AlbumType): Promise<DBAlbum[]> {
  const db = await getDB()
  return db.getAllFromIndex('albums', 'type', type)
}

export async function bulkPutAlbums(albums: DBAlbum[]): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('albums', 'readwrite')
  await Promise.all([...albums.map((a) => tx.store.put(a)), tx.done])
}
