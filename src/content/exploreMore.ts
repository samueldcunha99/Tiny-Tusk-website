import type { DoodleName } from '@/components/Doodle'

/**
 * The mobile home's index of the pages it does NOT inline.
 *
 * Between this and `GUIDED_ANSWERS`, every route the nav offers is reachable
 * from the home page without opening the menu: the guided entry covers
 * `/journey`, `/book`, `/games` and `/inside-clinic`; these four cover the
 * rest. Keep the two lists complementary -- a link in both is a link that
 * earns its place in neither.
 *
 * Same rule as `guidedEntry.ts`: `hint` says what the page is, never what the
 * clinic promises. No availability, no clinical claims.
 */
export interface ExploreLink {
  id: string
  label: string
  hint: string
  href: string
  glyph: DoodleName
  /** `true` for the one card that carries the canary fill. */
  feature?: boolean
}

export const EXPLORE_HEADING = 'More to explore'

export const EXPLORE_LINKS: readonly ExploreLink[] = [
  {
    id: 'services',
    label: 'Services',
    hint: 'The care we offer, in plain words',
    href: '/services',
    glyph: 'journeyCare',
    feature: true,
  },
  {
    id: 'dr-nupur',
    label: 'Dr. Nupur',
    hint: 'Meet the dentist behind Tiny Tusk',
    href: '/dr-nupur',
    glyph: 'doodleFace',
  },
  {
    id: 'parents-corner',
    label: "Parents' Corner",
    hint: 'Everyday questions, answered kindly',
    href: '/parents-corner',
    glyph: 'doodleHeart',
  },
  {
    id: 'faq',
    label: 'Questions',
    hint: 'Short answers to common worries',
    href: '/faq',
    // `journeyDetection` is already the guided entry's "first visit" glyph a
    // screen above; reusing it here made the two blocks look interchangeable.
    glyph: 'doodleToothpaste',
  },
] as const
