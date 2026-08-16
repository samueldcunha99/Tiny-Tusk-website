import { TREATMENTS } from '@/content/treatments'

/**
 * The treatment list, grouped.
 *
 * WHY THIS EXISTS: the client reviewed the old Services section -- six cards of
 * copy we had written, above a flat sixteen-tile index -- and rejected how the
 * services were "enlisted". The reference they gave (tinytooth.in) groups
 * everything into six clinical categories with an icon and a label each, and no
 * descriptive copy at all. This file is that grouping.
 *
 * NOTHING HERE IS INVENTED. Every `slug` is a treatment the clinic named in its
 * own icon set, and the labels below are category names, not claims about what
 * is done. The categories themselves ARE a clinical judgement, though, and they
 * are ours rather than the clinic's -- they need Dr. Nupur's sign-off, and this
 * file is the single place to change them.
 *
 * Descriptions are deliberately absent. Writing a paragraph per category would
 * mean inventing clinical detail (CLAUDE.md §1), and the reference does not have
 * them either.
 */
export interface TreatmentCategory {
  id: string
  /** Mixed-weight label: DemiBold lead + Regular rest (p20). */
  title: { lead: string; rest: string }
  /** A member treatment whose drawing stands for the whole group. */
  icon: string
  /** Members, as slugs in `content/treatments.ts`. */
  slugs: readonly string[]
}

export const TREATMENT_CATEGORIES: readonly TreatmentCategory[] = [
  {
    id: 'first-visit',
    title: { lead: 'Child’s', rest: 'first visit' },
    icon: 'infant-oral-care',
    slugs: ['infant-oral-care'],
  },
  {
    id: 'preventive',
    title: { lead: 'Preventive', rest: '& protective' },
    icon: 'fluoride-sealants',
    slugs: ['cleaning', 'fluoride-sealants', 'sports-dentistry'],
  },
  {
    id: 'curative',
    title: { lead: 'Curative', rest: 'therapies' },
    icon: 'fillings',
    slugs: ['fillings', 'root-canal', 'crowns', 'extraction-space-maintainer', 'emergency-trauma'],
  },
  {
    id: 'orthodontics',
    title: { lead: 'Orthodontics', rest: '& aligners' },
    icon: 'braces',
    slugs: ['braces', 'invisalign', 'smile-makeovers'],
  },
  {
    id: 'myofunctional',
    title: { lead: 'Myofunctional', rest: 'therapy' },
    icon: 'myofunctional-therapy',
    slugs: ['myofunctional-therapy'],
  },
  {
    id: 'sedation',
    title: { lead: 'Special', rest: '& sedation care' },
    icon: 'laughing-gas',
    slugs: ['special-needs', 'laughing-gas', 'general-anaesthesia'],
  },
] as const

/**
 * slug -> the category name it belongs to, derived so the two can never drift.
 * The tiles show all sixteen treatments at once and carry this as a tag, rather
 * than hiding the treatments behind six category gates.
 */
export const CATEGORY_OF: Record<string, string> = Object.fromEntries(
  TREATMENT_CATEGORIES.flatMap((c) =>
    c.slugs.map((slug) => [slug, `${c.title.lead} ${c.title.rest}`]),
  ),
)

/** Treatments that have earned a page of their own. */
export const TREATMENT_HREF: Record<string, string> = {
  'laughing-gas': '/laughing-gas',
}

/**
 * Dev guard, in the house style of `resolveElement` and the 64px logo warning:
 * every treatment must appear in exactly one category. Without this, adding a
 * treatment to `treatments.ts` silently drops it off the site -- the grouped
 * layout has no "everything else" bucket for it to fall into, which the old
 * flat grid did. If this fires, fix the grouping above; never silence it.
 */
if (import.meta.env.DEV) {
  const seen = TREATMENT_CATEGORIES.flatMap((c) => c.slugs)
  const known = new Set(TREATMENTS.map((t) => t.slug))

  const missing = [...known].filter((slug) => !seen.includes(slug))
  const unknown = seen.filter((slug) => !known.has(slug))
  const duplicated = seen.filter((slug, i) => seen.indexOf(slug) !== i)

  if (missing.length) console.error('[treatments] not in any category:', missing)
  if (unknown.length) console.error('[treatments] category lists an unknown slug:', unknown)
  if (duplicated.length) console.error('[treatments] in more than one category:', duplicated)
}
