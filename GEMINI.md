# Tiny Tusk — developer briefing

Front-end-only marketing site for **Tiny Tusk Pediatric Dental Clinic**.
Vite + React 18 + TypeScript (strict) + Tailwind + GSAP/ScrollTrigger. No backend.

```sh
npm install
npm run dev          # http://localhost:5173
npm run typecheck    # tsc -b --noEmit  — must stay clean
npm run build
```

`@` resolves to `src/`. Brand source of truth is `TINY_TUSK_Visual_Identity_Guide.pdf`
(36pp, repo root); page refs below (p7, p24…) point into it.

**➡ `docs/audit-2026-07-29.md` is the standing to-do list.** It is numbered 1–28
and every item below is cross-referenced to it. Read it before picking up work;
update it as you go. Other docs: `docs/brief-01-main.md` and
`docs/brief-02-coverage-addendum.md` (client requirements, verbatim),
`docs/contrast-audit.md`, `docs/brand-coverage.md`.

---

## 1. Content status — read before touching copy

Three facts about this project's content that are easy to get wrong:

- **Dr. Nupur's credentials are CLIENT-VERIFIED and must stay.** `BDS · MDS,
  Pediatric Dentistry` in `src/content/team.ts` is genuine, supplied and
  confirmed by the client. An earlier audit wrongly flagged it as invented. The
  file carries a protective comment — do not strip it during any sweep for
  unverified claims. (audit: "CONFIRMED OK" row)

- **Testimonials are placeholders and must not be presented as reviews.** An
  earlier draft contained four invented parents and children. They have been
  removed. `src/content/testimonials.ts` now holds obvious placeholders behind
  `AWAITING_REAL_TESTIMONIALS = true`, and the section renders an honest
  "we are collecting these properly" state. Flip the flag only once the clinic
  supplies real quotes **with written consent** and agreed attribution.
  (audit #1)

- **Photography licensing is unconfirmed.** Everything in `public/images/` was
  extracted from the client's own brand book. Clearance for web use has not been
  obtained. Noted in `README.md`. (audit #3)

General rule: never invent clinical claims, credentials, prices, hours,
addresses or statistics. Where a real fact is needed, leave a `TODO` **in the
content file as a code comment** — never as a rendered string. Two raw `TODO:`
strings were reaching visitors and have been removed (audit #2).

Voice: warm, plain-spoken, parent-to-parent. Never babyish, never clinical.
`content/journey.ts` and `content/services.ts` are the reference.

## 2. What Phase 1a fixed (all verified in a browser)

Integrity: #1 testimonials de-fabricated · #2 leaked `TODO:` strings removed ·
#3 licensing note confirmed in README.

Bugs: #4 `fetchPriority` → `fetchpriority` (console now clean) · #5 duplicate
`<h1>` (Hero keeps it, Team is `h2`) · #6 Dr. Nupur's quote rendered twice ·
#7 `<Circled>` lasso cutting through words · #8 Parents' Corner titles clipping
and third card overflowing · #9 section numbering skipping `05` · #10 unknown
URLs silently rendering the homepage.

Verified after the fixes: one `h1`, numbering continuous `00–08`, zero rendered
`TODO`, no invented names, no console errors, no horizontal overflow, `/404`
resolves to `<NotFound>`.

## 3. What remains

**Do not treat the site as finished.** Everything written after `Services` was
implemented without a browser and is untuned. Full list with numbers in
`docs/audit-2026-07-29.md`:

- **Visual tuning (#11–19):** preloader's hardcoded landing position, Ria's fake
  mood indicator, bare "N" image placeholder, image-title CTAs sitting across
  faces, sparse FAQ / Testimonials / Booking, untuned reveal thresholds, and
  `Booking.tsx` written as a few enormous single lines that need reformatting to
  house style before extension.
- **Missing scope (#20–28):** no footer at all, minimal 404, `TextOnPath` missing
  its `roundel` and `ring` modes, no brush-timer section, no per-route SEO,
  README is a stub, plus all of Phase 2 content, the Phase 3 through-line, and
  Phase 4 polish (favicon added).

## 4. Design system

**Colour tokens** — the only legal colour sources. Defined in exactly two files
kept in sync: `tailwind.config.ts` and `:root` in `src/index.css`
(runtime access via `colourVar()`).

| Token | Hex | Note |
|---|---|---|
| `cobalt` | `#18528E` | tints `cobalt-80/60/40/20` for the official cobalt-on-cobalt pairing (p26) |
| `coral` | `#F16C59` | **cannot carry text — see §6** |
| `canary` | `#FFE497` | hex is authoritative; the book's printed RGB is a typo |
| `powder` | `#C1CBE7` | |
| `paper` | `#F7F7F7` | page background |
| `white` | `#FFFFFF` | at 33% opacity for monochrome shapes (p27) |

**Type** — `--font-sans` Figtree (stands in for Avenir Next), `--font-display`
Barlow Semi Condensed (for Avenir Next Condensed). Self-hosted woff2, no CDN.
The licensed-Avenir swap is two custom properties; procedure is commented in
`index.css`. Scale (p20): `text-display` clamp(4rem,13vw,13rem)/1.05/−0.025em ·
`text-h1` clamp(2.5rem,5vw,4rem)/1.125/−0.02em · `text-h2`
clamp(1.5rem,2.5vw,2rem)/1.125/−0.01em · `text-body`
clamp(1rem,1.2vw,1.25rem)/1.6/−0.01em. Mixed-weight convention (DemiBold first
word + Regular rest) always via `<MixedWeightLabel>`.

**Motion** — import gsap only from `src/lib/motion.ts`.
`EASE.entrance` = `power3.out` · `EASE.transform` = `power2.inOut` ·
`EASE.celebrate` = `elastic.out(1, 0.6)` **reserved for the brush-timer
completion alone**. `STAGGER = 0.08`. Do not add easings.

- Everything derives from one continuous stroke: artwork and sections **draw in,
  never fade in**. Text enters by clip reveal.
- **Never more than two animation systems visible at once.** Adding a third
  means removing one.
- Animate `transform`/`opacity` only. Build triggers inside `gsap.context` and
  revert on unmount.
- **Reduced motion is two layers, both required:** CSS in `index.css` forces
  `[data-animate]` visible and `[data-draw]` complete; components also check
  `usePrefersReducedMotion()` and skip timeline creation. No content may depend
  on motion to be visible. Tag new work accordingly.
- `primeDraw(path, reduced)` sets dash properties and returns length. Use it.

## 5. Component contracts (`src/components/`)

- **`<Logo>`** — the mark as a real single-stroke SVG. `variant`
  `'mark' | 'wordmark' | 'wordmark-mark' | 'wordmark-mark-tag'`, `tone`, `size`
  px (**≥64 always, p7 — a dev warning fires below it; fix the call site, never
  silence the guard**), `clearSpace` (pads by the mark's own height), `drawable`,
  `title`. Exported `<Wordmark>` is **outlined artwork with a heart-dotted "i" —
  never re-set it in a typeface.**
- **`<Doodle>`** — named brand doodle/mark. `drawOnScroll` draws once at 85%
  viewport. `play` **replays** the gesture for hover/focus; doodles always rest
  **complete**, so never-hovered cards and touch devices still show finished art.
  `preserveAspectRatio="none"` to stretch (see `<Circled>`).
- **`<Circled>`** — the guide's lasso around **one word** in a headline (p32).
  Wrapping a whole multi-word title forces `nowrap` and clips the heading — that
  was audit #8. Use `allowWrap` only deliberately.
- **`<TextPanel>`** — legibility enforcement; no-op on surfaces that can carry
  text, beds children on cobalt over coral. **Wrap unconditionally.**
- **`<StylisedCTA>`** — signature button (p33), fills `canary | powder | coral`;
  the coral fill auto-adds a cobalt label plate. Magnetic hover + outline redraw,
  both skipped under reduced motion.
- **`<LoopField>`** — oversized looping background strokes (pp28–29).
  `contrast="high"` crosses colours, `"low"` is tonal. Both must appear on the
  finished site.
- **`<BrandImage>`** — the guide's image-tile treatment (logo watermark, title
  ellipse, doodle + coral dash overlays). Placeholder state is still crude
  (audit #13).
- **`<BrandArtView>`** renders any `ART[name]`; exports `colourVar()`.
  **`<MixedWeightLabel>`**, **`<SectionNumber>`** as described above.
- **`sectionMeta(id)` in `content/site.ts`** — always look sections up by id.
  Index-based lookups silently mislabelled sections and crashed `Booking` when
  the numbering changed (audit #9).

## 6. Hard rules

1. **Coral cannot carry text. Any size, any colour.** Measured: canary on coral
   **2.39:1**, cobalt **2.67:1**, white **2.99:1** — all fail even the 3:1
   large-text floor. Coral stays a full-strength field and graphic colour; copy
   over it goes on a cobalt panel via `<TextPanel>`. See `docs/contrast-audit.md`.
2. **Only permitted pairings** (pp24–27, encoded in `src/design/pairings.ts`).
   They are **directional** — powder bg + cobalt elements is legal, the reverse
   is not. The `official` register (p26) governs booking, legal and clinical
   surfaces; playful registers govern marketing. Don't blur them.
3. **No raw hex in components.** Token classes, CSS vars, or `colourVar()`.
4. **Never modify `src/assets/brand/`.** Those paths are geometrically derived
   from the brand book and pixel-validated. Do not hand-edit or regenerate.
5. **Never remove or suppress the dev-time guards** (`resolveElement`,
   `assertLegibleText`, the 64px logo warning). If one fires, the call site is
   wrong. The logo guard has already caught a real regression.
6. **Strict TS stays on**, including `exactOptionalPropertyTypes` — optional
   props on shared components need explicit `| undefined`. Zero `any`.
7. **Verify in a browser yourself**: screenshot desktop and mobile, check
   `scrollWidth === innerWidth`, check the console, check reduced motion.

## 7. Traps already hit — don't rediscover them

- `maskUnits="userSpaceOnUse"` needs explicit `x/y/width/height`: the default
  region resolves against the **viewport**, and this artwork sits at large
  viewBox coordinates, so without bounds the mask renders nothing.
- HTML `hidden` loses to a Tailwind `flex` utility; the mobile nav drives
  visibility from the class list and uses `inert` (spread with a cast — not in
  React 18 typings).
- `Journey`'s header owns its own flex row and the connector is positioned
  against the **track**, not the section. Don't absolutely position anything over
  the pinned track.
- `ART` uses `satisfies Record<string, BrandArt>` so keys stay literal — that is
  what makes `DoodleName` a real union. Don't widen it.
- React 18 needs lowercase `fetchpriority` on `<img>`.
- **Do not edit source files with PowerShell string replacement** — the
  round-trip mangles em-dashes into mojibake. Use an editor that writes UTF-8.
