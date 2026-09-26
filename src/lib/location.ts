/**
 * The path being rendered. The browser reads its own address; the build
 * prerenders each route in turn (`entry-server.tsx`) and says which one first,
 * so the HTML it writes is the same page the browser then hydrates.
 */
let serverPath = '/'

export function setServerPath(path: string): void {
  serverPath = path
}

/** Without its trailing slash, so `/faq/` and `/faq` are one route. */
export function currentPath(): string {
  const raw = typeof window === 'undefined' ? serverPath : window.location.pathname
  return raw.replace(/\/+$/, '') || '/'
}
