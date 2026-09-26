/**
 * Writes every page of the site as finished HTML.
 *
 * Runs after both Vite builds: the client build writes dist/index.html with an
 * empty root, and the SSR build writes dist-ssr/entry-server.js. For every
 * route this renders the page into the root and gives the file its own head --
 * title, description, canonical link, social tags -- so the browser paints the
 * real page before its script arrives, and a crawler or a link preview that
 * runs no JavaScript reads the same page. The browser then hydrates it.
 *
 * Written here too, since they come from the same route list: dist/404.html,
 * which Netlify serves with a real 404 for every other path (public/_redirects
 * has no catch-all), sitemap.xml and llms.txt.
 *
 * Two changes to the head every page shares:
 *   - the stylesheet is inlined; it was the one render-blocking request left
 *   - the lazy site chunk gets a modulepreload, so it downloads alongside the
 *     entry script rather than after it
 */
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { Writable } from 'node:stream'
import { pathToFileURL } from 'node:url'

const DIST = 'dist'
const HTML = `${DIST}/index.html`
const EMPTY_ROOT = '<div id="root"></div>'

const {
  render,
  prerenderRoutes,
  NOT_FOUND_HEAD,
  OPENING_SOON,
  SITE_URL,
  CLINIC,
  CLINIC_ADDRESS_LINE,
  CLINIC_PHONE,
} = await import(pathToFileURL('dist-ssr/entry-server.js').href)

let template = await readFile(HTML, 'utf8')
if (!template.includes(EMPTY_ROOT)) {
  throw new Error(`prerender: could not find ${EMPTY_ROOT} in ${HTML}`)
}
template = await inlineStylesheet(template)
template = await preloadSiteChunk(template)
// Link previews want the image as a full address.
template = template.replaceAll('content="/og-image.png"', `content="${SITE_URL}/og-image.png"`)

/**
 * A page's full address, with the trailing slash Netlify serves it at: each
 * page is a folder's index.html, and the bare path is a 301 to the slashed one.
 * Canonical links and the sitemap must name the address that answers 200.
 */
const url = (path) => `${SITE_URL}${path === '/' ? '/' : `${path}/`}`

/** One path's markup, once every lazy chunk has resolved. */
async function renderPage(path) {
  const stream = await render(path)
  const chunks = []
  await new Promise((resolve, reject) => {
    const sink = new Writable({
      write(chunk, _encoding, done) {
        chunks.push(Buffer.from(chunk))
        done()
      },
    })
    sink.on('finish', resolve)
    sink.on('error', reject)
    stream.pipe(sink)
  })
  const markup = Buffer.concat(chunks).toString('utf8')
  if (!markup.trim()) throw new Error(`prerender: ${path} rendered nothing`)
  return markup
}

/** A function replacement, so a `$` in the markup is never read as a pattern. */
const withBody = (page, markup) => page.replace(EMPTY_ROOT, () => `<div id="root">${markup}</div>`)

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Swap one tag's content, and fail loudly if index.html stops carrying it. */
function swap(page, pattern, value) {
  if (!pattern.test(page)) throw new Error(`prerender: ${pattern} not found in ${HTML}`)
  return page.replace(pattern, (_, open, close) => `${open}${escape(value)}${close}`)
}

function withHead(page, { path, title, description, noIndex }) {
  let out = swap(page, /(<title>)[^<]*(<\/title>)/, title)
  out = swap(out, /(<meta\s+name="description"\s+content=")[^"]*(")/, description)
  out = swap(out, /(<meta\s+property="og:title"\s+content=")[^"]*(")/, title)
  out = swap(out, /(<meta\s+property="og:description"\s+content=")[^"]*(")/, description)
  out = swap(out, /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, title)
  out = swap(out, /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, description)
  const tags = noIndex
    ? '<meta name="robots" content="noindex, nofollow" />'
    : `<link rel="canonical" href="${url(path)}" />\n    <meta property="og:url" content="${url(path)}" />`
  return out.replace('</head>', () => `  ${tags}\n  </head>`)
}

async function inlineStylesheet(page) {
  const link = page.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/)
  if (!link) throw new Error(`prerender: no stylesheet link in ${HTML}`)
  const css = await readFile(`${DIST}${link[1]}`, 'utf8')
  return page.replace(link[0], () => `<style>${css}</style>`)
}

async function preloadSiteChunk(page) {
  const manifest = JSON.parse(await readFile(`${DIST}/.vite/manifest.json`, 'utf8'))
  const site = manifest['src/Site.tsx']
  if (!site) throw new Error('prerender: src/Site.tsx is not in the build manifest')
  const files = [site.file, ...(site.imports ?? []).map((key) => manifest[key].file)]
  const links = files
    .filter((file) => !page.includes(`/${file}"`))
    .map((file) => `<link rel="modulepreload" crossorigin href="/${file}">`)
    .join('\n    ')
  return page.replace('</head>', () => `  ${links}\n  </head>`)
}

function sitemap(routes) {
  const urls = routes.filter((route) => !route.noIndex).map((route) => `  <url><loc>${url(route.path)}</loc></url>`)
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

/** llms.txt (llmstxt.org): the site in brief, then every page as a link. */
function llms(routes) {
  const home = routes.find((route) => route.path === '/')
  const item = (route) => `- [${route.title.replace(/ \| Tiny Tusk$/, '')}](${url(route.path)}): ${route.description}`
  const isPost = (route) => route.path.startsWith('/parents-corner/')
  return [
    `# ${CLINIC.fullName}`,
    '',
    `> ${home.description}`,
    '',
    `Address: ${CLINIC_ADDRESS_LINE}. Phone: ${CLINIC_PHONE.display}.`,
    '',
    '## Pages',
    '',
    ...routes.filter((route) => !route.noIndex && !isPost(route)).map(item),
    '',
    "## Parents' Corner",
    '',
    ...routes.filter(isPost).map(item),
    '',
  ].join('\n')
}

if (OPENING_SOON) {
  // The holding screen answers every URL while the gate is on.
  const page = withBody(template, await renderPage('/'))
  await writeFile(HTML, page)
  await writeFile(`${DIST}/404.html`, page)
  console.log('prerender: holding screen written to index.html and 404.html')
} else {
  const routes = prerenderRoutes()
  for (const route of routes) {
    const file = route.path === '/' ? HTML : `${DIST}${route.path}/index.html`
    if (route.path !== '/') await mkdir(`${DIST}${route.path}`, { recursive: true })
    await writeFile(file, withHead(withBody(template, await renderPage(route.path)), route))
  }
  const notFound = await renderPage('/404')
  await writeFile(`${DIST}/404.html`, withHead(withBody(template, notFound), { path: '/404', ...NOT_FOUND_HEAD }))
  await writeFile(`${DIST}/sitemap.xml`, sitemap(routes))
  await writeFile(`${DIST}/llms.txt`, llms(routes))
  console.log(`prerender: wrote ${routes.length} pages, 404.html, sitemap.xml and llms.txt`)
}

await rm(`${DIST}/.vite`, { recursive: true, force: true })
