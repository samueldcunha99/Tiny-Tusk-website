import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
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
}))
