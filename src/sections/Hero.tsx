import { useIsMobile } from '@/lib/viewport'
// Imported under an alias so `Hero.desktop.tsx` keeps its original export name
// and stays byte-for-byte the file that shipped. Mobile work never edits it.
import { Hero as HeroDesktop } from './Hero.desktop'
import { HeroMobile } from './Hero.mobile'

/**
 * Layout dispatcher. See `src/lib/viewport.ts` for the contract: exactly one
 * of the two trees mounts, so desktop behaviour below `md` is unchanged only
 * because `HeroDesktop` is never rendered there -- not because anything in it
 * was adjusted.
 */
export function Hero() {
  return useIsMobile() ? <HeroMobile /> : <HeroDesktop />
}
