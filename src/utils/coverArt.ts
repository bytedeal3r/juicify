export function getSongCoverUrl(song: { imageUrl?: string; fileNames?: string[] }): string | null {
  if (song.imageUrl) return song.imageUrl
  return null
}

export function getFallbackCover(title?: string): string {
  const colors = ['#bf5fff', '#00d4ff', '#00ff88', '#ff4444', '#ffaa00']
  const idx = title ? title.charCodeAt(0) % colors.length : 0
  const color = colors[idx]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="${color}22"/>
    <text x="100" y="110" font-size="80" text-anchor="middle" fill="${color}" opacity="0.8">&#9834;</text>
  </svg>`
  return `data:image/svg+xml;base64,${btoa(svg)}`
}
