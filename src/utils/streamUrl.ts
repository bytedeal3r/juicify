const FILES_BASE = '/juicewrld/files'

export function getStreamUrl(filePath: string): string {
  return `${FILES_BASE}/download/?path=${encodeURIComponent(filePath)}`
}

export function getCoverArtUrl(path: string): string {
  return `${FILES_BASE}/cover-art?path=${encodeURIComponent(path)}`
}

export function getFirstStreamUrl(fileNames: string[]): string | null {
  if (!fileNames?.length) return null
  return getStreamUrl(fileNames[0])
}
