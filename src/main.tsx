import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found')

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// `scripts/prerender.mjs` bakes the markup into index.html at build time, so in
// production there is already a tree here to adopt. `npm run dev` serves the
// empty root, and falls through to a normal client render.
if (container.firstChild) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
