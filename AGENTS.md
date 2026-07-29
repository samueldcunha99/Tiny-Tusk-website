# Tiny Tusk — current developer briefing

Front-end marketing site for **Tiny Tusk Pediatric Dental Clinic**. It is a
Vite + React 18 + TypeScript (strict) + Tailwind + GSAP/ScrollTrigger project;
there is no backend. The brand source of truth is
`TINY_TUSK_Visual_Identity_Guide.pdf`. Source requirements and audits live in
`docs/brief-01-main.md`, `docs/brief-02-coverage-addendum.md`,
`docs/brand-coverage.md`, and `docs/contrast-audit.md`.

```sh
npm install
npm run dev                 # http://localhost:5173
npm run typecheck           # tsc -b --noEmit
npm run build
```

`@` resolves to `src/`. `src/assets/brand/paths.ts` is generated artwork from
the brand book: do not hand-edit or regenerate it.

## Status — code as it exists today

“Done” means implemented in code. **The entire phase-two pass was not
visually verified in a browser after implementation**: its timing, responsive
spacing, overflow, console state, and reduced-motion presentation remain
untuned. Do that before calling the site finished.

### Shared shell and home page

| Area | Status | Notes |
|---|---|---|
| `Nav` | done | Desktop links plus accessible mobile overlay. Links are `/services`, `/dr-nupur`, `/parents-corner`, `/book`. |
| `Preloader` | partial | Canary logo draw on cobalt, tagline arc, skip control, sessionStorage gate, and reduced-motion exit exist. Its 1.8s timing/transition into nav has not been visually tuned. |
| `Hero` | done | Existing phase-one hero with loop field and CTA. |
| `Journey` | done | Pinned horizontal Detection → Treatment → Care → Smile sequence. Treat its layout as high-risk; do not position new elements over its track. |
| `Services` | done | Editorial six-card grid. Service image tiles and full service detail pages do not exist. |
| `RiaJourney` | partial | Sticky-column story with the Ria hero photo and three beats. Layout and image treatment need browser QA. |
| `Team` / Dr. Nupur | partial | Now one editorial practitioner spread, not a three-card grid. Uses a branded portrait placeholder until approved photography is supplied. |
| `ParentsCorner` | partial | Five image-led article cards with real supplied images. Their “Read the guide” links return to `/parents-corner`; individual article pages are not built. |
| `Testimonials` | partial | Cobalt marquee with duplicated quote cards and monochrome doodles. Marquee seam, speed, and small-screen behavior are unverified. |
| `Faq` | partial | Accessible stateful accordion; no browser keyboard pass has been run. |
| `Booking` | partial | Four-step, client-side-only form with kind validation and success state. It does not submit data anywhere. |
| Footer | not started | No footer, contact block, map, legal links, or final tagline unit. |
| 2-minute brush timer | not started | `EASE.celebrate` remains reserved for this. |

`App.tsx` renders all of the above on `/`. There is no lazy loading.

### Routes

| Route | Status | What it renders |
|---|---|---|
| `/` | done | Full single-page sequence. |
| `/dr-nupur` | partial | The Dr. Nupur practitioner page only. |
| `/services` | done | Services section only. |
| `/parents-corner` | partial | Parents’ Corner cards only; no article detail routes. |
| `/book` | partial | Booking section only; form has no backend. |
| `/team` | intentionally removed | Do not restore the old team-grid route. Consider a redirect only if legacy traffic requires it. |
| `*` | implemented | Falls back to the home page. |

The router is `BrowserRouter`; production hosting must serve `index.html` for
deep links such as `/dr-nupur`.

## Dr. Nupur page

`src/sections/Team.tsx` and `src/content/team.ts` are the single source for
the practitioner page. The only confirmed qualifications are **BDS · MDS,
Pediatric Dentistry**. Do not invent years of experience, education,
memberships, awards, publications, patient numbers, or biographical facts.

The content intentionally contains two visible TODOs: an approved portrait and
Dr. Nupur’s own “favourite part of the job” wording. Replace them only with
client-confirmed material.

The page deliberately splits the registers:

- Credentials use the **official** cobalt background + white text pairing
  (guide p26): restrained, clinical, and precise.
- Philosophy and expectation beats use the **playful** powder/cobalt,
  canary/cobalt, and cobalt/canary pairings: reassuring and child-friendly.

That contrast is intentional: it is the brand’s “meticulous practice with room
for playfulness” principle. Do not turn qualifications into a playful card or
put clinical copy directly on coral.

The portrait is a 4:5 `BrandImage` placeholder. The required replacement shot
is specified in `docs/photography-brief.md`.

## Photography

Each supplied image has a `.webp` primary and a `.png` fallback in
`public/images/`. `BrandImage` renders the WebP through `<picture>` and carries
the image-tile treatment: a top-left logo watermark, coral dashes, one drawn
doodle, and a stylised CTA title at the bottom. Image dimensions below refer to
both formats.

| Asset stem | Dimensions / ratio | Subject | Current slot |
|---|---|---|---|
| `rias-journey-hero` | 1600×1050, 32:21 landscape | Girl laughing in a dental chair | Ria’s Journey lead tile |
| `child-pointing-smile` | 800×1200, 2:3 portrait | Girl pointing to her teeth in clinic | Parents’ Corner: “Mythbusting the 2-minute rule” |
| `cavities-stages` | 1199×1798, ~2:3 portrait | Boy in chair under blue curing light | Parents’ Corner: “Cavities stages” |
| `brushing-demo` | 711×799, ~0.89:1 portrait | Hand brushing a denture model | Parents’ Corner: toothpaste guide |
| `toothbrush-product` | 649×704, ~0.92:1 product portrait | Toothbrush on white | Parents’ Corner: “Do not use these!” |
| `retainer-product` | 901×305, ~2.95:1 wide product | Clear retainer on white | Parents’ Corner: retainers guide |

**Licensing is unconfirmed.** The images were extracted from the client’s brand
book; confirm rights and web-use permission with the client before launch.
`README.md` carries the same launch warning.

## Component contracts

All brand-facing components live in `src/components/`. Reuse these primitives;
do not redraw their artwork or reimplement their rules.

| Component | Contract |
|---|---|
| `BrandArtView` | `art` (required `BrandArt`), `tone?`, `className?`, `drawable?`, `title?`. Renders stroke, fill, and exact masked-fill artwork. Exports `colourVar(BrandColour \| 'current')` for runtime SVG/CSS colour values. |
| `Logo` | `variant?: 'mark' \| 'wordmark' \| 'wordmark-mark' \| 'wordmark-mark-tag'`, `tone?`, `size?`, `className?`, `clearSpace?`, `drawable?`, `title?`. `Wordmark` is separately exported with `tone?`, `width?`, `className?`, `title?`. |
| `Doodle` | `name` is the `DoodleName` union (four doodles, four supporting marks, five journey glyphs); `tone?`, `className?`, `title?`, `drawOnScroll?`, `play?`, `duration?`, `stagger?`. It always rests complete; `play` only replays the gesture. |
| `LoopField` | `surface` required; `contrast?: 'high' \| 'low'`, `className?`, `depth?` (0.2–0.5 intent), `count?: 1 \| 2 \| 3`. Decorative only. |
| `MixedWeightLabel` | `lead`, `rest` required; `className?`, `display?`, `style?`. Use for CTA and card-title first-word DemiBold / remainder Regular treatment. |
| `SectionNumber` | `number`, `label` required; `tone?`, `className?`. Numbers come from `SECTIONS`, never hardcode them. |
| `StylisedCTA` | `lead`, `rest` required; `href?` **or** `onClick?`, `fill?: 'canary' \| 'powder' \| 'coral'`, `className?`. Coral gets an automatic cobalt label plate. |
| `TextPanel` | `surface`, `children` required; `className?`. Always wrap copy when its parent may be coral. `textToneFor(surface, preferred)` returns the safe text tone. |
| `BrandImage` | `webp?` + `png?` for a real image **or** `placeholder`; plus required `alt`, `width`, `height`, `title: { lead, rest, fill, href }`, `logoTone: 'white' \| 'cobalt'`, `doodle`, `doodleTone: 'canary' \| 'coral'`; `className?`, `eager?`. Do not bypass it for branded image tiles. |
| `Circled` | `children` required; `tone?`. Inline lasso treatment; it draws `markLasso` on scroll. |
| `TextOnPath` | `text` required; `tone?`, `className?`. Current implementation supports **only a single arc** and is decorative (`aria-hidden`); keep a semantic text equivalent next to it. Roundel and repeating-ring modes are not implemented. |

## Design, pairing, motion, and accessibility rules

### Tokens and typography

Only legal colour sources are Tailwind tokens, `var(--tt-*)`, or `colourVar()`:

| Token | Hex |
|---|---|
| cobalt | `#18528E` |
| coral | `#F16C59` |
| canary | `#FFE497` |
| powder | `#C1CBE7` |
| paper | `#F7F7F7` |
| white | `#FFFFFF` |

No raw hex values in handwritten section/component code. Figtree and Barlow
Semi Condensed are self-hosted stand-ins controlled only by `--font-sans` and
`--font-display` in `src/index.css`.

`src/design/pairings.ts` is the directional register. Do not invert pairings:
powder/cobalt is legal, cobalt/powder is not. Use the official p26 register
for booking, qualifications, legal, and clinical material; use the playful
register for marketing. Supporting marks on a solid brand surface are white at
33% opacity only.

### Non-negotiable guardrails

1. **Coral cannot carry text.** Measured contrast: canary on coral **2.39:1**,
   cobalt on coral **2.67:1**, white on coral **2.99:1**. White misses even
   the 3:1 large-text floor. Coral remains a full-strength graphic field; put
   every bit of copy on a cobalt `TextPanel` over it. Never tint or darken
   coral to evade this rule.
2. **Logo minimum is 64px.** `Logo` logs a development warning below **64px**;
   fix the call site rather than shrinking the mark or silencing the warning.
   Clear space is one mark height when `clearSpace` is enabled.
3. **Development throws and warnings are guardrails.** `resolveElement()` and
   `assertLegibleText()` intentionally throw in development for illegal
   pairings / coral text. Fix the call site; never catch, remove, or weaken the
   enforcement.
4. **Keep variable-width doodles exact.** Toothbrush bristles, toothpaste
   squiggle, and curved arrow are masked fills revealed by skeleton masks, not
   constant-width stroke paths. Never convert them.
5. **Preserve strict TypeScript.** `exactOptionalPropertyTypes` is enabled;
   no `any`, no ignored errors, and no console errors.

### Motion and reduced motion

Import GSAP only from `src/lib/motion.ts`. Use `EASE.entrance` (`power3.out`),
`EASE.transform` (`power2.inOut`), `STAGGER` (`0.08`), and reserve
`EASE.celebrate` (`elastic.out(1, 0.6)`) for the unbuilt brush-timer finish.
Animate only `transform` and `opacity`; create ScrollTriggers in
`gsap.context()` and revert them on unmount. Keep no more than two visible
animation systems at once.

Reduced motion is two-layered and mandatory: mark JS-animated content with
`data-animate`, drawable geometry with `data-draw`, use
`usePrefersReducedMotion()` to skip timelines, and let `index.css` resolve all
content and strokes to their completed state. Nothing may rely on motion to
become visible.

## Known gaps — the next developer’s honest to-do list

- Perform full browser QA at 360 / 390 / 768 / 1024 / 1440 / 1920: screenshots,
  `scrollWidth === innerWidth`, route loading, console, keyboard path, and a
  reduced-motion pass. Phase-two animation timing and spacing are unverified.
- Replace the Dr. Nupur portrait placeholder and both content TODOs with
  client-approved materials. Confirm all six supplied image licenses before
  launch.
- Build individual Parents’ Corner article pages; cards currently link back to
  their index. Add real service detail pages if required.
- Add the Footer, clinic contact/legal information, map, and final tagline
  lockup. The hard-coded clinic contact details in `src/content/site.ts` are
  not client-confirmed and need review before launch.
- Finish the 2-minute brush timer, generic `TextOnPath` roundel/ring modes,
  `SectionDivider`, `DoodleField`, and custom cursor only after confirming
  scope. `TextOnPath` currently implements an arc only.
- Tune/validate the preloader once-per-session flow, testimonial marquee seam,
  FAQ keyboard behavior, Booking validation/success flow, and mobile nav in a
  real browser.
- Connect Booking to an approved backend or third-party scheduling flow; it
  currently stores nothing. Add success/error handling and privacy language.
- Add a production SPA fallback for deep routes, metadata/OG images,
  `Dentist`/LocalBusiness schema, favicon, performance budget, and a real
  Lighthouse run. No Lighthouse scores are available.
- Review `content-visibility` with pinned Journey and sticky pages in actual
  target browsers; those combinations can have layout edge cases.
