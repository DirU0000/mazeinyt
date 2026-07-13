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
          const { getChannelRanking } = await server.ssrLoadModule('/api/_lib/channels.ts')
          const url = new URL(req.url ?? '', 'http://localhost')
          const country = url.searchParams.get('country') ?? 'global'
          const mode = url.searchParams.get('mode') ?? 'continuous'
          const min = url.searchParams.get('min')
          const max = url.searchParams.get('max')
          const customRange = mode === 'custom' && min && max
            ? { min: Number(min), max: Number(max) }
            : undefined
          const channels = await getChannelRanking(country, mode, customRange)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ channels }))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: (err as Error).message }))
        }
      })

      server.middlewares.use('/api/board', async (req, res) => {
        // POST/PATCH/DELETE의 JSON 본문을 직접 읽는다 (connect 미들웨어는 자동 파싱 안 함).
        function readBody(): Promise<any> {
          return new Promise((resolve) => {
            let raw = ''
            req.on('data', (chunk) => (raw += chunk))
            req.on('end', () => {
              try { resolve(raw ? JSON.parse(raw) : {}) } catch { resolve({}) }
            })
          })
        }
        try {
          const board = await server.ssrLoadModule('/api/_lib/board.ts')
          const url = new URL(req.url ?? '', 'http://localhost')
          const idParam = url.searchParams.get('id')
          const id = idParam ? Number(idParam) : undefined
          res.setHeader('Content-Type', 'application/json')

          if (req.method === 'GET') {
            if (id !== undefined) {
              const post = await board.getPost(id)
              if (!post) { res.statusCode = 404; res.end(JSON.stringify({ error: 'post not found' })); return }
              res.end(JSON.stringify({ post })); return
            }
            const posts = await board.listPosts(url.searchParams.get('category') ?? undefined)
            res.end(JSON.stringify({ posts })); return
          }
          if (req.method === 'POST') {
            const post = await board.createPost(await readBody())
            res.statusCode = 201; res.end(JSON.stringify({ post })); return
          }
          if (req.method === 'PATCH') {
            if (id === undefined) { res.statusCode = 400; res.end(JSON.stringify({ error: 'id required' })); return }
            const post = await board.updatePost(id, await readBody())
            res.end(JSON.stringify({ post })); return
          }
          if (req.method === 'DELETE') {
            if (id === undefined) { res.statusCode = 400; res.end(JSON.stringify({ error: 'id required' })); return }
            await board.deletePost(id, (await readBody()).password)
            res.end(JSON.stringify({ ok: true })); return
          }
          res.statusCode = 405; res.end(JSON.stringify({ error: 'method not allowed' }))
        } catch (err) {
          const status = (err as any)?.status ?? 500
          res.statusCode = status
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
  process.env.SUPABASE_URL = env.SUPABASE_URL
  process.env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY

  return {
    plugins: [react(), localApiPlugin()],
  }
})
