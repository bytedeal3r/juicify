export { getDB } from './schema'
export * from './songs'
export * from './albums'
export * from './playlists'
export * from './history'

import { getDB } from './schema'

export async function getMeta<T>(key: string): Promise<T | undefined> {
  const db = await getDB()
  const record = await db.get('meta', key)
  return record?.value as T | undefined
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  const db = await getDB()
  await db.put('meta', { key, value })
}

export async function isInitComplete(): Promise<boolean> {
  const val = await getMeta<boolean>('initComplete')
  return val === true
}
