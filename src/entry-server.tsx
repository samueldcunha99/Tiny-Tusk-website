import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'

import App from './App'
import { OPENING_SOON } from './content/site'

export { prerenderRoutes } from './content/routes'

// The holding screen is synchronous. The routed site is lazy and uses browser
// APIs, so renderToString cannot produce a completed tree for it to hydrate.
export const prerenderMode = OPENING_SOON ? 'static' : 'client'

/**
 * Build-time entry. `scripts/prerender.mjs` calls this once and bakes the
 * result into `dist/index.html`, so the first paint is real HTML instead of an
 * empty `<div id="root">` waiting on 150 KiB of JavaScript.
 *
 * Nothing here runs in production -- the browser gets the string, not this
 * module.
 */
export function render(): string {
  if (prerenderMode === 'client') return ''
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
