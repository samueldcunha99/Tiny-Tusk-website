/**
 * Bakes the rendered app into dist/index.html, and gives every route its own
 * HTML file with its own head.
 *
 * Runs after both Vite builds: the client build writes dist/index.html with an
 * empty root, and the SSR build writes dist-ssr/entry-server.js. This swaps the
 * empty root for real markup where the app can render on the server (the
 * holding screen), so the browser paints text before it has parsed a byte of
 * the bundle.
 *
 * While the full site is open it renders in the browser (see entry-server), but
 * each route still gets `dist/<route>/index.html` with its own title,
 * description and social tags -- a link shared on WhatsApp, or a crawler that
 * does not run JavaScript, sees the right page before any script runs. Static
 * hosts serve those files ahead of the catch-all in `public/_redirects`.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const HTML = 'dist/index.html'
const EMPTY_ROOT = '<div id="root"></div>'

const { render, prerenderMode, prerenderRoutes } = await import(
  pathToFileURL('dist-ssr/entry-server.js').href
)
const html = await readFile(HTML, 'utf8')

if (!html.includes(EMPTY_ROOT)) {
  throw new Error(`prerender: could not find ${EMPTY_ROOT} in ${HTML}`)
}

const markup = render()
if (!markup.trim() && prerenderMode !== 'client') {
  throw new Error('prerender: render() returned nothing')
}

const baked = html.replace(EMPTY_ROOT, `<div id="root">${markup}</div>`)

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Swap one tag's content, and fail loudly if index.html stops carrying it. */
function swap(page, pattern, value) {
  if (!pattern.test(page)) throw new Error(`prerender: ${pattern} not found in ${HTML}`)
  return page.replace(pattern, (_, open, close) => `${open}${escape(value)}${close}`)
}

function withHead(page, { title, description, noIndex }) {
  let out = swap(page, /(<title>)[^<]*(<\/title>)/, title)
  out = swap(out, /(<meta\s+name="description"\s+content=")[^"]*(")/, description)
  out = swap(out, /(<meta\s+property="og:title"\s+content=")[^"]*(")/, title)
  out = swap(out, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, description)
  out = swap(out, /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, title)
  out = swap(out, /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, description)
  return noIndex
    ? out.replace('</head>', '  <meta name="robots" content="noindex, nofollow" />\n  </head>')
    : out
}

if (prerenderMode === 'client') {
  // The holding screen serves every URL while the gate is on, so per-route
  // heads only make sense once the full site is open.
  const routes = prerenderRoutes()
  for (const route of routes) {
    const file = route.path === '/' ? HTML : `dist${route.path}/index.html`
    if (route.path !== '/') await mkdir(`dist${route.path}`, { recursive: true })
    await writeFile(file, withHead(baked, route))
  }
  console.log(`prerender: full site uses client rendering; wrote ${routes.length} route heads`)
} else {
  await writeFile(HTML, baked)
  console.log(`prerender: baked ${(markup.length / 1024).toFixed(1)} KiB into ${HTML}`)
}
