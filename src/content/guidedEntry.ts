import type { DoodleName } from '@/components/Doodle'

/**
 * The mobile home opens by asking rather than listing. Four answers, phrased
 * the way a parent would actually say them, each routing to the place on the
 * site that answers it.
 *
 * Rules for anything added here:
 * - `href` must be a real route in `App.tsx` or a section id rendered by
 *   `Home.mobile.tsx`. Nothing on the mobile home may point at a section the
 *   mobile home does not render.
 * - `hint` describes where the tap goes. It must never make a clinical or
 *   availability promise -- we cannot say "we keep slots free for pain"
 *   because no one has told us that. Saying what the page does is safe.
 */
export interface GuidedAnswer {
  id: string
  /** How a parent would say it, first person. */
  answer: string
  /** What happens when they tap. Plain, factual, no promises. */
  hint: string
  href: string
  glyph: DoodleName
}

export const GUIDED_QUESTION = 'What brings you here today?'

export const GUIDED_ANSWERS: readonly GuidedAnswer[] = [
  {
    id: 'first-visit',
    answer: 'It will be their first visit',
    hint: 'Walk through how a visit actually goes',
    href: '#journey',
    glyph: 'journeyDetection',
  },
  {
    id: 'hurting',
    answer: 'Something is hurting',
    hint: 'Start an appointment request',
    href: '/book',
    glyph: 'journeyTreatment',
  },
  {
    id: 'brushing',
    answer: 'Brushing is a battle at home',
    hint: 'Open the two-minute brushing game',
    href: '/games',
    glyph: 'doodleToothbrush',
  },
  {
    id: 'looking',
    answer: 'I am just looking around',
    hint: 'See the clinic and meet Dr. Nupur',
    href: '/inside-clinic',
    glyph: 'doodleFace',
  },
] as const
