/**
 * The clinic's full treatment list.
 *
 * CLIENT-SUPPLIED. Every label here is the caption the client drew into its own
 * icon set (`brand-source/TINY_TUSK_Icons-NN.svg`), so this is the clinic's
 * own wording, not ours. Two deliberate departures from the artwork:
 * "Fluoride" is spelled correctly here, and "Tooth-Coloured" keeps the
 * hyphenation the caption uses.
 *
 * There is intentionally NO description copy. The six cards above this list
 * are the explained ones; writing paragraphs for the other ten would mean
 * inventing clinical detail the clinic has not given us (CLAUDE.md §1). When
 * the clinic supplies real descriptions, add a `body` here and the grid can
 * grow into cards.
 *
 * `slug` matches a file in `src/assets/service-icons/`, written by
 * `tools/clean-service-icons.mjs`. Adding one without the other fails the
 * lookup in `Services.tsx` loudly.
 */
export interface Treatment {
  slug: string
  label: string
}

export const TREATMENTS: readonly Treatment[] = [
  { slug: 'infant-oral-care', label: 'Infant Oral Care' },
  { slug: 'cleaning', label: 'Cleaning' },
  { slug: 'fluoride-sealants', label: 'Fluoride Treatment + Sealants' },
  { slug: 'fillings', label: 'Fillings' },
  { slug: 'root-canal', label: 'Root Canal' },
  { slug: 'crowns', label: 'Stainless Steel & Tooth-Coloured Crowns' },
  { slug: 'extraction-space-maintainer', label: 'Extraction + Space Maintainer' },
  { slug: 'emergency-trauma', label: 'Emergency Trauma Treatment' },
  { slug: 'braces', label: 'Braces' },
  { slug: 'invisalign', label: 'Invisalign' },
  { slug: 'smile-makeovers', label: 'Smile Makeovers for Children' },
  { slug: 'myofunctional-therapy', label: 'Myofunctional Therapy' },
  { slug: 'sports-dentistry', label: 'Sports Dentistry' },
  { slug: 'special-needs', label: 'Treatment for Children with Special Needs' },
  { slug: 'laughing-gas', label: 'Treatment Under Laughing Gas' },
  { slug: 'general-anaesthesia', label: 'Treatment Under General Anaesthesia' },
] as const
