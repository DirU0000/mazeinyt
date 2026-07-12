import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// 로컬 개발 중에는 vercel dev 없이도 /api/*를 같은 vite 서버가 처리하도록
// 얇은 미들웨어를 붙인다. 실제 배포 시에는 api/*.ts가 Vercel Functions로 그대로 동작한다.
function localApiPlugin(): Plugin {
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use('/api/trending', async (req, res) => {
        try {
          const { getTrendingWithFallback } = await server.ssrLoadModule('/api/_lib/trending.ts')
          const url = new URL(req.url ?? '', 'http://localhost')
          const country = url.searchParams.get('country') ?? 'global'
          const category = url.searchParams.get('category') ?? 'all'
          const result = await getTrendingWithFallback(country, category)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: (err as Error).message }))
        }
      })

      server.middlewares.use('/api/keywords', async (_req, res) => {
        try {
          const { getKeywordsForCountry } = await server.ssrLoadModule('/api/_lib/keywords.ts')
          const [us, jp, kr] = await Promise.all([
            getKeywordsForCountry('us'),
            getKeywordsForCountry('jp'),
            getKeywordsForCountry('kr'),
          ])
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ us, jp, kr }))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: (err as Error).message }))
        }
      })

      server.middlewares.use('/api/channels', async (req, res) => {
        try {
          const { getChannelSurge } = await server.ssrLoadModule('/api/_lib/channels.ts')
          const url = new URL(req.url ?? '', 'http://localhost')
          const country = url.searchParams.get('country') ?? 'global'
          const channels = await getChannelSurge(country)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ channels }))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: (err as Error).message }))
        }
      })

      server.middlewares.use('/api/video', async (req, res) => {
        try {
          const { getVideoDetail } = await server.ssrLoadModule('/api/_lib/videoDetail.ts')
          const url = new URL(req.url ?? '', 'http://localhost')
          const id = url.searchParams.get('id') ?? ''
          const video = await getVideoDetail(id)
          res.setHeader('Content-Type', 'application/json')
          if (!video) {
            res.statusCode = 404
            res.end(JSON.stringify({ error: 'video not found' }))
            return
          }
          res.end(JSON.stringify({ video }))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: (err as Error).message }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  process.env.YOUTUBE_API_KEY = env.YOUTUBE_API_KEY

  return {
    plugins: [react(), localApiPlugin()],
  }
})
