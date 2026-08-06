/**
 * Bakes the rendered app into dist/index.html.
 *
 * Runs after both Vite builds: the client build writes dist/index.html with an
 * empty root, and the SSR build writes dist-ssr/entry-server.js. This swaps the
 * empty root for real markup so the browser paints text before it has parsed a
 * single byte of the bundle. The client then hydrates that markup in place.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'

const HTML = 'dist/index.html'
const EMPTY_ROOT = '<div id="root"></div>'

const { render } = await import(pathToFileURL('dist-ssr/entry-server.js').href)
const html = await readFile(HTML, 'utf8')

if (!html.includes(EMPTY_ROOT)) {
  throw new Error(`prerender: could not find ${EMPTY_ROOT} in ${HTML}`)
}

const markup = render()
if (!markup.trim()) {
  throw new Error('prerender: render() returned nothing')
}

await writeFile(HTML, html.replace(EMPTY_ROOT, `<div id="root">${markup}</div>`))
console.log(`prerender: baked ${(markup.length / 1024).toFixed(1)} KiB into ${HTML}`)
