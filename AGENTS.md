# Tiny Tusk — developer briefing

Marketing site for **Tiny Tusk Pediatric Dental Clinic** with a prepared,
not-yet-deployed appointment-request backend.

Front end: Vite + React 18 + TypeScript (strict) + Tailwind +
GSAP/ScrollTrigger. Backend: Supabase Postgres + Edge Functions, Cloudflare
Turnstile, and Resend. The website remains safe in disconnected mode until
clinic-owned service credentials are configured.

```sh
npm install
npm run dev          # http://localhost:5173
npm run typecheck    # tsc -b --noEmit  — must stay clean
npm run build
npm run backend:start   # requires Docker
npm run backend:status
npm run backend:stop
```

`@` resolves to `src/`. Brand source of truth is `TINY_TUSK_Visual_Identity_Guide.pdf`
(36pp, repo root); page refs below (p7, p24…) point into it.

**➡ `docs/audit-2026-07-29.md` is the standing to-do list.** It is numbered 1–28
and every item below is cross-referenced to it. Read it before picking up work;
update it as you go. Other docs: `docs/brief-01-main.md` and
`docs/brief-02-coverage-addendum.md` (client requirements, verbatim),
`docs/contrast-audit.md`, `docs/brand-coverage.md`, and `docs/backend.md`.

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

- **Photography licensing is unconfirmed for the original brand-book images.**
  The older assets in `public/images/` were extracted from the client's brand
  book; web clearance has not been obtained. The three `clinic-*.png/.webp`
  assets are newly generated concept images, not brand-book photography.
  `InsideClinic.tsx` must retain its visible "concept imagery / not photographs
  of the completed clinic" disclosure until approved real photography replaces
  them. (audit #3)

- **Contact information is not verified.** `MOCK_CONTACT` in
  `src/content/site.ts` exists only for development layout work. `Footer.tsx`
  may render it only behind `import.meta.env.DEV` and the visible "Development
  sample — not clinic information" label. Production builds must contain none
  of those sample values. The nav must link to `/book`, never the mock phone.

General rule: never invent clinical claims, credentials, prices, hours,
addresses or statistics. Where a real fact is needed, leave a `TODO` **in the
content file as a code comment** — never as a rendered string. Two raw `TODO:`
strings were reaching visitors and have been removed (audit #2).

Voice: warm, plain-spoken, parent-to-parent. Never babyish, never clinical.
`content/journey.ts` and `content/services.ts` are the reference.

## 2. What is now implemented (browser-verified)

Integrity: #1 testimonials de-fabricated · #2 leaked `TODO:` strings removed ·
#3 licensing note confirmed in README.

Bugs: #4 `fetchPriority` → `fetchpriority` (console now clean) · #5 duplicate
`<h1>` (Hero keeps it, Team is `h2`) · #6 Dr. Nupur's quote rendered twice ·
#7 `<Circled>` lasso cutting through words · #8 Parents' Corner titles clipping
and third card overflowing · #9 section numbering skipping `05` · #10 unknown
URLs silently rendering the homepage.

Later work added the footer structure, all three `TextOnPath` modes, the
2-Minute Brush timer, the real booking form states, the Supabase backend
foundation, and the branded Inside the Clinic concept section. The preloader
now measures the nav-logo landing position. `BrandImage` has a designed
placeholder instead of the bare "N". Standalone marketing routes use
`CoralPageAccent` to bring the guide's coral colour spread into the site as a
graphic field with a white-at-33% brand loop; Booking deliberately stays in the
official, quieter register.

The home-page section sequence is now continuous `00–11`; every section uses
`sectionMeta(id)`. React Router was removed because this site only needs a small
native pathname switch in `App.tsx`; all current routes and the 404 remain
working.

Latest verified state: one home-page `h1`, zero rendered `TODO`, no invented
testimonial names, no console errors, no horizontal overflow at 1440×900 or
390×844, all three generated clinic images load at 1536×1024, and `/404`
resolves to `<NotFound>`.

Coral full-field usage is deliberate and limited to playful marketing:
`RiaJourney` is the homepage's full coral chapter, and `/games` uses coral
across its intro and brushing-game sections. Both use low-contrast white loop
fields and place every word on cobalt through `<TextPanel>`. The Games route
also forces a paper nav surface at the top so navigation never sits on coral.
On the homepage, `ParentsCorner` owns an 8px cobalt top border because it
directly follows the canary Brush Timer; keep that divider unless one of those
two section surfaces changes.

`HomePaths` is the interactive `01 Start Here` module immediately after Hero.
It combines the homepage density pass: a magazine-style split layout, restrained
loop artwork, three accessible `aria-pressed` choices, and links into existing
approved routes. Its copy lives in `content/homePaths.ts`; do not turn it into
clinical advice or add unverified facts. Homepage instances of shared routed
sections use tighter `py-20 md:py-24` spacing, while standalone pages retain
their larger `py-24 md:py-32` chapter spacing.

The density/interaction pass also added:

- directional navbar visibility (down hides, up reveals), with the mobile menu
  and near-top state always forcing it visible; the independent coral rail is
  the real page-progress indicator;
- three additional local-only games in `GamesArcade` (memory pairs, brushing
  sequence, sticker board) after the existing timer;
- selectable clinic concept rooms and a selectable Ria storybook whose progress
  bar follows the active moment;
- Parents' Corner category filters and a five-card asymmetric grid;
- FAQ search/category filters and a useful sticky sidebar;
- a two-column Booking layout with a navigable completed-step guide; and
- a compact footer with verified internal route links.

These controls are intentionally client-side mock interactions. Do not connect
them to analytics, storage, user accounts, or external services until the
clinic requests that work.

## 3. What remains

**Do not treat the site as finished.** Use `docs/audit-2026-07-29.md` as the
standing list; several original entries are now resolved and annotated there.

- **Content/client blockers:** real testimonials with consent, licensing for
  brand-book photography, verified clinic contact facts, and approval or
  replacement of generated clinic concepts.
- **Visual tuning:** image-title CTA placement on existing people photography,
  and reveal-threshold tuning across later sections.
- **Missing scope:** full 404 treatment, deeper Phase 2 content and legal pages,
  the Phase 3 continuous stroke/route-transition system, sitemap, Lighthouse
  pass, and restraint edit.
- **README:** backend/setup guidance now exists, but the full token-system,
  Avenir swap, and image-replacement documentation still needs completing.

## 3a. Appointment backend

Read `docs/backend.md` before changing or deploying the booking pipeline.

- `supabase/migrations/202607300001_create_booking_backend.sql` creates the
  minimal appointment table, admin allowlist, RLS policies, 90-day expiry, and
  daily `pg_cron` cleanup.
- `supabase/functions/submit-booking/` is the only public submission path. It
  enforces an exact origin allowlist, 12 KB body limit, strict server validation,
  honeypot, Turnstile verification, and UUID idempotency.
- The browser never receives a service-role key and has no direct insert
  permission. Only authenticated users listed in `admin_users` may read/update
  requests.
- Resend notifications contain the reference code only — never names, phone
  numbers, email addresses, child details, or request bodies.
- The live stack is **not connected yet**. Missing Vite configuration must
  render the honest unavailable state and must never produce fake success.
- Keep server secrets in `supabase secrets`; never prefix secrets with `VITE_`
  or commit them. `.env.example` documents the public values.

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
  ellipse, doodle + coral dash overlays). Its placeholder is now a designed
  brand field. Inside the Clinic uses it for the three `clinic-*` concept
  images; do not remove their section-level disclosure.
- **`<TextOnPath>`** — supports `arc | roundel | ring`. Footer uses `roundel`;
  keep at least one real use of every required mode before declaring coverage
  complete.
- **`<CoralPageAccent>`** — standalone marketing-page treatment: one thin,
  consistent coral rule at the page edge. The earlier floating desktop corner
  fields were visually disconnected from the layouts and have been removed.
  Coral is also used as the active-nav underline. Do not add either treatment
  to text surfaces.
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
   `document.documentElement.scrollWidth <=
   document.documentElement.clientWidth`, check the console, and check reduced
   motion. (`innerWidth` includes the scrollbar in Chromium and is not the
   reliable overflow comparison.)
8. **Generated clinic interiors are concepts, not factual photography.** Keep
   the disclosure visible and alt text prefixed with "Concept image" until real,
   approved photography is supplied.
9. **Development contact mock must not reach production.** After footer/contact
   changes, build and search `dist/` for `Maple Row`, `7946`,
   `hello@tinytusk.example`, and `Development sample`; all must be absent.

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
- There is no React Router dependency. `App.tsx` switches on the normalized
  native pathname; nav links use normal anchors. Do not add a routing library
  back for the current static routes without a concrete need. Every navbar
  destination has a standalone pathname:
  `/services`, `/inside-clinic`, `/dr-nupur`, `/games`,
  `/parents-corner`, `/faq`, and `/book`.
- `/games` is the public **Games for Kids** destination and currently contains
  the 2-Minute Brushing Game plus memory, sequence, and sticker-board
  activities. `/brush-timer` renders the same page only as a `noindex,
  nofollow` compatibility route; do not put it back in the navbar.
- Shared routed sections accept `asPage`. Home renders them without it so their
  headings remain `h2`; standalone routes pass `asPage` so each page owns
  exactly one `h1`. `RouteMeta` updates the title, description, Open Graph,
  Twitter, and robots metadata for every route.
- `public/images/clinic-reception`, `clinic-treatment-room`, and
  `clinic-family-corner` each have PNG and WebP variants at 1536×1024. They were
  generated specifically for this project with the official palette and are
  consumed through `content/clinic.ts`.
- The Supabase CLI is installed as a dev dependency, but the local backend
  requires Docker. Typecheck/build success does not prove the migration or Edge
  Function has run against a live project; record live end-to-end verification
  only after credentials are connected.
- **Do not edit source files with PowerShell string replacement** — the
  round-trip mangles em-dashes into mojibake. Use an editor that writes UTF-8.
