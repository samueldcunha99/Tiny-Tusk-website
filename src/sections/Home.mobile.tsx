import { SectionOrder } from '@/content/sectionOrder'
import type { SectionId } from '@/content/site'
import { Hero } from './Hero'
import { GuidedEntryMobile } from './GuidedEntry.mobile'
import { ServicesMobile } from './Services.mobile'
import { ExploreMoreMobile } from './ExploreMore.mobile'

/**
 * What this page renders, in order. Only the numbered content sections are
 * listed: `ExploreMoreMobile` is wayfinding plus a CTA, not a numbered beat,
 * so the visible count stays a continuous 00, 01, 02 (see `sectionOrder.tsx`
 * and CLAUDE.md §4).
 */
const HOME_MOBILE_ORDER: readonly SectionId[] = ['hero', 'paths', 'services']

/**
 * The mobile home page.
 *
 * IT IS A FRONT DOOR, NOT THE WHOLE SITE.
 *
 * The previous version inlined Journey, Services and the full Booking form and
 * measured 7.5 viewports on a 390x844 phone -- Journey alone was 2.6 of them.
 * That is a long haul past content the menu already offers, and almost nobody
 * reaches the booking form at the bottom of it.
 *
 * So the phone gets the arc a first-time visitor actually needs, in about
 * four screens:
 *
 *   00 Welcome     -- who we are, one action, one picture
 *   01 Start Here  -- "what brings you here today?", routing on the answer
 *   02 Services    -- what we actually do, as rows (`Services.mobile.tsx`)
 *   Explore        -- every remaining page, tiled, plus the booking CTA
 *
 * Services was one of the seven dropped sections and came back on request: the
 * page was three screens of links with almost no content in it. It is back as a
 * row list, not the desktop card grid -- see `Services.mobile.tsx` for why. The
 * others stay dropped; a phone home page is not the whole site.
 *
 * Everything dropped has its own route and is reachable twice over: from the
 * nav dropdown, and from one of the two index blocks on this page. Nothing on
 * this page links to a section this page does not render -- that rule is why
 * `guidedEntry.ts` now points at `/journey` rather than `#journey`.
 *
 * Sections and their routes:
 *   Journey        -> /journey          (guided entry, "first visit")
 *   Booking        -> /book             (guided entry + the CTA band)
 *   Games          -> /games            (guided entry, "brushing")
 *   InsideClinic   -> /inside-clinic    (guided entry, "just looking")
 *   Services       -> /services         (explore)
 *   Team           -> /dr-nupur         (explore)
 *   ParentsCorner  -> /parents-corner   (explore)
 *   Faq            -> /faq              (explore)
 *   RiaJourney, BrushTimer, Testimonials -- desktop / their own routes only.
 *
 * `Hero` is a dispatcher and resolves to its mobile twin here.
 */
export function HomeMobile() {
  return (
    <SectionOrder ids={HOME_MOBILE_ORDER}>
      <Hero />
      <GuidedEntryMobile />
      <ServicesMobile />
      <ExploreMoreMobile />
    </SectionOrder>
  )
}
