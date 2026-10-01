import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { handleBookingSubmission } from './src/server/bookingHandler'

function bookingApiPlugin(): Plugin {
  return {
    name: 'booking-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/submit-booking', (req, res) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
          res.statusCode = 204
          res.end()
          return
        }

        if (req.method === 'POST') {
          let data = ''
          req.on('data', (chunk) => {
            data += chunk
          })
          req.on('end', async () => {
            let body = {}
            try {
              body = JSON.parse(data)
            } catch {}
            const result = await handleBookingSubmission(body)
            res.setHeader('Content-Type', 'application/json')
            res.statusCode = result.ok ? 200 : 400
            res.end(JSON.stringify(result))
          })
          return
        }

        res.statusCode = 405
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Method not allowed' }))
      })
    },
  }
}

export default defineConfig(({ mode, isSsrBuild }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))
  return {
    plugins: [react(), bookingApiPlugin()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    // The prerender pass writes `dist-ssr/`, which the dev server would
    // otherwise watch; on this OneDrive folder a freshly written file can be
    // locked (EBUSY) and that crashes `npm run dev` mid-build.
    server: {
      watch: { ignored: ['**/dist/**', '**/dist-ssr/**'] },
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      // The prerender pass reads it to preload the lazy site chunk, then deletes
      // it so it is not published.
      manifest: !isSsrBuild,
      rollupOptions: {
        // The prerender pass externalises its dependencies, so splitting them
        // into vendor chunks is both pointless and a hard rollup error there.
        output: isSsrBuild
          ? {}
          : {
              manualChunks: {
                gsap: ['gsap'],
                react: ['react', 'react-dom'],
              },
            },
      },
    },
  }
})
