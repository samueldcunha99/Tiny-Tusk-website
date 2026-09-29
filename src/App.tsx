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
  const isPreviewComingSoon =
    typeof window !== 'undefined' &&
    (window.location.search.includes('coming-soon') || window.location.pathname === '/coming-soon')

  // Pre-opening gate: every production URL renders the holding screen and
  // nothing else mounts. Development mode on localhost bypasses this unless
  // requested via ?coming-soon.
  if (OPENING_SOON && (!import.meta.env.DEV || isPreviewComingSoon)) {
    return <OpeningSoon />
  }

  return (
    <Suspense fallback={null}>
      <Site />
    </Suspense>
  )
}
