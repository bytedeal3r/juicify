export interface ApiEra {
  id: number
  name: string
  description: string
  time_frame: string
  play_count: number
}

export interface ApiSong {
  id: number
  public_id: number
  name: string
  category: string
  era: ApiEra
  path: string
  track_titles: string[]
  credited_artists: string
  producers: string
  engineers: string
  recording_locations: string
  record_dates: string
  length: string
  additional_information: string
  file_names: string
  lyrics: string
  date_leaked: string
  leak_type: string
  image_url: string
  release_date: string
  session_titles: string
}

export interface ApiPaginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiAlbum {
  id: number
  title: string
  type: string
  release_date: string | null
  description: string
  artist: { id: number; name: string }
}

export interface ApiCategory {
  value: string
  label: string
}
