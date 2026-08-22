/**
 * Site content. Typed so it reads like a CMS -- copy lives here, never inline
 * in components. Voice: warm, plain-spoken, parent-to-parent. Never babyish,
 * never clinical.
 */

export const CLINIC = {
  name: 'Tiny Tusk',
  fullName: 'Tiny Tusk Pediatric Dental Clinic',
  tagline: 'Gentle Care for Growing Smiles',
  tag: 'Pediatric Dental Clinic',
} as const

/**
 * Pre-opening gate. While true, EVERY route renders `<OpeningSoon />` and the
 * rest of the site -- nav, footer, preloader, all twelve sections -- does not
 * mount at all. Set to false on launch day and the full site returns exactly
 * as it was; nothing else needs editing.
 */
export const OPENING_SOON = false

/**
 * TODO: set to the clinic's confirmed opening date or month once it exists,
 * e.g. 'March 2026'. While null the screen says "opening soon" and no date is
 * shown. Never guess this -- a wrong date is a promise the clinic has to keep.
 */
export const OPENING_DATE: string | null = null

/**
 * Opening screen copy supplied by the clinic team.
 */
export const OPENING_COPY = {
  headlineLead: 'Our doors are opening',
  headlineLasso: 'soon',
  paragraphs: [
    "We're putting the finishing touches on a dental space made just for kids, with comfy chairs, calm corners, and a first visit that feels more like an adventure than an appointment. No rush, no fuss, just tiny tooth care done right.",
    'The clinic is being finished right now, and the full website is on its way with it. Come and find us here when we open. We cannot wait to meet your family.',
  ],
} as const

/**
 * The clinic's real address. CLIENT-VERIFIED — supplied by the client on
 * 2026-08-01, so unlike `MOCK_CONTACT` below this renders in production and
 * goes into structured data. Do not strip it during a sweep for unverified
 * facts, and do not add a `lat`/`lng`: exact coordinates were not supplied,
 * and the map resolves the address by text rather than guessing a pin.
 */
export const CLINIC_ADDRESS = {
  unit: 'Shop No. 21, Ground Floor, Plot No. 3',
  society: 'Mahaavir Heritage Co-Operative Housing Society Ltd',
  sector: 'Sector 35G',
  landmark: 'Next to Empyrean School, near Tata Memorial Cancer Hospital',
  locality: 'Kharghar',
  city: 'Navi Mumbai',
  region: 'Maharashtra',
  postcode: '410210',
  country: 'IN',
} as const

/** One-line form, for map queries and structured data. */
export const CLINIC_ADDRESS_LINE = [
  CLINIC_ADDRESS.unit,
  CLINIC_ADDRESS.society,
  CLINIC_ADDRESS.sector,
  CLINIC_ADDRESS.locality,
  `${CLINIC_ADDRESS.city} ${CLINIC_ADDRESS.postcode}`,
  CLINIC_ADDRESS.region,
].join(', ')

/**
 * Deliberately shorter than `CLINIC_ADDRESS_LINE`. Geocoding the full line --
 * shop number, plot and landmarks included -- makes Google fall back to a
 * scattered area search with no pin. Society + sector + locality + postcode
 * resolves to the single correct place; verified in a browser against both
 * landmarks the client gave (Empyrean School adjacent, ACTREC-Tata to the
 * south-west). Re-check the pin if you edit this string.
 */
const MAP_QUERY = encodeURIComponent(
  `${CLINIC_ADDRESS.society}, ${CLINIC_ADDRESS.sector}, ${CLINIC_ADDRESS.locality}, ${CLINIC_ADDRESS.city} ${CLINIC_ADDRESS.postcode}`,
)
/** Keyless Google embed — no API key, no billing account, no new dependency. */
export const MAP_EMBED_SRC = `https://maps.google.com/maps?q=${MAP_QUERY}&output=embed`
/** Opens the same place in the visitor's own Maps app for directions. */
export const MAP_DIRECTIONS_HREF = `https://www.google.com/maps/search/?api=1&query=${MAP_QUERY}`

/**
 * The clinic's real phone number. CLIENT-VERIFIED — supplied by the client on
 * 2026-08-14. Like the address, this renders in production and goes into
 * structured data; it is deliberately not in `MOCK_CONTACT` below. Indian
 * mobile, so `+91`. `WHATSAPP_NUMBER` is the same line.
 */
export const CLINIC_PHONE = {
  display: '+91 96190 00971',
  href: 'tel:+919619000971',
} as const

// TODO: Add email, opening hours, and official social URLs only after the
// clinic supplies and verifies them. Do not render guessed fallbacks.
// (The address and phone above ARE verified and are deliberately not in here.)
export const MOCK_CONTACT = {
  email: 'hello@tinytusk.example',
  hours: [
    { days: 'Monday to Friday', time: '8:30am to 5:30pm' },
    { days: 'Saturday', time: '9:00am to 1:00pm' },
    { days: 'Sunday', time: 'Closed' },
  ],
} as const

/**
 * WhatsApp contact.
 *
 * `WHATSAPP_NUMBER` is the single switch for the whole feature. CLIENT-VERIFIED
 * — the same line as `CLINIC_PHONE`, in `wa.me` format: country code first,
 * digits only, no `+` and no spaces. The dev sample below is now unreachable
 * and stays only as the pattern for the next unverified number.
 */
export const WHATSAPP_NUMBER: string | null = '919619000971'

/**
 * Layout stand-in so the button can be built and reviewed before the real
 * number exists. Reachable from `whatsappHref` in `npm run dev` only -- the
 * production bundle can never resolve to it.
 */
const WHATSAPP_DEV_SAMPLE = '442079460321'

/** Message pre-filled into the chat. The site's voice, and short. */
export const WHATSAPP_GREETING =
  "Hello Tiny Tusk! I'd like to ask about an appointment for my child."

/**
 * The `wa.me` link, or `null` when there is nothing safe to link to. Callers
 * render nothing on `null` rather than falling back to a guessed number.
 */
export function whatsappHref(): string | null {
  const number = WHATSAPP_NUMBER ?? (import.meta.env.DEV ? WHATSAPP_DEV_SAMPLE : null)
  if (!number) return null
  return `https://wa.me/${number}?text=${encodeURIComponent(WHATSAPP_GREETING)}`
}

/**
 * False while the link resolves to the development sample. The button uses
 * this to mark itself as unverified in dev, the way the footer labels its own
 * mock contact block.
 */
export function whatsappIsVerified(): boolean {
  return WHATSAPP_NUMBER !== null
}

/** The guide's own welcome copy, p34. Used verbatim. */
export const HERO = {
  headline: ['Welcome to', 'Tiny Tusk'],
  headlineTail: 'Pediatric Dental Clinic',
  body:
    'Where little smiles are cared for with kindness, patience, and a whole lot of heart. ' +
    'We believe every child deserves a dental experience that feels safe, gentle, and even ' +
    "a little magical. From a baby's very first tooth to growing confident smiles, we are " +
    'here to walk beside your child through every tiny milestone.',
  // The opening sentence of `body`, verbatim -- never a reworded summary, so
  // the guide's p34 copy is never paraphrased. The mobile hero carried this
  // alone until the phone page read as too thin; it now carries `body` like
  // the desktop one. Kept for any surface that needs a single-line welcome.
  bodyLede:
    'Where little smiles are cared for with kindness, patience, and a whole lot of heart.',
  cta: { lead: 'Schedule', rest: 'Appointment', href: '#book' },
} as const

/**
 * Section numbering, borrowed from the guide's own contents page (p2).
 * It is the book's wayfinding; carrying it onto the site keeps the two in step.
 */
/**
 * Numbers must stay CONTINUOUS across what actually renders. A slot was
 * previously reserved here for a 2-Minute Brush section that does not exist,
 * so the page visibly counted 00,01,02,03,04,06,07,08,09.
 *
 * If you add a section, insert it here and renumber — do not leave a gap for
 * planned work. Look sections up by `id` (see `sectionMeta`), never by array
 * index, so inserting one cannot silently mislabel every section after it.
 *
 * The `number` below is the registry number — the brand book's own contents
 * page (p2), and what a section shows when it renders alone on its own route.
 * A page that renders some other running order (the mobile home drops seven
 * sections) counts its own numbers off `<SectionOrder>`; components should read
 * `useSectionMeta` in `sectionOrder.tsx` rather than calling `sectionMeta`
 * directly, so the number always matches what the visitor can actually count.
 */
export const SECTIONS = [
  { id: 'hero', number: '00', label: 'Welcome' },
  { id: 'journey', number: '01', label: 'The Journey' },
  { id: 'team', number: '02', label: 'Dr. Nupur' },
  { id: 'services', number: '03', label: 'Services' },
  { id: 'clinic', number: '04', label: 'Inside the Clinic' },
  { id: 'brush-timer', number: '05', label: '2-Min Brush' },
  { id: 'parents', number: '06', label: "Parents' Corner" },
  { id: 'voices', number: '07', label: 'Parent Voices' },
  { id: 'faq', number: '08', label: 'Questions' },
  { id: 'book', number: '09', label: 'Book a Visit' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

/**
 * A section's wayfinding as rendered. `number` widens to `string` because a
 * page recounts it against its own running order (`sectionOrder.tsx`); the
 * literal union on `SECTIONS` is the registry, not the rendered value.
 */
export type SectionMeta = {
  readonly id: SectionId
  readonly number: string
  readonly label: string
}

/**
 * Look a section's number and label up by id. Index-based access breaks the
 * moment a section is inserted; this does not.
 */
export function sectionMeta(id: SectionId): (typeof SECTIONS)[number] {
  const found = SECTIONS.find((s) => s.id === id)
  if (!found) throw new Error(`Unknown section id: ${id}`)
  return found
}
