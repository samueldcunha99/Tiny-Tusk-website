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
