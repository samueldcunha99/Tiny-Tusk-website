# Tiny Tusk — full-site redesign patch

Ten section files plus one CSS append, all against the existing repo. No new
dependencies, no new brand tokens, no new artwork, and no edits to `src/content/*`
— every string on the redesigned page already lives in those files.

Reference implementation of the whole page, with the interactions live:
`Tiny Tusk.dc.html` (delivered alongside this patch).

## 1. Replace

    src/sections/Hero.desktop.tsx   ←  patch/src/sections/Hero.desktop.tsx
    src/sections/HomePaths.tsx      ←  patch/src/sections/HomePaths.tsx
    src/sections/Services.tsx       ←  patch/src/sections/Services.tsx
    src/sections/InsideClinic.tsx   ←  patch/src/sections/InsideClinic.tsx
    src/sections/RiaJourney.tsx     ←  patch/src/sections/RiaJourney.tsx
    src/sections/Team.tsx           ←  patch/src/sections/Team.tsx
    src/sections/ParentsCorner.tsx  ←  patch/src/sections/ParentsCorner.tsx
    src/sections/Testimonials.tsx   ←  patch/src/sections/Testimonials.tsx
    src/sections/Faq.tsx            ←  patch/src/sections/Faq.tsx
    src/sections/Footer.tsx         ←  patch/src/sections/Footer.tsx

## 2. Append

    src/index.css  ←  patch/src/index.css.append.css
    (one `@layer components` block: the <details> marker reset and the
    coral plus → cross rotation)

## 3. Deliberately untouched

- **`Nav.tsx`** — kept exactly as-is on request.
- **`Journey.desktop.tsx`** — kept as-is on request. The pinned horizontal
  scrub with the connector drawing in step is the site's signature moment.
- **`Booking.tsx`** and **`BrushTimer.tsx`** — the redesign here is surface and
  layout only (see §5); their logic is Turnstile, `bookingApi`, consent and
  timer state, and rewriting that from the outside is a needless risk. Say the
  word and these two follow in the same shape as the files above.
- **`src/content/*`**, `tailwind.config.ts`, `design/pairings.ts` — unchanged.

## 4. The system the ten files share

**Surfaces, in running order.** Only pairings from `design/pairings.ts`, never
more than two backgrounds adjacent:

    powder → paper → cobalt → paper → paper → canary → paper
    → cobalt → paper → powder → paper → cobalt → cobalt

Two surface moves: **Inside the Clinic** powder → paper (it sat between two
paper sections and the powder-backed tiles had no edge of their own), and
**Ria's Journey** coral → canary (coral carries no copy in the palette, so the
whole section had been living inside cobalt `TextPanel`s — a panel-in-panel
stack; canary carries cobalt at 6.37:1 and coral returns to being an accent).

**Coral is never a text surface.** Where a coral field carries copy — Services
"Cavity care", the coral Parents' Corner card, the family-corner tile title —
the copy stays on a cobalt `TextPanel`. `carriesText()` decides, not the call site.

**Wayfinding.** Every section opens with `<SectionNumber tone="coral" />`
(canary on cobalt) reading `useSectionMeta`, so numbers stay continuous across
whatever a page actually renders.

**Shape and elevation.** `rounded-[2rem]` containers, `rounded-[1.625rem]` FAQ
rows, 999px for every button and pill. Two shadows only: `0 18px 50px
rgba(24,82,142,0.08)` on white/paper cards, `0 12px 34px rgba(24,82,142,0.06)`
on FAQ rows.

**Motion.** Still the two systems in CLAUDE.md §4 — the single-stroke draw-on
(`Doodle drawOnScroll`, `StylisedCTA`, the journey connector) and the LoopField
parallax. Nothing new was added, and every section reads complete under
`prefers-reduced-motion`.

## 5. What changed, section by section

- **00 Welcome** — asymmetric two-column: the p34 headline and copy run flush
  left at a full measure, the tagline roundel and coral dashes take a narrow
  right rail. High-contrast LoopField behind. The hero now **measures the nav**
  and sets its own top padding, which is what stops the wayfinding row hiding
  under the nav when its link row wraps.
- **01 Start Here** — the tab strip is gone. All three `HOME_PATHS` are
  permanent cards (powder / canary / paper) with their CTA pinned to the card
  foot; two of three routes are no longer hidden behind a click.
- **03 Services** — the editorial spans already in `content/services.ts` finally
  show: per-span type scale, the tall coral card carries `cavities-stages` under
  its cobalt copy panel, and the wide Emergency card lays its doodle beside the
  copy instead of above it.
- **04 Inside the Clinic** — the one-at-a-time picker is gone; all three
  concepts render at the 7 / 5 / 12 weights already in `content/clinic.ts`, each
  with the full p32 tile treatment. The "concept visuals" disclosure moves up
  beside the heading in a `cobalt-20` panel.
- **05 Ria's Journey** — three beats read top to bottom as white cards; the tab
  strip, Previous/Next, `activeIndex` state and progressbar are all removed.
- **06 Dr. Nupur** — the philosophy quote becomes the heading with the p32 lasso
  around the single word *understood*; credentials move into an official-register
  cobalt panel under the portrait. Portrait stays `BrandImage placeholder`.
- **08 Parents' Corner** — five articles on the same six-column grid as services
  (3+3 / 2+2+2), image head over a body tinted by the `fill` already in content.
- **09 Parent Voices** — the awaiting state now looks intentional: two 33% white
  marks bleed off the edges, the left column states how quotes will be collected
  and consented, the three prompts sit beside it.
- **10 Questions** — native `<details>` rows. Search field, four category
  filters, the `useState`, and the "no exact match" branch are gone; eight
  questions never needed them, and find-in-page now works.
- **Footer** — roundel with the mark inside it as the centrepiece, tagline
  marquee on a `cobalt-80` band above, verified address plus the plain
  "phone, email and hours to follow" line, and the keyless map embed.
  `MOCK_CONTACT` is deliberately not imported.

## 6. Notes for review

- **`Hero.desktop.tsx` measures the nav in a ref callback** and does not
  disconnect its `ResizeObserver` — fine for a component that never unmounts on
  the home page, but if the hero ever mounts conditionally, move that block into
  a `useEffect` with a cleanup. It looks for `#site-nav` and falls back to the
  first `<header>`; if `Nav.tsx` has neither, give the nav that id.
- **Footer quick links** are derived from `SECTIONS` minus `hero`/`paths`, so
  adding a section to the registry adds it to the footer automatically.
- **No content was invented.** Address and Dr. Nupur's credentials are the
  client-verified strings in `content/site.ts` and `content/team.ts`.
  `AWAITING_REAL_TESTIMONIALS` still gates Parent Voices, the placeholder
  `TESTIMONIALS` array is still never rendered, `portrait.productionNote` stays
  out of the UI, and `hasFavouritePart` still gates that panel.
- **Photography licensing is still unconfirmed** (`README.md`), and the clinic
  imagery is still labelled as concept visuals on the page.
- `w-*`/`gap-*` values that are not on Tailwind's default scale are written as
  arbitrary values, so no `tailwind.config.ts` change is needed.
