import { lazy, Suspense } from 'react'
import { OPENING_SOON } from '@/content/site'
import { OpeningSoon } from '@/sections/OpeningSoon'

/**
 * The full site is a separate chunk so the pre-opening gate does not pay for
 * it. Static imports here shipped all eighteen sections to every visitor while
 * only the holding screen rendered -- Lighthouse counted 227 KiB of it unused.
 */
// The prerender pass renders this with the streaming renderer, which waits for
// the chunk, so every page's HTML holds the finished site to hydrate
// (entry-server.tsx). The prerendered page names the chunk in a modulepreload,
// so it downloads alongside the entry rather than after it.
const Site = lazy(() => import('@/Site'))

export default function App() {
  const isDevBypass =
    typeof window !== 'undefined' &&
    (window.location.search.includes('site') || window.location.search.includes('full'))

  // Pre-opening gate: while OPENING_SOON is true, the holding screen renders
  // for all routes. In development, ?site or ?full bypasses to preview the full site.
  if (OPENING_SOON && !(import.meta.env.DEV && isDevBypass)) {
    return <OpeningSoon />
  }

  return (
    <Suspense fallback={null}>
      <Site />
    </Suspense>
  )
}
