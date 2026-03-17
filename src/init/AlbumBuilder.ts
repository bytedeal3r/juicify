import type { ApiSong, ApiAlbum } from '@/types/api.types'
import type { DBSong, DBAlbum } from '@/types/db.types'

function splitNames(str: string): string[] {
  if (!str || str === 'N/A') return []
  return str.split(/[,&]/).map((s) => s.trim()).filter(Boolean)
}

function resolveImageUrl(imageUrl: string): string {
  if (!imageUrl || imageUrl === 'N/A') return ''
  if (imageUrl.startsWith('http')) return imageUrl
  return `https://juicewrldapi.com${imageUrl}`
}

export function mapApiSongToDBSong(song: ApiSong): DBSong {
  return {
    id: song.id,
    name: song.name || 'Unknown',
    category: song.category || 'unknown',
    eraId: song.era?.id ?? 0,
    eraName: song.era?.name ?? 'Unknown',
    eraTimeFrame: song.era?.time_frame ?? '',
    length: song.length || '0:00',
    fileNames: song.path && song.path !== 'N/A' ? [song.path] : [],
    imageUrl: resolveImageUrl(song.image_url),
    creditedArtists: splitNames(song.credited_artists),
    producers: splitNames(song.producers),
    releaseDate: song.release_date || null,
    dateLeaked: song.date_leaked || null,
    leakType: song.leak_type || null,
    notes: song.lyrics || null,
    additionalInformation: song.additional_information || null,
    sessionTitles: splitNames(song.session_titles),
    recordingLocations: splitNames(song.recording_locations),
    publicId: String(song.public_id),
    albumId: null,
    liked: false,
    addedAt: Date.now(),
  }
}

export function buildAlbums(
  songs: DBSong[],
  apiAlbums: ApiAlbum[]
): { songs: DBSong[]; albums: DBAlbum[] } {
  const albums: DBAlbum[] = []
  const songMap = new Map(songs.map((s) => [s.id, s]))

  // Official albums from API
  for (const apiAlbum of apiAlbums) {
    if (!apiAlbum.title) continue
    const titleLower = apiAlbum.title.toLowerCase()
    const trackIds = songs
      .filter((s) => s.eraName.toLowerCase().includes(titleLower) ||
        s.name.toLowerCase().includes(titleLower))
      .map((s) => s.id)

    const album: DBAlbum = {
      id: `official-${apiAlbum.id}`,
      title: apiAlbum.title,
      type: 'official',
      artist: apiAlbum.artist?.name || 'Juice WRLD',
      releaseDate: apiAlbum.release_date,
      description: apiAlbum.description || `Official album by Juice WRLD`,
      coverImageUrl: null,
      trackIds,
      trackCount: trackIds.length,
    }
    albums.push(album)
    for (const id of trackIds) {
      const s = songMap.get(id)
      if (s && !s.albumId) s.albumId = album.id
    }
  }

  // Era albums
  const eraGroups = new Map<string, DBSong[]>()
  for (const s of songs) {
    const key = s.eraName || 'Unknown'
    if (!eraGroups.has(key)) eraGroups.set(key, [])
    eraGroups.get(key)!.push(s)
  }
  for (const [eraName, eraSongs] of eraGroups) {
    const id = `era-${eraName.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
    albums.push({
      id,
      title: `${eraName} Era`,
      type: 'era',
      artist: 'Juice WRLD',
      releaseDate: eraSongs[0]?.eraTimeFrame || null,
      description: `Songs from the ${eraName} era`,
      coverImageUrl: eraSongs.find((s) => s.imageUrl)?.imageUrl || null,
      trackIds: eraSongs.map((s) => s.id),
      trackCount: eraSongs.length,
    })
  }

  // Category albums
  const catGroups = new Map<string, DBSong[]>()
  for (const s of songs) {
    const key = s.category || 'unknown'
    if (!catGroups.has(key)) catGroups.set(key, [])
    catGroups.get(key)!.push(s)
  }
  for (const [category, catSongs] of catGroups) {
    const id = `cat-${category.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
    albums.push({
      id,
      title: category.charAt(0).toUpperCase() + category.slice(1),
      type: 'category',
      artist: 'Juice WRLD',
      releaseDate: null,
      description: `${category} songs`,
      coverImageUrl: catSongs.find((s) => s.imageUrl)?.imageUrl || null,
      trackIds: catSongs.map((s) => s.id),
      trackCount: catSongs.length,
    })
  }

  return { songs: Array.from(songMap.values()), albums }
}
