import { openDB, type IDBPDatabase } from 'idb'
import type { DBSong, DBAlbum, DBPlaylist, DBHistory, DBMeta } from '@/types/db.types'

export interface JuicifyDB {
  songs: {
    key: number
    value: DBSong
    indexes: {
      name: string
      category: string
      eraName: string
      releaseDate: string
      publicId: string
    }
  }
  albums: {
    key: string
    value: DBAlbum
    indexes: { type: string; title: string }
  }
  playlists: {
    key: string
    value: DBPlaylist
    indexes: { systemKey: string }
  }
  history: {
    key: number
    value: DBHistory
    indexes: { songId: number; playedAt: number }
  }
  meta: {
    key: string
    value: DBMeta
  }
  downloads: {
    key: number
    value: { id: number; blob: Blob; downloadedAt: number }
  }
}

let dbPromise: Promise<IDBPDatabase<JuicifyDB>> | null = null

function createStores(db: IDBPDatabase<JuicifyDB>) {
  const songsStore = db.createObjectStore('songs', { keyPath: 'id' })
  songsStore.createIndex('name', 'name')
  songsStore.createIndex('category', 'category')
  songsStore.createIndex('eraName', 'eraName')
  songsStore.createIndex('releaseDate', 'releaseDate')
  songsStore.createIndex('publicId', 'publicId') // not unique — API has duplicate public_ids

  const albumsStore = db.createObjectStore('albums', { keyPath: 'id' })
  albumsStore.createIndex('type', 'type')
  albumsStore.createIndex('title', 'title')

  const playlistsStore = db.createObjectStore('playlists', { keyPath: 'id' })
  playlistsStore.createIndex('systemKey', 'systemKey')

  const historyStore = db.createObjectStore('history', { keyPath: 'id', autoIncrement: true })
  historyStore.createIndex('songId', 'songId')
  historyStore.createIndex('playedAt', 'playedAt')

  if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' })
  if (!db.objectStoreNames.contains('downloads')) db.createObjectStore('downloads', { keyPath: 'id' })
}

export function getDB(): Promise<IDBPDatabase<JuicifyDB>> {
  if (!dbPromise) {
    dbPromise = openDB<JuicifyDB>('juicify-db', 2, {
      upgrade(db, oldVersion) {
        // v1 had unique publicId index — drop and recreate songs/albums stores
        if (oldVersion < 2) {
          if (db.objectStoreNames.contains('songs')) db.deleteObjectStore('songs')
          if (db.objectStoreNames.contains('albums')) db.deleteObjectStore('albums')
          if (db.objectStoreNames.contains('playlists')) db.deleteObjectStore('playlists')
          if (db.objectStoreNames.contains('history')) db.deleteObjectStore('history')
        }
        createStores(db)
      },
    })
  }
  return dbPromise
}
