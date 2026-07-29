# Tiny Tusk — handoff briefing

Front-end-only marketing site for a pediatric dental clinic. Vite + React 18 +
TypeScript strict + Tailwind + GSAP/ScrollTrigger. Zero backend. The brand
source of truth is `TINY_TUSK_Visual_Identity_Guide.pdf` (36pp, in repo root);
page references below (p7, p24…) point into it.

Run: `npm install && npm run dev` → http://localhost:5173/
Check: `npx tsc -b --noEmit` must stay clean (strict, `exactOptionalPropertyTypes` on).

---

## 1. STATUS

### Built, verified, do not touch

- **Brand asset pipeline** — `tools/*.py` extracted every piece of artwork from
  the PDF into `src/assets/brand/paths.ts` (19 assets + logo + wordmark), each
  pixel-diffed against the guide's own vectors at 95.7–100% IoU. See §5 before
  going anywhere near this.
- **Design system** — tokens (`tailwind.config.ts`, `src/index.css`), pairing
  law (`src/design/pairings.ts`), motion constants (`src/lib/motion.ts`).
- **Brand primitives** — all components in `src/components/` (contracts in §3).
- **Sections** — `Nav`, `Hero`, `Journey` (pinned horizontal scroll), `Services`
  in `src/sections/`, wired in `src/App.tsx`. Screenshot-verified at
  360/390/768/1440/1920, console clean, no horizontal overflow, reduced-motion
  verified complete.
- **Docs** — `docs/contrast-audit.md` (measured ratios; §4 summarises),
  `docs/brand-coverage.md` (all 36 guide pages → site element map, with open
  client flags), `docs/brief-01-main.md` + `docs/brief-02-coverage-addendum.md`
  (the client's requirements, verbatim — read both before building anything).

### Remaining — this pass (client-agreed scope)

1. **Preloader** — logo stroke draws canary-on-cobalt (`LOGO` asset is ready and
   drawable), tagline arc rotates in, unit scales into the nav's top-left slot.
   ≤1.8s, skippable, once per session (`sessionStorage`).
2. **Typed content files** under `src/content/` for: Ria's Journey, Team,
   Parents' Corner, Testimonials, FAQ, Booking. Copy voice: warm, plain-spoken,
   parent-to-parent, never babyish, never clinical (match `journey.ts` /
   `services.ts`).
3. **Route stubs** for `/team`, `/services`, `/parents-corner`, `/book`
   (react-router-dom is installed, no router mounted yet). **Do not link the
   nav to stubbed routes** — client instruction. `Nav.tsx` `LINKS` only lists
   sections that exist; keep it that way.

### Remaining — second pass (do not start without the client)

Full sections for the content files above, plus Footer, the 2-Minute Brush
timer, `<TextOnPath>` (arc/roundel/ring modes), `<Circled>`, `<SectionDivider>`,
`<DoodleField>`, `<BrandImage>`, custom cursor, Lenis wiring (installed and CSS
hooks exist in `index.css`; never initialised), `docs/photography-brief.md`,
Lighthouse run (targets: ≥95 perf / 100 a11y / 100 best-practices / ≥95 SEO),
and re-verification of `docs/brand-coverage.md` against real code.

---

## 2. DESIGN SYSTEM

### Colour tokens — the only legal colour sources

| Token | Hex | Notes |
|---|---|---|
| `cobalt` | `#18528E` | + generated tints `cobalt-80/60/40/20` for the official cobalt-on-cobalt pairing (p26) |
| `coral` | `#F16C59` | **cannot carry text — §4** |
| `canary` | `#FFE497` | hex is authoritative; the guide's RGB (225,…) is a book typo |
| `powder` | `#C1CBE7` | |
| `paper` | `#F7F7F7` | page background |
| `white` | `#FFFFFF` | at 33% opacity for monochrome shapes (p27, `MONOCHROME_OPACITY`) |

Defined twice, deliberately in sync: `tailwind.config.ts` (utility classes) and
`:root` CSS vars in `src/index.css` (runtime access via `colourVar()`).

### Type

- `--font-sans` = Figtree (variable 300–900) standing in for Avenir Next;
  `--font-display` = Barlow Semi Condensed (400/600) for Avenir Next Condensed.
  Self-hosted woff2 in `public/fonts/`, no CDN calls. The licensed-Avenir swap
  procedure is a comment block in `index.css` — two custom properties, nothing
  else references a family name.
- Scale (guide p20, fluid): `text-display` clamp(4rem,13vw,13rem)/1.05/−0.025em ·
  `text-h1` clamp(2.5rem,5vw,4rem)/1.125/−0.02em · `text-h2`
  clamp(1.5rem,2.5vw,2rem)/1.125/−0.01em · `text-body`
  clamp(1rem,1.2vw,1.25rem)/1.6/−0.01em.
- Mixed-weight convention (p20/p33): DemiBold first word + Regular rest, always
  via `<MixedWeightLabel>` on CTAs and card titles.

### Motion — `src/lib/motion.ts`

- `EASE.entrance` = `power3.out` (all entrances) · `EASE.transform` =
  `power2.inOut` (all transforms) · `EASE.celebrate` = `elastic.out(1, 0.6)` —
  **reserved exclusively for the brush-timer completion**. Do not add easings.
- `STAGGER = 0.08` for per-line/per-item reveals.
- **Everything derives from one continuous stroke: sections and artwork draw
  in, never fade in.** Text uses clip reveals.
- **Two-animation-systems rule:** never more than two animation systems visible
  at once (e.g. Journey = connector draw + panel lift, nothing else). If adding
  a third, remove one.
- Animate `transform`/`opacity` only. Kill ScrollTriggers on unmount
  (`gsap.context` + revert, as every section already does).
- Reduced motion: CSS in `index.css` forces `[data-animate]` visible and
  `[data-draw]` complete; JS side checks `usePrefersReducedMotion()` and skips
  timeline creation. Both layers are required — content must never depend on
  motion to become visible. Verified working; keep it that way for new sections.

---

## 3. COMPONENT CONTRACTS (`src/components/`)

**`<Logo>`** — the mark as a true single-stroke SVG (recovered centreline).
Props: `variant` `'mark' | 'wordmark' | 'wordmark-mark' | 'wordmark-mark-tag'`,
`tone` (BrandColour | 'current'), `size` px (**≥64 — a dev-time `console.warn`
fires below that, guide p7 minimum; fix the call site, never silence the
guard**), `clearSpace` (pads by the mark's own height on all sides, p7 —
encoded here so call sites can't forget it), `drawable` (adds `data-draw` to
the stroke paths for animation), `title` (a11y name; omit → `aria-hidden`).
Also exports `<Wordmark>`: the wordmark is **outlined artwork with a
heart-dotted 'i', extracted verbatim — never re-set it in any typeface**.

**`<BrandArtView>`** — renders any `ART[name]` asset. Props: `art`, `tone`
(overrides per-part colour), `drawable`, `title`. Handles the three part kinds
(`stroke` / `fill` / `maskedFill`) including the mask plumbing. Exports
`colourVar(colour)` → CSS var string; use it for any runtime colour.

**`<Doodle>`** — a named brand doodle/mark with draw-on behaviour. Props:
`name` (typed union of ART keys), `drawOnScroll` (draws once at 85% viewport),
`play` (controlled replay for hover/focus cards — **the doodle always rests
complete; `play` re-runs the gesture, it never gates visibility**, so
never-hovered cards and touch devices still show finished art), `duration`,
`stagger`, `tone`, `title`.

**`<LoopField>`** — oversized looping background strokes (pp. 28–29). Props:
`surface` (what it sits on), `contrast` `'high'` (crosses colours: canary on
powder, white on cobalt) `| 'low'` (tonal), `depth` (parallax 0.2–0.5×),
`count` 1–3. Both contrast modes must appear somewhere on the finished site
(client requirement). Always `aria-hidden`.

**`<StylisedCTA>`** — the signature button (p33): fill ellipse + deliberately
offset hand-drawn cobalt outline. Props: `lead`/`rest` (mixed-weight label),
`href` or `onClick`, `fill` `'canary' | 'powder' | 'coral'`. All three fills
must appear on the finished site. Hover = magnetic (capped ±12/8px) + outline
redraw; both skipped under reduced motion. **Coral fill auto-adds a cobalt
label plate** (§4) — don't work around it.

**`<TextPanel>`** — legibility enforcement. Props: `surface`, `className`.
No-op wrapper on surfaces that can carry text; on `coral` it beds the children
on a cobalt panel. **Wrap unconditionally** wherever copy sits on a
content-coloured surface — that's the design: the rule can't be forgotten if
the wrapper is always there. Helper `textToneFor(surface, preferred)`.

**`<MixedWeightLabel>`** — `lead` (600) + `rest` (400) as one element (screen
readers get one phrase). `display` prop switches to the condensed face.

**`<SectionNumber>`** — the guide's own `00–04` wayfinding (p2) as
`number — label`. Decorative; the real heading sits beside it. Section
numbering comes from `SECTIONS` in `src/content/site.ts` — never hardcode.

### Support APIs

- `src/design/pairings.ts` — `PAIRINGS` (every permitted surface/element pair,
  transcribed from pp. 24–27, each with its source page), `isPermitted`,
  `resolveElement` (throws in dev on an illegal pair), `carriesText`,
  `assertLegibleText`, `NON_TEXT_SURFACES`, `MONOCHROME_OPACITY`.
- `src/lib/motion.ts` — `primeDraw(path, reduced)` sets dasharray/offset and
  returns length (no-ops and clears under reduced motion); single
  `gsap.registerPlugin(ScrollTrigger)` — import gsap only from here.
- Content model: `site.ts` (`CLINIC`, `HERO` — guide's verbatim welcome copy —
  `SECTIONS`), `journey.ts` (4 beats + centre "hinge" = the finished mark),
  `services.ts` (`span: 'hero' | 'wide' | 'tall' | 'regular'` on a 6-col grid;
  rows resolve 4+2 / 2+2+2 / 2+4).

---

## 4. HARD RULES

1. **Coral cannot carry text. At any size. In any colour.** Measured: canary on
   coral **2.39:1**, cobalt **2.67:1**, white **2.99:1** — all below even the
   3:1 large-text floor (white misses by 0.01). The original brief's "display
   ≥32px only" mitigation is insufficient and superseded. Coral stays a
   full-strength field/graphic colour; copy over it goes on a cobalt panel via
   `<TextPanel>`. Full table in `docs/contrast-audit.md`.
2. **Only permitted colour pairings** (guide pp. 24–27, encoded in
   `PAIRINGS`). Pairings are *directional* — powder bg + cobalt elements is
   legal, the reverse is not. Registers matter: `official` (p26) governs the
   booking form, legal and clinical surfaces; playful registers govern
   marketing surfaces. Don't blur them.
3. **No raw hex in components.** Tailwind token classes, CSS vars, or
   `colourVar()` only. The four brand hexes exist in exactly two files
   (`tailwind.config.ts`, `index.css`).
4. **The dev-time throws are the enforcement layer — never catch, silence, or
   soften them.** `resolveElement`/`assertLegibleText` throw in dev, warn in
   prod. The `<Logo>` 64px warn already caught one real regression (nav
   rendering the mark at 40px; fixed by tightening the pill, not the mark).
   If a guard fires, the call site is wrong.
5. **TypeScript strict stays fully on**, including
   `exactOptionalPropertyTypes` — optional props on shared components need
   explicit `| undefined`. Zero `any`. Zero console errors/warnings.
6. **Verify in the browser yourself** (Playwright scripts in `tools/` pattern):
   screenshot desktop + mobile, check `scrollWidth === innerWidth`, check the
   console, check reduced motion. Client instruction: don't ask them to check.

---

## 5. GOTCHAS

- **Three doodles are variable-width brush strokes** (toothbrush bristles,
  toothpaste squiggle, curved arrow — the `maskedFill` parts). The guide draws
  them with a tapering brush; **no constant-width stroke path can reproduce
  them** (attempts cap at ~67% fidelity). They ship as the *exact* filled
  artwork revealed by a skeleton-stroke mask whose dashoffset animates. **Do
  not convert them to stroke paths.**
- **`src/assets/brand/paths.ts` is generated, geometrically derived, and
  validated. Do not hand-edit it and do not regenerate it** — the shipped file
  is the verified artifact (each asset's IoU is annotated inline). The pipeline
  in `tools/` exists for provenance and client hand-off, not for casual re-runs.
- **SVG masks with `maskUnits="userSpaceOnUse"` need explicit
  `x/y/width/height`.** The default mask region is −10%…120% *of the viewport*,
  and this artwork lives at large viewBox coordinates (e.g. x≈1100) — without
  bounds the mask silently renders nothing. `BrandArtView` does this correctly;
  copy it for any new mask.
- **HTML `hidden` loses to a Tailwind `flex` class** (UA `display:none` vs
  utility). The mobile nav drives visibility from the class list and uses
  `inert` for the closed state — `inert` isn't in React 18's typings, so it's
  spread with a narrow cast (see `Nav.tsx`).
- **Journey layout:** the section header owns its own flex row; the pinned
  track fills the rest. Don't absolutely position anything over the track —
  panels ride up under it (this was a real bug). The canary connector SVG is
  positioned against the *track* so it travels with the panels.
- **`ART` uses `satisfies Record<string, BrandArt>`** so keys stay literal —
  that's what makes `DoodleName` a real union. Don't widen it back to
  `Record<string, …>`.
- The scratch extraction workspace was session-temp; everything needed to
  understand or re-derive assets lives in `tools/` + the PDF.
