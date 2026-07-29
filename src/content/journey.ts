import type { DoodleName } from '@/components/Doodle'
import type { BrandColour } from '@/design/pairings'

/**
 * The guide's own four beats (p3): Detection, Treatment, Care, Smile!
 *
 * On that page the four sit either side of the completed cobalt mark, and the
 * glyphs visibly build the logo one stroke at a time -- a plain tooth, then a
 * curl, then the trunk and tusk, then the finished smile with its sparkle.
 * We keep that structure: the mark is the hinge in the middle, unlabelled,
 * because it is the payoff rather than a step.
 */
export interface JourneyBeat {
  kind: 'beat'
  id: string
  number: string
  title: string
  body: string
  glyph: DoodleName
  surface: BrandColour
  element: BrandColour
}

export interface JourneyHinge {
  kind: 'hinge'
  id: string
  glyph: DoodleName
  surface: BrandColour
  element: BrandColour
  caption: string
}

export type JourneyPanel = JourneyBeat | JourneyHinge

export const JOURNEY: readonly JourneyPanel[] = [
  {
    kind: 'beat',
    id: 'detection',
    number: '01',
    title: 'Detection',
    body:
      'We start by looking, gently. A count of the teeth, a look at how they meet, and a ' +
      'chat about what you have noticed at home. Nothing sharp, nothing sudden — your child ' +
      'sits with you and we explain each thing before it happens.',
    glyph: 'journeyDetection',
    surface: 'powder',
    element: 'cobalt',
  },
  {
    kind: 'beat',
    id: 'treatment',
    number: '02',
    title: 'Treatment',
    body:
      'If something needs doing, we tell your child exactly what it will feel like, in words ' +
      'they can hold on to. They get to say when we start. Most visits need nothing more than ' +
      'a clean — and when they do, it is over quickly.',
    glyph: 'journeyTreatment',
    surface: 'canary',
    element: 'cobalt',
  },
  {
    kind: 'hinge',
    id: 'mark',
    glyph: 'journeyLogo',
    surface: 'cobalt',
    element: 'canary',
    caption: 'One continuous stroke, from first tooth to full smile.',
  },
  {
    kind: 'beat',
    id: 'care',
    number: '03',
    title: 'Care',
    body:
      'Then the part that happens at home. We send you off with a plan that fits your actual ' +
      'evenings — the brush that suits their grip, the paste that suits their age, and one ' +
      'thing to focus on rather than ten.',
    glyph: 'journeyCare',
    surface: 'coral',
    element: 'canary',
  },
  {
    kind: 'beat',
    id: 'smile',
    number: '04',
    title: 'Smile!',
    body:
      'And they leave pleased with themselves. That is the bit that matters most — a child ' +
      'who is not frightened of the dentist grows into an adult who is not either. That is ' +
      'the whole job, really.',
    glyph: 'journeySmile',
    surface: 'powder',
    element: 'cobalt',
  },
] as const
