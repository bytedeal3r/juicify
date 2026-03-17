import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from '@/components/layout/AppShell'
import { Home } from '@/pages/Home'
import { Search } from '@/pages/Search'
import { Library } from '@/pages/Library'
import { LikedSongs } from '@/pages/LikedSongs'
import { AlbumDetail } from '@/pages/AlbumDetail'
import { PlaylistDetail } from '@/pages/PlaylistDetail'
import { NotFound } from '@/pages/NotFound'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000 } },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="library" element={<Library />} />
            <Route path="liked" element={<LikedSongs />} />
            <Route path="album/:id" element={<AlbumDetail />} />
            <Route path="playlist/:id" element={<PlaylistDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
