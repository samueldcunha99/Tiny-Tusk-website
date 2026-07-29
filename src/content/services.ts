import type { DoodleName } from '@/components/Doodle'
import type { BrandColour } from '@/design/pairings'

export interface Service {
  id: string
  title: { lead: string; rest: string }
  body: string
  glyph: DoodleName
  surface: BrandColour
  element: BrandColour
  /**
   * Editorial grid weight on a 6-column desktop grid. The rows are meant to
   * resolve exactly: 4+2 / 2+2+2 / 2(tall continues)+4.
   */
  span: 'hero' | 'wide' | 'tall' | 'regular'
}

export const SERVICES: readonly Service[] = [
  {
    id: 'first-visit',
    title: { lead: 'First', rest: 'visit' },
    body:
      'Best booked around the first birthday, or whenever the first tooth appears. It is mostly ' +
      'a conversation — we count, we look, and your child gets used to the chair with nothing ' +
      'happening in it.',
    glyph: 'journeyDetection',
    surface: 'powder',
    element: 'cobalt',
    span: 'hero',
  },
  {
    id: 'cleanings',
    title: { lead: 'Cleanings', rest: '& polishing' },
    body:
      'A gentle scale and polish, with the flavour of paste chosen by the person whose teeth ' +
      'they are. Ten minutes, no scraping noises they have not been warned about.',
    glyph: 'doodleToothbrush',
    surface: 'canary',
    element: 'cobalt',
    span: 'regular',
  },
  {
    id: 'fluoride',
    title: { lead: 'Fluoride', rest: '& sealants' },
    body:
      'A varnish on the biting surfaces where the grooves are deepest. It takes a minute, ' +
      'tastes of not very much, and meaningfully cuts the odds of a filling later.',
    glyph: 'doodleToothpaste',
    surface: 'paper',
    element: 'cobalt',
    span: 'regular',
  },
  {
    id: 'cavity-care',
    title: { lead: 'Cavity', rest: 'care' },
    body:
      'If there is decay we treat it in the smallest way that works — often no drill at all in ' +
      'the early stages. We show you the photograph so you can see what we saw.',
    glyph: 'journeyTreatment',
    surface: 'coral',
    element: 'canary',
    span: 'tall',
  },
  {
    id: 'alignment',
    title: { lead: 'Retainers', rest: '& alignment' },
    body:
      'We watch how the adult teeth arrive and flag anything worth acting on early, when it is ' +
      'simpler. Not every child needs a brace, and we will say so plainly if yours does not.',
    glyph: 'markZigzag',
    surface: 'powder',
    element: 'cobalt',
    span: 'regular',
  },
  {
    id: 'emergency',
    title: { lead: 'Emergency', rest: 'care' },
    body:
      'Knocked-out tooth, a break, a night of real pain — ring us and we will find you a slot ' +
      'the same day. Keep a knocked-out adult tooth in milk and bring it with you.',
    glyph: 'doodleHeart',
    surface: 'cobalt',
    element: 'canary',
    span: 'wide',
  },
] as const
