# Tiny Tusk — handoff briefing

Front-end-only marketing site for a pediatric dental clinic. Vite + React 18 +
TypeScript strict + Tailwind + GSAP/ScrollTrigger. No backend. Brand source of
truth: `TINY_TUSK_Visual_Identity_Guide.pdf` in the repo root — page refs below
(p7, p24…) point into it. Client requirements live in `docs/brief-01-main.md`
and `docs/brief-02-coverage-addendum.md`; the page-by-page brand map is
`docs/brand-coverage.md`.

```
npm install && npm run dev     # http://localhost:5173/
npx tsc -b --noEmit            # must stay clean
```

---

## 1. What's finished (do not touch) and what you're building

**Finished and verified:** the brand asset module (`src/assets/brand/paths.ts`),
the design system (`tailwind.config.ts`, `src/index.css`,
`src/design/pairings.ts`, `src/lib/motion.ts`), every component in
`src/components/`, and four sections — `Nav`, `Hero`, `Journey` (pinned
horizontal scroll), `Services` — wired in `src/App.tsx`. All verified at
360/390/768/1440/1920: no horizontal overflow, clean console, reduced-motion
complete. `tools/*.py` is the pipeline that produced the assets; you will not
need to run it.

**This pass (client-agreed scope):**

1. **Preloader** — the logo's single stroke draws canary-on-cobalt (the `LOGO`
   asset is a true centreline, ready to draw), the tagline arc rotates in, the
   unit scales down into the nav's top-left slot. Max 1.8s, skippable, once per
   session (`sessionStorage`).
2. **Typed content files** in `src/content/` for: Ria's Journey, Team, Parents'
   Corner, Testimonials, FAQ, Booking. Match the voice of `journey.ts` /
   `services.ts`: warm, plain-spoken, parent-to-parent — never babyish, never
   clinical.
3. **Route stubs** for `/team`, `/services`, `/parents-corner`, `/book`
   (react-router-dom is installed; no router mounted yet). **Do not link the
   nav to stubbed routes.** `Nav.tsx` `LINKS` lists only sections that exist.

**Second pass (needs client go-ahead):** full sections for those content files,
Footer, the 2-Minute Brush timer, `<TextOnPath>` (arc/roundel/ring),
`<Circled>`, `<SectionDivider>`, `<DoodleField>`, `<BrandImage>`, custom
cursor, Lenis wiring (installed, CSS hooks in `index.css`, never initialised),
`docs/photography-brief.md`, Lighthouse (≥95/100/100/≥95). Client requirements
to satisfy across the finished site: all three CTA fills appear, both LoopField
contrast modes appear, all four doodles + all four supporting marks appear
(always stroke-drawn, never static), all three TextOnPath modes appear.

---

## 2. Design system and motion vocabulary

### Colour tokens — the only legal colour sources

| Token | Hex | Notes |
|---|---|---|
| `cobalt` | `#18528E` | tints `cobalt-80/60/40/20` exist for the official cobalt-on-cobalt pairing (p26) |
| `coral` | `#F16C59` | **cannot carry text — §4.1** |
| `canary` | `#FFE497` | hex is authoritative; the guide's printed RGB is a book typo |
| `powder` | `#C1CBE7` | |
| `paper` | `#F7F7F7` | page background |
| `white` | `#FFFFFF` | at 33% opacity for monochrome supporting shapes (p27) |

Tokens exist in exactly two files, kept in sync: `tailwind.config.ts`
(utilities) and `:root` in `src/index.css` (runtime, via `colourVar()`).

### Type

- `--font-sans` = Figtree (stand-in for Avenir Next), `--font-display` = Barlow
  Semi Condensed (stand-in for Avenir Next Condensed). Self-hosted woff2 in
  `public/fonts/`, no CDN. Licensed-Avenir swap = two custom properties; the
  procedure is a comment block in `index.css`.
- Scale (p20): `text-display` clamp(4rem,13vw,13rem) / 1.05 / −0.025em ·
  `text-h1` clamp(2.5rem,5vw,4rem) / 1.125 / −0.02em · `text-h2`
  clamp(1.5rem,2.5vw,2rem) / 1.125 / −0.01em · `text-body`
  clamp(1rem,1.2vw,1.25rem) / 1.6 / −0.01em.
- Mixed-weight convention (p20/p33): DemiBold first word + Regular rest, always
  through `<MixedWeightLabel>` — every CTA and card title.

### Motion — import gsap only from `src/lib/motion.ts`

- `EASE.entrance` = `power3.out` · `EASE.transform` = `power2.inOut` ·
  `EASE.celebrate` = `elastic.out(1, 0.6)` — **reserved for the brush-timer
  completion and nothing else**. Do not add easings. `STAGGER = 0.08`.
- **Everything derives from one continuous stroke: artwork and sections draw
  in, never fade in.** Text enters by clip reveal.
- **Max two animation systems visible at once.** Journey = connector draw +
  panel lift, nothing else. Adding a third means removing one.
- Animate `transform`/`opacity` only. Create triggers inside `gsap.context`
  and revert on unmount (every existing section shows the pattern).
- **Reduced motion is two layers and both are required:** CSS in `index.css`
  forces `[data-animate]` visible and `[data-draw]` complete; components check
  `usePrefersReducedMotion()` and skip timeline creation. No content may
  depend on motion to become visible. Tag accordingly: `data-animate` on
  anything a timeline fades/moves, `data-draw` on drawable strokes.
- `primeDraw(path, reduced)` sets up dasharray/offset and returns the length
  (clears instead under reduced motion). Use it; don't hand-roll dash math.

---

## 3. Brand primitives (`src/components/`)

**`<Logo>`** — the mark as a real single-stroke SVG. `variant`: `'mark' |
'wordmark' | 'wordmark-mark' | 'wordmark-mark-tag'` · `tone` · `size` px —
**≥64 always (p7); a dev warn fires below it — fix the call site, never the
guard** · `clearSpace` pads by the mark's own height per p7 · `drawable` adds
`data-draw` to the stroke paths · `title` for a11y (omit → `aria-hidden`).
The exported `<Wordmark>` is **outlined artwork (heart-dotted 'i'), extracted
verbatim — never re-set it in any typeface.**

**`<Doodle>`** — named brand doodle/mark with draw-on behaviour. `name` is a
typed union of asset keys. `drawOnScroll` draws once at 85% viewport;
`play` replays the gesture for hover/focus cards — **doodles always rest
complete: `play` re-runs the draw, it never gates visibility** (never-hovered
cards and touch devices must show finished art).

**`<LoopField>`** — oversized looping background strokes (pp28–29).
`surface`, `contrast: 'high'` (crosses colours: canary on powder, white on
cobalt) `| 'low'` (tonal), `depth` (parallax 0.2–0.5×), `count` 1–3. Always
decorative (`aria-hidden`).

**`<StylisedCTA>`** — signature button (p33): fill ellipse + offset hand-drawn
cobalt outline that redraws on hover, magnetic (capped ±12/8px), both skipped
under reduced motion. `lead`/`rest`, `href` or `onClick`, `fill: 'canary' |
'powder' | 'coral'`. **The coral fill auto-adds a cobalt label plate (§4.1) —
don't work around it.**

**`<TextPanel>`** — legibility enforcement for copy on coloured surfaces.
No-op on surfaces that can carry text; on coral it beds children on a cobalt
panel. **Wrap unconditionally** — the rule can't be forgotten if the wrapper
is always there. Helper: `textToneFor(surface, preferred)`.

**`<BrandArtView>`** — renders any `ART[name]` asset (handles all three part
kinds incl. mask plumbing). Exports `colourVar(colour)` — use it for any
runtime colour. **`<MixedWeightLabel>`** — `lead` (600) + `rest` (400) as one
element so screen readers get one phrase; `display` switches face.
**`<SectionNumber>`** — the guide's `00–04` wayfinding (p2); numbers come from
`SECTIONS` in `src/content/site.ts`, never hardcoded.

**Pairing API** (`src/design/pairings.ts`): `PAIRINGS` transcribes every
permitted surface/element pair from pp24–27 with its source page;
`isPermitted`, `resolveElement` (throws in dev on an illegal pair),
`carriesText`, `assertLegibleText`.

---

## 4. Rules that will bite you

1. **Coral cannot carry text. At any size. In any colour.** Measured: canary
   on coral **2.39:1**, cobalt **2.67:1**, white **2.99:1** — all fail even
   the 3:1 large-text floor (white by 0.01). The original brief's "display
   ≥32px" mitigation is superseded — the surface itself cannot host type.
   Coral stays a full-strength field and graphic colour; copy over it goes on
   a cobalt panel via `<TextPanel>`. Full table: `docs/contrast-audit.md`.
2. **The variable-width doodles keep their exact artwork.** Toothbrush
   bristles, toothpaste squiggle, curved arrow are tapering brush strokes —
   no constant-width stroke path can reproduce them (attempts cap at ~67%
   fidelity). They ship as exact fills revealed by an animatable
   skeleton-stroke mask (`maskedFill` parts). **Never convert them to stroke
   paths.** Related: `src/assets/brand/paths.ts` is a generated, validated
   artifact — do not hand-edit or regenerate it.
3. **Pairings are directional and registered.** Powder bg + cobalt elements is
   legal; the reverse is not. The `official` register (p26) governs booking,
   legal and clinical surfaces; playful registers govern marketing. Don't
   blur them.
4. **No raw hex in components.** Token classes, CSS vars, or `colourVar()`
   only.
5. **The dev-time throws/warns are the enforcement layer — never catch,
   silence, or soften them.** If a guard fires, the call site is wrong (the
   64px logo warn has already caught one real regression).
6. **Strict TS stays fully on**, including `exactOptionalPropertyTypes` —
   optional props on shared components need explicit `| undefined`. Zero
   `any`, zero console errors.
7. **Verify in the browser yourself** — screenshot desktop + mobile, check
   `scrollWidth === innerWidth`, the console, and a reduced-motion pass. The
   client will not check for you.

### Traps already hit once — don't rediscover them

- `maskUnits="userSpaceOnUse"` needs explicit `x/y/width/height`: the default
  region is −10%…120% *of the viewport*, and this artwork lives at large
  viewBox coordinates — without bounds the mask silently renders nothing.
  `BrandArtView` does it right; copy it.
- HTML `hidden` loses to a Tailwind `flex` utility. The mobile nav drives
  visibility from the class list and uses `inert` (not in React 18 typings —
  spread with a narrow cast, see `Nav.tsx`).
- In `Journey`, the header owns its own flex row and the canary connector is
  positioned against the *track*, not the section. Don't absolutely position
  anything over the pinned track — panels ride up under it.
- `ART` uses `satisfies Record<string, BrandArt>` so keys stay literal — that
  is what makes `DoodleName` a real union. Don't widen it.
