import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 3001
const app = express()

const proxyOptions = {
  target: 'https://juicewrldapi.com',
  changeOrigin: true,
  on: {
    error: (err, _req, res) => {
      console.error('[Proxy Error]', err.message)
      res.writeHead(502, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Proxy error', message: err.message }))
    },
  },
}

app.use(createProxyMiddleware({
  ...proxyOptions,
  pathFilter: ['/juicewrld/**', '/files/**'],
}))

// Serve built frontend in production
const distPath = join(__dirname, 'dist')
app.use(express.static(distPath))
app.get(/.*/, (_req, res) => {
  res.sendFile(join(distPath, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`[proxy] running on http://localhost:${PORT}`)
})
