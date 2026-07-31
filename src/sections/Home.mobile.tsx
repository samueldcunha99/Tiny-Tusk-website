import { SectionOrder } from '@/content/sectionOrder'
import type { SectionId } from '@/content/site'
import { Hero } from './Hero'
import { GuidedEntryMobile } from './GuidedEntry.mobile'
import { Journey } from './Journey'
import { Services } from './Services'
import { Booking } from './Booking'

/**
 * What this page renders, in order. Because seven sections are dropped below,
 * numbering off the registry would have the phone count `00 01 02 03 11`; the
 * numbers are counted off this list instead. See `sectionOrder.tsx`.
 */
const HOME_MOBILE_ORDER: readonly SectionId[] = ['hero', 'paths', 'journey', 'services', 'book']

/**
 * The mobile home page.
 *
 * It is a real page, not an index. The only structural difference from desktop
 * is the front door: instead of the tab-switcher in `HomePaths`, mobile opens
 * by asking what brought you here and routing on the answer. Everything after
 * that is the site proper.
 *
 * Sections dropped on mobile, deliberately:
 * - `HomePaths`  -- replaced by `GuidedEntryMobile`; both would be the same
 *                   job done twice, back to back.
 * - `Team`, `ParentsCorner`, `Faq` -- these live on `/dr-nupur`,
 *   `/parents-corner` and `/faq`, every one of them reachable from the nav
 *   panel. On the phone they made the home page a long haul past content the
 *   menu already offers, so home links to them rather than inlining them.
 * - `InsideClinic`, `RiaJourney`, `BrushTimer`, `Testimonials` -- same
 *   reasoning; each has its own route. Testimonials are placeholders awaiting
 *   real quotes in any case (see `content/testimonials.ts`).
 *
 * What is left is the arc a first-time visitor needs in one scroll: who we
 * are, what you came for, how a visit goes, what we do, and how to book.
 *
 * `Hero` and `Journey` are dispatchers: they resolve to their mobile twins
 * here. `Services` and `Booking` are the shared sections.
 */
export function HomeMobile() {
  return (
    <SectionOrder ids={HOME_MOBILE_ORDER}>
      <Hero />
      <GuidedEntryMobile />
      <Journey />
      <Services />
      <Booking />
    </SectionOrder>
  )
}
