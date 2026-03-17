import { fetchAllSongs } from './SongFetcher'
import { mapApiSongToDBSong, buildAlbums } from './AlbumBuilder'
import { fetchAlbums } from '@/api/albums'
import { bulkPutSongs, bulkPutAlbums, setMeta } from '@/db'
import type { InitPhase } from './InitProgressStore'
import type { DBPlaylist } from '@/types/db.types'
import { putPlaylist } from '@/db/playlists'

type ProgressCallback = (phase: InitPhase, progress: number, message: string) => void

export async function runInitPipeline(onProgress: ProgressCallback): Promise<void> {
  // 1. Fetch all songs
  const apiSongs = await fetchAllSongs(onProgress)

  // 2. Fetch metadata
  onProgress('metadata', 62, 'Fetching album metadata...')
  let apiAlbums: import('@/types/api.types').ApiAlbum[] = []
  try {
    apiAlbums = await fetchAlbums()
  } catch {
    console.warn('Failed to fetch albums, continuing without')
  }

  // 3. Build albums
  onProgress('building', 70, 'Building album collections...')
  const dbSongs = apiSongs.map(mapApiSongToDBSong).filter((s) => s.fileNames.length > 0)
  const { songs: songsWithAlbums, albums } = buildAlbums(dbSongs, apiAlbums)

  // 4. Bulk write to IDB in 500-record batches
  onProgress('writing', 75, 'Writing songs to local database...')
  const batchSize = 500
  for (let i = 0; i < songsWithAlbums.length; i += batchSize) {
    const batch = songsWithAlbums.slice(i, i + batchSize)
    await bulkPutSongs(batch)
    const pct = 75 + Math.round(((i + batch.length) / songsWithAlbums.length) * 15)
    onProgress('writing', pct, `Writing songs ${i + batch.length}/${songsWithAlbums.length}...`)
  }

  // 5. Write albums
  onProgress('writing', 90, 'Writing albums...')
  await bulkPutAlbums(albums)

  // 6. Create system playlists
  onProgress('writing', 95, 'Setting up playlists...')
  const likedPlaylist: DBPlaylist = {
    id: 'liked-songs',
    name: 'Liked Songs',
    description: 'Songs you have liked',
    coverImageUrl: null,
    songIds: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isSystem: true,
    systemKey: 'liked',
  }
  await putPlaylist(likedPlaylist)

  // 7. Mark init complete
  await setMeta('initComplete', true)
  await setMeta('initVersion', '1')
  await setMeta('totalSongs', songsWithAlbums.length)

  onProgress('complete', 100, `Ready! ${songsWithAlbums.length} songs loaded.`)
}
