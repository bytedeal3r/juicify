import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/juicewrld',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (r) => r,
  (err) => {
    console.error('[API Error]', err.message)
    return Promise.reject(err)
  }
)
