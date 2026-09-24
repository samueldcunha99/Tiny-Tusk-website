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

**Type** — `--font-sans` Montserrat (stands in for Avenir Next), `--font-display`
Encode Sans Condensed (for Avenir Next Condensed). Self-hosted woff2, no CDN.
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

## 8. Home page composition (2026-09-23 redesign) — read before touching a section

Mobile first. `docs/audit-2026-07-29.md` items 40–69 record the audit and what
changed; tag `checkpoint/pre-mobile-redesign-2026-09-23` is the state before it.

- **A powder ground with colour plates**, in `sections/Home.tsx`: powder
  (welcome) → canary (Dr. Nupur) → cobalt (how a visit goes) → powder (inside
  the clinic) → canary (services) → cobalt (parent voices) → powder (Parents'
  Corner, questions) → coral (brushing game) → cobalt (booking, footer). No
  paper grounds: the user asked for more colour. Apart from Parents' Corner →
  questions and booking → footer, no two chapters of one colour touch:
  welcome and Dr. Nupur on one powder field read as "one long page box", and
  three canary chapters in a row read as "too much yellow". Each change of
  colour is `<SmileEdge from="outgoing colour" />`.
- **No artwork crosses a section's top or bottom edge.** Loops and scaled-up
  doodles may run off the left and right (the guide's page-edge crop), never off
  the top or bottom: the next section starts there, and a clipped stroke reads
  as a straight cut (item 56).
- **No boxes.** Content sits on the ground. Coral still carries no text: the
  game's title is on a canary ellipse and its clock inside a cobalt disc.
- **Motion is two systems.** *Draw*: strokes, doodles, glyphs, CTA outlines
  (they draw in on arrival), and the journey's scroll-scrubbed canary thread.
  *Reveal*: `useReveal(ref)` in a section, plus `data-reveal` on a heading or
  `data-reveal="fast"` on a paragraph — SplitText line masks, played once at
  `REVEAL_START`, then reverted. Anything that must not be split carries
  `data-split-keep` (`<Circled>` already does). The hero builds its entrance
  paused and plays it through `onIntroDone`, so it waits for the preloader.
- **One responsive component per section.** The mobile twins are gone;
  `asPage` switches a home-page introduction to the full standalone page.
- **Standalone pages are composed the same way** (item 70). `/parents-corner`,
  `/inside-clinic` and `/laughing-gas` are colour chapters joined by
  `<SmileEdge>`, with no boxes, and each ends on `<BookingClose>`
  (`sections/BookingClose.tsx`, the home page's cobalt close, which takes a
  page's own heading and line) running on into the cobalt footer. Parents'
  Corner keeps the client's order -- photograph, question, summary -- with the
  photographs plain; a post with no photograph shows its drawing on a disc of
  its `fill`.
- **Client decisions to preserve:** the 44px phone nav mark
  (`allowBelowMinimum`), no roundel in the phone hero, "Welcome to / Tiny Tusk",
  the label "How a visit goes", the p3 `LogoStory` row, the ten-treatment swipe
  strip (`HOME_SLUGS` in `Services.tsx`), the floating WhatsApp disc, and the
  footer's tagline marquee.
- **Four FAQ answers are parked** in `FAQS_AWAITING_REVIEW` (agent-written
  clinical advice, one of it wrong). Never render them without Dr. Nupur's
  approval.
- **Parents' Corner on the home page** is a wave of speech bubbles
  (`ParentsStrip` in `ParentsCorner.tsx`): each question on the p33 stylised
  title ellipse (`<EllipseTitle>`, shared with the brushing game), canary and
  cobalt in turn, with a coral illustration stuck on its shoulder. The user
  rejected the coloured tiles ("dont like these boxes") and then the bare list
  that replaced them (items 63, 66). The article photographs stay plain
  everywhere -- the client asked for nothing to be laid over them -- and two
  are clinical close-ups, which is why the home strip uses illustrations.
- **Treatments sit on colour discs** (item 64): cobalt, powder and coral in a
  cycle that never puts two equal discs side by side, each drawing in its
  disc's p24 partner (canary on cobalt and coral, cobalt on powder).
  `.tt-on-coral` and `.tt-on-powder` re-tint accents that would vanish into
  their disc, and `.tt-disc-icon` thickens the line. On the home strip the
  discs wipe in like the timer's ring. `/services` uses the same discs.
- **Dr. Nupur's portrait slot** (item 67): a round badge ringed with her name.
  `DR_NUPUR.portrait.src` stays null until an approved photograph arrives, and
  the badge shows the heart on a cobalt disc meanwhile. Set it and the
  photograph takes the disc; nothing else needs to change.
- **The footer opens with the tagline marquee** (item 65), restored at the
  user's request: two identical halves so the loop never jumps, 90s a lap.
- **The roundel is the guide's cover version** (item 69). `roundelPaths.ts` is
  generated by `tools/extract-roundel.py` from page 1 of the brand book, which
  ships in the repo. The earlier geometry came from the client's lollipop
  board, whose mark is ~40% larger inside the ring; the user rejected it as the
  wrong logo. Never re-extract from the board. On desktop the hero carries the
  full cover lockup (roundel, `<Wordmark>`, tag) in cobalt, top-aligned with
  the headline; phones still show none (client decision).
- **The intro is the guide's cover** (item 68): white roundel, canary wordmark
  and tag on cobalt. The mark shows first, the ring sweeps in from 9 o'clock
  (`.tt-sweep` in index.css holds geometry measured from `roundelPaths.ts`;
  re-measure it if the roundel is ever re-extracted), the name rises, and the
  cover lifts away with a smile-shaped trailing edge before `markIntroDone`.
- **Fonts are the client's chosen free stand-ins, unchanged:** Montserrat for
  Avenir Next and Encode Sans Condensed for Avenir Next Condensed, self-hosted
  (see the FONTS block in index.css). Do not swap them.
- **One content column, modest spacing** (item 63). Every home section starts
  on the same line: a 1320px column with 40px gutters -- `max-w-[1320px]`
  inside a padded section, or `max-w-[1400px]` where the padding sits inside
  the container (the swipe strips, which bleed to the screen edge on phones).
  The user found the old section padding empty; keep new sections to the
  current values. Booking's bottom padding is small because it runs straight on
  into the cobalt footer.
- **`<Doodle tap>`** redraws a drawing when tapped (decorative, skipped under
  reduced motion). **`<LogoStory active>`** lights the stage being read; the
  journey drives it from scroll, and on phones a slim sticky rail of the same
  glyphs sits under the nav while the beats are on screen.
- **Route heads live in `content/routes.ts`.** `Site.tsx` reads them, and
  `scripts/prerender.mjs` writes `dist/<route>/index.html` for every route with
  its own title, description and social tags (the body is still
  client-rendered). A new route goes in that table and in `PAGES` in
  `Site.tsx`. `public/og-image.png` is the brand cover at 1200x630.

Traps from this pass:

- Decorative art is `absolute`. Content that follows it must be positioned
  (`relative`), or the art paints over it — that is how a loop hid two service
  labels.
- A backgrounded or occluded browser window throttles `requestAnimationFrame`,
  so reveals freeze half-played and text looks clipped. Bring the tab to the
  front before judging motion. A full-page screenshot resizes the viewport and
  replays any reveal that has not yet played.
- Cross-document View Transitions do not work while the full site is
  client-rendered: the incoming frame is blank and Chrome logs an uncaught
  promise rejection. Do not re-add them before the full site prerenders.
- `.tt-section` overlaps the next section by 1px on purpose; it removes
  sub-pixel seams between same-colour grounds at 2x density.
- `TextOnPath` `ring` fits one pass of its phrase to the circle with
  `textLength`. Phrases of about 35–55 characters read best.
- GSAP position offsets use `+=` (`"top top+=140"`) or a plain pixel value
  (`"top 140px"`). `"top top+140"` is not an error -- it silently reads as
  `"top top"`.
- Reveal masks pad the bottom only. Padding and negative margins on both edges
  collapse between stacked lines, so split text grows taller than unsplit text
  and every scroll trigger below it drifts when the reveal reverts.
- On this Windows machine the Bash tool can collapse backslashes even inside
  quoted heredocs. Write helper scripts with the file tool, not a heredoc.
