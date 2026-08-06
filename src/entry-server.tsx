import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'

import App from './App'

/**
 * Build-time entry. `scripts/prerender.mjs` calls this once and bakes the
 * result into `dist/index.html`, so the first paint is real HTML instead of an
 * empty `<div id="root">` waiting on 150 KiB of JavaScript.
 *
 * Nothing here runs in production -- the browser gets the string, not this
 * module.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
