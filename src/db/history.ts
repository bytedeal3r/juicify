import { getDB } from './schema'
import type { DBHistory } from '@/types/db.types'

export async function addHistoryEntry(entry: Omit<DBHistory, 'id'>): Promise<void> {
  const db = await getDB()
  await db.add('history', entry as DBHistory)
}

export async function getRecentHistory(limit = 50): Promise<DBHistory[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex('history', 'playedAt')
  return all.reverse().slice(0, limit)
}

export async function getHistoryForWeek(weekKey: string): Promise<DBHistory[]> {
  const db = await getDB()
  const all = await db.getAll('history')
  return all.filter((h) => h.weekKey === weekKey)
}

export async function getTopSongsForWeek(
  weekKey: string,
  limit = 20
): Promise<{ songId: number; playCount: number }[]> {
  const entries = await getHistoryForWeek(weekKey)
  const counts = new Map<number, number>()
  for (const e of entries) {
    counts.set(e.songId, (counts.get(e.songId) ?? 0) + 1)
  }
  return Array.from(counts.entries())
    .map(([songId, playCount]) => ({ songId, playCount }))
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, limit)
}
