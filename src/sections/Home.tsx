import { SmileEdge } from '@/components/SmileEdge'
import { SectionOrder } from '@/content/sectionOrder'
import type { SectionId } from '@/content/site'
import { BookingClose } from './BookingClose'
import { Hero } from './Hero'
import { Team } from './Team'
import { Journey } from './Journey'
import { InsideClinic } from './InsideClinic'
import { Services } from './Services'
import { Testimonials } from './Testimonials'
import { ParentsCorner } from './ParentsCorner'
import { Faq } from './Faq'
import { BrushTimer } from './BrushTimer'

const HOME_ORDER: readonly SectionId[] = [
  'hero',
  'team',
  'journey',
  'clinic',
  'services',
  'voices',
  'parents',
  'faq',
  'brush-timer',
  'book',
]

/**
 * The home page: powder is the ground, and the other three colours are chapter
 * plates set into it -- the way the guide slots its full-colour chapter pages
 * (cobalt "The Logo", canary "More Assets", coral "Colours") between its
 * reading pages.
 *
 *   powder  -- welcome
 *   canary  -- Dr. Nupur (her portrait badge)
 *   cobalt  -- how a visit goes (the logo's own story)
 *   powder  -- inside the clinic
 *   canary  -- what we look after (the drawings on colour discs)
 *   cobalt  -- parent voices
 *   powder  -- Parents' Corner (speech bubbles), questions
 *   coral   -- the brushing game
 *   cobalt  -- book a visit, then the footer
 *
 * No paper: the user asked for more colour. No two chapters of one colour
 * touch -- welcome and Dr. Nupur on one powder field read as "one long page
 * box", and three canary chapters in a row read as "too much yellow" -- so the
 * two canary plates have two chapters between them. Each change of colour is the
 * tagline unit's smile rather than a hard edge, and no artwork crosses a
 * section's top or bottom edge -- a loop cut by a straight line is a glitch.
 */
export function Home() {
  return (
    <SectionOrder ids={HOME_ORDER}>
      <Hero />
      <SmileEdge from="powder" />
      <Team />
      <SmileEdge from="canary" />
      <Journey />
      <SmileEdge from="cobalt" />
      <InsideClinic />
      <SmileEdge from="powder" />
      <Services />
      <SmileEdge from="canary" />
      <Testimonials />
      <SmileEdge from="cobalt" />
      <ParentsCorner />
      <Faq />
      <SmileEdge from="powder" />
      <BrushTimer />
      <SmileEdge from="coral" />
      <BookingClose />
    </SectionOrder>
  )
}
