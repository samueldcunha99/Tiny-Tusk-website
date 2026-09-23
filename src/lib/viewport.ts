import { useEffect, useState } from 'react'

/**
 * The desktop/mobile split point. Mirrors Tailwind's `md` (768px) so a mobile
 * twin and a `max-md:` utility can never disagree about which side they are on.
 */
export const MOBILE_QUERY = '(max-width: 767px)'

/**
 * Which side of the `md` split the viewport is on.
 *
 * No section has a separate mobile twin any more (the 2026-09-23 redesign made
 * every section one responsive component). Today only the nav reads this, to
 * size its mark. Prefer responsive classes; reach for this only when a value
 * cannot be expressed in CSS. If a twin ever returns, only one tree mounts, so
 * it must follow the same `gsap.context` + revert-on-unmount contract.
 */
export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY)
}

/**
 * Subscribe to any media query. Use `useIsMobile` for the layout-family split;
 * this is for the rare component whose own breakpoint is not that split -- the
 * nav, whose link row needs more room than `md` gives it.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}
