/**
 * ============================================================================
 * TODO — BLOCKING BEFORE LAUNCH: REAL TESTIMONIALS REQUIRED
 * ============================================================================
 *
 * The entries below are STRUCTURAL PLACEHOLDERS, not reviews. They exist only
 * so the marquee has something to lay out. They are deliberately written so
 * they cannot be mistaken for real parent feedback.
 *
 * An earlier draft of this file contained four invented parents and children
 * ("Amelia, parent of Ivy", and similar). Those were fabricated and have been
 * removed. Publishing invented reviews for a real clinic misrepresents the
 * practice and, in most jurisdictions, breaches consumer-protection rules on
 * fake reviews.
 *
 * To go live, the clinic must supply:
 *   1. Real quotes from real patients' parents.
 *   2. Written consent to publish each quote.
 *   3. The attribution each family agrees to (many prefer a first name and
 *      initial, or "parent of a 6-year-old" with no names at all).
 *   4. Confirmation that no child's full name is published.
 *
 * Until then, `AWAITING_REAL_TESTIMONIALS` stays true and the section renders
 * a visible "awaiting content" state rather than pretending to have reviews.
 * Do not flip this flag to false until items 1-4 above are in hand.
 */

export const AWAITING_REAL_TESTIMONIALS = true

export interface Testimonial {
  quote: string
  parent: string
  child: string
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote: 'Parent quote to be supplied by the clinic, with written consent.',
    parent: 'Attribution pending',
    child: 'Visit type pending',
  },
  {
    quote: 'Parent quote to be supplied by the clinic, with written consent.',
    parent: 'Attribution pending',
    child: 'Visit type pending',
  },
  {
    quote: 'Parent quote to be supplied by the clinic, with written consent.',
    parent: 'Attribution pending',
    child: 'Visit type pending',
  },
] as const

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
import type { DoodleName } from '@/components/Doodle'
