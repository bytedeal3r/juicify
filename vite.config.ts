import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        name: 'Juicify',
        short_name: 'Juicify',
        description: 'Juice WRLD Music Player',
        theme_color: '#0a0a0f',
        background_color: '#0a0a0f',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\/api\/files\/cover-art/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cover-art-cache',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
          {
            urlPattern: /\/juicewrld\/files\/download/,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /\/api\/(albums|eras|categories|stats)/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'api-metadata-cache' },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    proxy: {
      '/juicewrld': { target: 'https://juicewrldapi.com', changeOrigin: true, secure: true },
      '/assets':    { target: 'https://juicewrldapi.com', changeOrigin: true, secure: true },
    },
  },
})
