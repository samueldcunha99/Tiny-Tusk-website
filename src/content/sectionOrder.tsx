import { createContext, useContext, type ReactNode } from 'react'
import { sectionMeta, type SectionId, type SectionMeta } from './site'

/**
 * Section numbers belong to the page, not to the section.
 *
 * `SECTIONS` in `site.ts` is the registry: it owns each section's id and label,
 * and its order is the desktop home page's order. But a section is not welded
 * to one page. `Booking` renders on the desktop home, on the mobile home, and
 * standalone at `/book`, and the mobile home deliberately drops seven sections
 * (see `Home.mobile.tsx`). Numbering straight off the registry therefore made
 * the phone count `00 01 02 03 11` -- the same visible break as audit #9, which
 * `site.ts` explicitly warns against: numbers must stay CONTINUOUS across what
 * actually renders.
 *
 * So a composition declares the order it renders, and each section asks where
 * it landed in that order. Adding or dropping a section from a page cannot
 * misnumber the ones after it, because nothing hardcodes a position.
 *
 * With no provider -- a section rendered alone on its own route, such as
 * `<Services asPage />` -- the registry number stands. There it is not counting
 * a page, it is citing the brand book's contents page (p2), which is what the
 * number means in the first place.
 */
const SectionOrderContext = createContext<readonly SectionId[] | null>(null)

export function SectionOrder({
  ids,
  children,
}: {
  ids: readonly SectionId[]
  children: ReactNode
}) {
  return <SectionOrderContext.Provider value={ids}>{children}</SectionOrderContext.Provider>
}

/**
 * A section's number and label for the page it is currently on. Always look
 * sections up by id -- index-based access into `SECTIONS` breaks the moment one
 * is inserted.
 */
export function useSectionMeta(id: SectionId): SectionMeta {
  const order = useContext(SectionOrderContext)
  const meta = sectionMeta(id)
  if (!order) return meta

  const position = order.indexOf(id)
  if (position < 0) {
    // A section rendering inside a composition that never declared it: the
    // running order is wrong, not the section. Same class of bug as audit #9,
    // so it fails loudly in dev rather than quietly printing a stale number.
    if (import.meta.env.DEV) {
      console.warn(
        `[Tiny Tusk] Section "${id}" rendered inside a <SectionOrder> that does not list it. ` +
          `Add it to that page's order, or drop the section. Falling back to its registry number.`,
      )
    }
    return meta
  }

  return { ...meta, number: String(position).padStart(2, '0') }
}
