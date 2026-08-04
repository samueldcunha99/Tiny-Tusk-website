import { useEffect, useState } from 'react'

/**
 * The desktop/mobile split point. Mirrors Tailwind's `md` (768px) so a mobile
 * twin and a `max-md:` utility can never disagree about which side they are on.
 */
export const MOBILE_QUERY = '(max-width: 767px)'

/**
 * Which layout family to render.
 *
 * Sections that have a mobile twin dispatch on this. The two trees are
 * mutually exclusive: only one mounts, so only one builds GSAP contexts and
 * only one is in the DOM. Crossing the breakpoint unmounts the outgoing tree,
 * which reverts its context -- that is the intended cleanup path, so mobile
 * twins must follow the same `gsap.context` + revert-on-unmount contract as
 * every other section.
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
