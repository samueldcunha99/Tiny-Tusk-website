import type { DoodleName } from '@/components/Doodle'

/**
 * ============================================================================
 * REAL REVIEWS ONLY. PROVENANCE REQUIRED FOR EVERY ENTRY.
 * ============================================================================
 *
 * An earlier draft of this file contained four invented parents and children
 * ("Amelia, parent of Ivy", and similar). Those were fabricated and have been
 * removed. Publishing invented reviews for a real clinic misrepresents the
 * practice and, in most jurisdictions, breaches consumer-protection rules on
 * fake reviews. Never add an entry here that a real person did not write.
 *
 * Each entry below cites where it came from in a comment. Public Google
 * reviews are quoted as published: the reviewer chose to publish those words
 * under that name, so quoting them is not the same act as publishing private
 * feedback. Anything supplied privately -- a card, a WhatsApp message, a form
 * -- needs written consent before it goes in.
 *
 * House rules for every entry:
 *   1. Quote verbatim. The only edits permitted are capitalising a proper noun
 *      and closing a sentence. Never smooth a parent's grammar -- the imperfect
 *      phrasing is what makes it read as a real person.
 *   2. `parent` is first name + last initial. Never a full surname.
 *   3. Never publish a child's name, and never a child's photograph without
 *      the parent's separate, explicit, written consent -- a parent posting a
 *      photo to Google is NOT consent for the clinic to reuse it in marketing.
 *   4. `child` describes the visit, not the child. No ages unless stated.
 *
 * The section renders its "we are collecting these properly" state whenever
 * this array is empty, so the honest fallback cannot drift out of sync with
 * the data. That is what `AWAITING_REAL_TESTIMONIALS` now derives from.
 */

export interface Testimonial {
  quote: string
  parent: string
  /** The visit, not the child. */
  child: string
}

export const TESTIMONIALS: readonly Testimonial[] = [
  // Google review, 5 stars, posted by "Jeetu Maru". Verbatim except the
  // capital N in "Dr Nupur" and the closing full stop. The reviewer's photo of
  // the child is deliberately NOT used -- see house rule 3.
  {
    quote:
      'My child is hyperactive but Dr Nupur handled him very nicely and my son very comfortable while the treatment was going on. Very happy with the service.',
    parent: 'Jeetu M.',
    child: 'Treatment visit',
  },
]

/** True while there is nothing real to show. Derived -- never hand-set. */
export const AWAITING_REAL_TESTIMONIALS = TESTIMONIALS.length === 0

export const TESTIMONIAL_PROMPTS = [
  {
    title: 'A moment that felt easier',
    body: 'The small detail that helped a child settle in.',
    glyph: 'doodleHeart',
  },
  {
    title: 'Something your child enjoyed',
    body: 'A favourite choice, conversation, or part of the room.',
    glyph: 'doodleFace',
  },
  {
    title: 'What you wish you knew',
    body: 'The reassurance that might help another family before a visit.',
    glyph: 'markDashes',
  },
] as const satisfies readonly {
  title: string
  body: string
  glyph: DoodleName
}[]
