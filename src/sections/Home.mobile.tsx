import { SectionOrder } from '@/content/sectionOrder'
import type { SectionId } from '@/content/site'
import { Hero } from './Hero'
import { JourneyMobile } from './Journey.mobile'
import { ServicesMobile } from './Services.mobile'
import { TeamMobile } from './Team.mobile'
import { InsideClinicMobile } from './InsideClinic.mobile'
import { Testimonials } from './Testimonials'
import { BookBandMobile } from './BookBand.mobile'

/**
 * What this page renders, in order. `<SectionOrder>` still counts it so any
 * section that does show a numeral counts off what actually renders rather
 * than off the registry (see `sectionOrder.tsx`).
 */
const HOME_MOBILE_ORDER: readonly SectionId[] = [
  'hero',
  'journey',
  'services',
  'team',
  'clinic',
  'voices',
  'book',
]

/**
 * The mobile home page, sequenced for clear narrative progression:
 * 1. Hero / Welcome (Powder)
 * 2. First Visit Journey (Cobalt)
 * 3. Services & Treatments (Paper)
 * 4. Meet Dr. Nupur (Canary)
 * 5. Inside the Clinic & Amenities (Paper)
 * 6. Parent Voices / Reviews (Powder)
 * 7. Book a Visit & Contact Band (Coral)
 */
export function HomeMobile() {
  return (
    <SectionOrder ids={HOME_MOBILE_ORDER}>
      <Hero />
      <JourneyMobile />
      <ServicesMobile />
      <TeamMobile />
      <InsideClinicMobile />
      <Testimonials />
      <BookBandMobile />
    </SectionOrder>
  )
}
