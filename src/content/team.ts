import type { DoodleName } from '@/components/Doodle'
import type { BrandColour } from '@/design/pairings'

export interface PractitionerBeat {
  title: string
  body: string
  glyph: DoodleName
  surface: BrandColour
  element: BrandColour
}

export const DR_NUPUR = {
  name: 'Dr. Nupur',
  /**
   * CLIENT-CONFIRMED — DO NOT REMOVE OR WEAKEN.
   *
   * BDS and MDS in Pediatric Dentistry are supplied and verified by the
   * client. These are genuine credentials, not placeholder content. A previous
   * audit wrongly flagged them as invented; that was incorrect. If you are
   * sweeping this file for unverified claims, this line is not one of them.
   */
  credentials: 'BDS · MDS, Pediatric Dentistry',
  portrait: {
    alt: 'Portrait of Dr. Nupur, photography to be supplied.',
    /**
     * Internal production note. NEVER render this in the UI — it is guidance
     * for whoever commissions the shoot, not copy for visitors.
     */
    productionNote:
      'Add an approved 4:5 portrait of Dr. Nupur. Calm, direct gaze in a bright clinic setting; leave room near the head for the doodle and coral dash overlays.',
  },
  philosophy: {
    quote: 'A first visit should leave a child feeling understood.',
  },
  /**
   * CLIENT-SUPPLIED, IN DR. NUPUR'S OWN WORDS — supplied 2026-08-14. Verbatim
   * from the client's notes, first person, down to "realization". Do not
   * rewrite it into the site's third-person voice: the value here is that it
   * is hers. It replaced a paragraph we had written for her.
   */
  bio: [
    'Loving kids came naturally to me, and it’s what drew me to pediatric dentistry right from the start of my MDS journey. Years of consultations taught me something important: children need more than just a treatment and a checklist. They need a space that welcomes them before anything else happens. That realization is what led me to create Tiny Tusk.',
    'Beyond the clinic, I’m a fitness enthusiast and an avid traveller who loves exploring new places and cultures. I’m also someone who believes in constantly growing, staying updated, and evolving in my field.',
  ] as readonly string[],
  /**
   * CLIENT-SUPPLIED — the clinic's five stated key specialities, verbatim.
   * These are clinical claims, so they render in the official register and
   * nothing may be added to this list that the clinic has not written itself.
   */
  specialities: [
    'Airway-focused pediatric dentistry',
    'Myofunctional therapy',
    'Aligners for children and teens',
    'Treatment for children with special healthcare needs',
    'Treatment under nitrous oxide sedation and general anaesthesia',
  ] as readonly string[],
  expectations: [
    { title: 'We begin with a chat', body: 'You can tell us what has been tricky at home. Your child can listen, join in, or simply take it all in.', glyph: 'doodleHeart', surface: 'powder', element: 'cobalt' },
    { title: 'Nothing is a surprise', body: 'Tools are named before they are used, and each step is explained in words a child can follow.', glyph: 'doodleToothbrush', surface: 'canary', element: 'cobalt' },
    { title: 'You stay close', body: 'Your child can sit with you, hold your hand, or take a break. A visit does not need to be rushed to count.', glyph: 'doodleFace', surface: 'cobalt', element: 'canary' },
  ] satisfies readonly PractitionerBeat[],
  /**
   * TODO (clinic): replace with Dr. Nupur's own words about her favourite part
   * of working with children. Until `favouritePart` is a real quote, leave
   * `hasFavouritePart` false and the panel will not render — a raw "TODO:"
   * string was previously being shown to visitors here.
   */
  hasFavouritePart: false,
  favouritePart: '',
} as const
