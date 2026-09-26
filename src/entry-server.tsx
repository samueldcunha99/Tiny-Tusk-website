import { StrictMode } from 'react'
import { renderToPipeableStream, type PipeableStream } from 'react-dom/server'

import App from './App'
import { setServerPath } from './lib/location'

export { NOT_FOUND_HEAD, prerenderRoutes } from './content/routes'
export { CLINIC, CLINIC_ADDRESS_LINE, CLINIC_PHONE, OPENING_SOON, SITE_URL } from './content/site'

/**
 * Build-time entry. `scripts/prerender.mjs` renders every route through this
 * and writes the markup into that route's own HTML file, so the first paint is
 * the real page -- its words, headings and links -- before any script runs,
 * and a crawler that runs no JavaScript reads it too. The browser then
 * hydrates it (main.tsx).
 *
 * The streaming renderer rather than `renderToString`, because the site is a
 * lazy chunk (App.tsx) and only the streaming renderer waits for it. The old
 * `renderToString` pass emitted the boundary unfinished, and hydrating that was
 * React #419. The stream is handed over once everything is ready, so the
 * markup comes out complete and in order.
 *
 * Nothing here runs in production -- the browser gets the HTML, not this
 * module.
 */
export function render(path: string): Promise<PipeableStream> {
  setServerPath(path)
  return new Promise((resolve, reject) => {
    const stream = renderToPipeableStream(
      <StrictMode>
        <App />
      </StrictMode>,
      {
        onAllReady: () => resolve(stream),
        onShellError: reject,
        onError: reject,
      },
    )
  })
}
