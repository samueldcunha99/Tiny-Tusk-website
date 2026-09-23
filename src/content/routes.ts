import { PARENT_ARTICLES, type ParentArticle } from './parents'

export interface RouteHead {
  title: string
  description: string
  noIndex?: boolean | undefined
}

/**
 * Every route's title and description, in one place. `Site.tsx` sets them on
 * the live page (through `RouteMeta`), and the build bakes them into each
 * route's own HTML file (`scripts/prerender.mjs`), so a link shared on WhatsApp
 * or read by a crawler carries the right title before any JavaScript runs.
 */
export const ROUTE_HEADS = {
  '/': {
    title: 'Tiny Tusk Pediatric Dental Clinic',
    description:
      'Gentle care for growing smiles. Tiny Tusk is a pediatric dental clinic where little smiles are cared for with kindness, patience and a whole lot of heart.',
  },
  '/dr-nupur': {
    title: 'Meet Dr. Nupur Agarwal | Tiny Tusk',
    description:
      'Meet Dr. Nupur Agarwal, BDS · MDS in Pediatric Dentistry, and learn what families can expect from her calm approach.',
  },
  '/services': {
    title: 'Pediatric Dental Services | Tiny Tusk',
    description:
      'A plain-spoken overview of the pediatric dental services Tiny Tusk is designed to provide for growing smiles.',
  },
  '/laughing-gas': {
    title: 'Laughing Gas (Nitrous Oxide) for Kids | Tiny Tusk',
    description:
      'Learn how gentle Nitrous Oxide (Laughing Gas) helps children feel calm, comfortable, and relaxed during dental visits at Tiny Tusk.',
  },
  '/journey': {
    title: 'How a Visit Goes | Tiny Tusk',
    description:
      'A step-by-step walk through a first pediatric dental visit at Tiny Tusk, so families know what to expect before they arrive.',
  },
  '/inside-clinic': {
    title: 'Inside the Clinic | Tiny Tusk',
    description:
      "Explore branded concept visuals for Tiny Tusk's planned reception, treatment room, and family learning corner.",
  },
  '/games': {
    title: 'Games for Kids | Tiny Tusk',
    description:
      "Play Tiny Tusk's friendly two-minute brushing game and follow along with everyday healthy-routine activities for kids.",
  },
  '/brush-timer': {
    title: 'Games for Kids | Tiny Tusk',
    description:
      "Play Tiny Tusk's friendly two-minute brushing game and follow along with everyday healthy-routine activities for kids.",
    noIndex: true,
  },
  '/parents-corner': {
    title: "Parents' Corner | Tiny Tusk",
    description:
      "Warm, practical guidance for everyday questions about children's teeth, brushing, and dental visits.",
  },
  '/faq': {
    title: 'Frequently Asked Questions | Tiny Tusk',
    description:
      'Kind, plain-spoken answers to common family questions about pediatric dental visits and care.',
  },
  '/book': {
    title: 'Book a Visit | Tiny Tusk',
    description: 'Start a secure appointment request for Tiny Tusk Pediatric Dental Clinic.',
  },
} as const satisfies Record<string, RouteHead>

export type StaticPath = keyof typeof ROUTE_HEADS

export const NOT_FOUND_HEAD: RouteHead = {
  title: 'Page Not Found | Tiny Tusk',
  description: 'The requested Tiny Tusk page could not be found.',
  noIndex: true,
}

/** A Parents' Corner post: the clinic's question is its title. */
export function articleHead(article: ParentArticle): RouteHead {
  return { title: `${article.question} | Tiny Tusk`, description: article.summary }
}

/** Every path the build writes an HTML file for, with its head. */
export function prerenderRoutes(): (RouteHead & { path: string })[] {
  return [
    ...Object.entries(ROUTE_HEADS).map(([path, head]) => ({ path, ...head })),
    ...PARENT_ARTICLES.map((article) => ({
      path: `/parents-corner/${article.id}`,
      ...articleHead(article),
    })),
  ]
}
