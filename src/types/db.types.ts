export interface DBSong {
  id: number
  name: string
  category: string
  eraId: number
  eraName: string
  eraTimeFrame: string
  length: string
  fileNames: string[]
  imageUrl: string
  creditedArtists: string[]
  producers: string[]
  releaseDate: string | null
  dateLeaked: string | null
  leakType: string | null
  notes: string | null
  additionalInformation: string | null
  sessionTitles: string[]
  recordingLocations: string[]
  publicId: string
  albumId: string | null
  liked: boolean
  addedAt: number
}

export type AlbumType = 'official' | 'era' | 'category'

export interface DBAlbum {
  id: string
  title: string
  type: AlbumType
  artist: string
  releaseDate: string | null
  description: string
  coverImageUrl: string | null
  trackIds: number[]
  trackCount: number
}

export interface DBPlaylist {
  id: string
  name: string
  description: string
  coverImageUrl: string | null
  songIds: number[]
  createdAt: number
  updatedAt: number
  isSystem: boolean
  systemKey: string | null
}

export interface DBHistory {
  id?: number
  songId: number
  playedAt: number
  durationListened: number
  weekKey: string
}

export interface DBMeta {
  key: string
  value: unknown
}
