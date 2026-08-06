# Tiny Tusk — full-site redesign patch

A design patch against the existing repo. Same brand tokens, same content
files, same extracted artwork — no new palette, no new typeface, no invented
copy, no new dependencies. Everything below is expressed as an edit to files
that already exist.

Reference implementation: `Tiny Tusk.dc.html` in this project (single page,
all twelve sections, live interactions), with the brand runtime in
`brand/brand-paths.js` (generated from `src/assets/brand/paths.ts`) and
`brand/brand-art.js`.

---

## 1. File map

| Repo path | Change |
|---|---|
| `src/sections/Hero.desktop.tsx` | Replace layout (see §3.00) |
| `src/sections/HomePaths.tsx` | Replace: tabs → three permanent cards (§3.01) |
| `src/sections/Journey.desktop.tsx` | **Keep as-is.** The pinned horizontal scrub + drawn connector is the signature; only panel chrome changes (§3.02) |
| `src/sections/Services.tsx` | Replace grid weights (§3.03) |
| `src/sections/InsideClinic.tsx` | Replace tile treatment (§3.04) |
| `src/sections/RiaJourney.tsx` | Replace: photo + three moments, canary surface (§3.05) |
| `src/sections/Team.tsx` | Replace: portrait + official credentials panel + lasso (§3.06) |
| `src/sections/BrushTimer.tsx` | Replace: ring timer + quadrant prompt (§3.07) |
| `src/sections/ParentsCorner.tsx` | Replace: 3+2 card grid (§3.08) |
| `src/sections/Testimonials.tsx` | Replace: honest awaiting state + prompts (§3.09) |
| `src/sections/Faq.tsx` | Replace: two-column, `<details>` accordion (§3.10) |
| `src/sections/Booking.tsx` | Replace: one official-register form (§3.11) |
| `src/sections/Footer.tsx` | Replace: roundel centrepiece + marquee + map (§3.12) |
| `src/sections/Nav.tsx` | **Keep as-is.** Top-left 64px mark, seven links, booking pill, coral progress rail |
| `src/index.css` | Append §5 |
| `src/content/*` | Untouched — every string on the page is already in these files |

---

## 2. System

**Surfaces, in scroll order.** Only pairings from `src/design/pairings.ts`, and
never more than two backgrounds adjacent:

`powder` hero → `paper` → `cobalt` → `paper` → `paper` → `canary` → `paper` →
`cobalt` → `paper` → `powder` → `paper` → `cobalt` → `cobalt` footer

- Coral is never a text surface. Where a coral field carries copy (Journey
  "Care", Services "Cavity care", the family-corner tile title) the copy sits on
  a cobalt panel — i.e. `<TextPanel>` stays mandatory.
- White at 33% (`--tt-monochrome-opacity`) for every watermark and every
  monochrome shape on a solid brand colour.
- `cobalt-80` for supporting rows on cobalt (booking step pills, footer
  marquee band); `cobalt-60`/`cobalt-20` for quiet meta text and tint panels.

**Wayfinding.** Every section opens with the same three-part row: display-face
numeral in coral (canary on cobalt), a 44×2 rule, then the label in 0.78rem /
600 / 0.22em uppercase at 75% opacity. Numbers stay continuous `00–11`, read
through `useSectionMeta`, never by index.

**Type.** Unchanged scale (`display / h1 / h2 / body` from
`tailwind.config.ts`). Headings are Encode Sans Condensed 600; the mixed-weight
convention (DemiBold lead word + Regular remainder) is used on every card title,
CTA label and image title — always through `<MixedWeightLabel>`.

**Shape.** 32px container radius (24–26px for small cards), 999px for every
button, input and pill. One elevation: `0 18px 50px rgba(24,82,142,0.08)` on
white cards, `0 12px 34px rgba(24,82,142,0.06)` on FAQ rows.

**Motion.** Still two systems only: the single-stroke draw-in (every doodle,
mark, logo and the journey connector prime to their own length and resolve on
first intersection) and the LoopField parallax. Reduced motion rests everything
complete; no content depends on motion.

---

## 3. Section by section

**00 Welcome — powder.** Full-height, asymmetric two-column: display headline
(`Welcome to / Tiny Tusk` + sans tail) flush left, tagline roundel and coral
dashes in the right rail. High-contrast LoopField behind. Canary stylised CTA
("Schedule Appointment") plus an underlined text link. Hero top padding is
measured off the nav's real height at runtime so a wrapped nav can never cover
the wayfinding row.

**01 Start Here — paper.** The three `HOME_PATHS` as three permanent cards
(powder / canary / white) rather than tabs — a parent should not have to click
to discover the other two routes. Each card: doodle, title, body, stylised CTA
(canary / powder / canary), CTA pinned to the card foot with `margin-top:auto`.

**02 The Journey — cobalt.** Behaviour unchanged: section pinned for
`track.scrollWidth - innerWidth + 0.25 × innerHeight`, vertical scroll scrubs
the track sideways, the 70px canary connector draws in step. Panel chrome now
matches the rest of the site: 32px radius, display numeral, glyph, title, body;
the logo hinge is an outlined cobalt panel with the 120px canary mark and its
caption.

**03 Services — paper.** Six-column editorial grid, rows resolving 4+2 /
2+2(tall) / 2+4: `First visit` hero (powder, span 4) · `Cleanings` (canary) ·
`Cavity care` (coral, span 2 × 2 rows, cobalt copy panel, `cavities-stages`
image with watermark) · `Fluoride` (white) · `Retainers` (powder) ·
`Emergency care` (cobalt + canary, span 4, doodle beside copy).

**04 Inside the Clinic — paper.** The p32 image-tile treatment on all three
concepts (7 / 5 / 12 columns): 33% white logo watermark, a doodle in the
opposite corner, and the title on a stylised CTA ellipse anchored bottom-left —
never across a face. Coral tile title takes a cobalt label plate. The
"concept visuals, not photographs" disclosure sits beside the heading in a
`cobalt-20` panel.

**05 Ria's Journey — canary.** Low-contrast white LoopField at 50%. Left:
heading + `rias-journey-hero` (32px radius, watermark). Right: the three
moments as white cards — eyebrow in `cobalt-80`, display title, body, glyph.

**06 Dr. Nupur — paper.** Left column: 4:5 portrait slot (awaiting the approved
shoot) with coral dashes breaking the corner, and the official-register cobalt
panel beneath carrying `Dr. Nupur`, the client-verified `BDS · MDS, Pediatric
Dentistry`, and the philosophy body. Right column: the philosophy quote as the
h2 with the p31 lasso around the single word *understood*, then the three
expectation cards (powder / canary / cobalt) and a canary CTA.

**07 2-Min Brush — cobalt.** Working timer: 280px ring (track `cobalt-80`,
progress canary, 16px, round cap), display-face clock, and a quadrant prompt
that names the corner every 30 seconds. Canary primary + outlined reset.
`brushing-demo` image with watermark beside it; `wordmark-mark-tag` lockup under
the ring. Duration is a prop (default 120s).

**08 Parents' Corner — paper.** Five articles on a six-column grid (3+3 / 2+2+2).
Image head with watermark + doodle, then category in `cobalt-80` 0.72rem
uppercase, mixed-weight display title, summary. Card surfaces alternate
white / powder / canary / white / powder — the `fill` field in `content/parents.ts`
drives it.

**09 Parent Voices — powder.** No invented reviews. Two oversized 33% white
watermarks bleed off both edges; left column states plainly that quotes are
being collected with written consent, right column is the three
`TESTIMONIAL_PROMPTS` as white cards. Keep `AWAITING_REAL_TESTIMONIALS`.

**10 Questions — paper.** Two columns: left heading + the p35 arc treatment in
coral with the drawn arrow mark; right the eight FAQs as `<details>` rows with a
coral `+` that rotates to `×` when open. First row open by default.

**11 Book a Visit — cobalt (official register).** Left: heading, plain-spoken
promise, and the four `BOOKING_STEPS` as `cobalt-80` pills with canary numerals.
Right: one white card with all seven fields (999px radius, powder 2px border,
paper fill), canary stylised CTA. Submit renders an honest notice — nothing is
sent while the booking service is unconnected; **never** a success state.

**Footer — cobalt.** `cobalt-80` marquee band of the tagline and full name in
canary, then three columns: roundel + 72px canary mark + full name + promise;
the client-verified address, the "phone, email and hours to follow" line, and
the canary appointment button; the keyless Google embed plus a "Get directions"
outline link. Quick links at 44px minimum row height, then the copyright and a
line noting photography clearance is pending.

---

## 4. Brand-book coverage on the redesigned page

Mark and wordmark (pp5–13) · tagline unit as roundel, arc and repeating ring
(pp14–15, p35) · both faces and the mixed-weight convention (pp17–20) · all four
primaries and all four pairing registers (pp23–27) · white-at-33% monochrome
(p27) · LoopField high and low (pp28–29) · four core doodles (p30) · all four
supporting marks (p31) · lasso-on-one-word, image-tile watermark, doodle and
coral-dash overlays (p32) · all three stylised CTA fills (p33) · the four
journey glyphs and the "Do not use these!" article (pp3, 34).

Roundel geometry follows p14 exactly: the tagline set around the full circle
(`M 30 150 A 120 120 0 1 1 270 150 A 120 120 0 1 1 30 150`, 15px / 0.14em / 600)
with the small smile arc closing it inside (`M 90 205 Q 150 250 210 205`, 6px,
round cap). Type auto-fits its arc so a longer tagline can never lose letters.

---

## 5. `src/index.css` — append

```css
@layer components {
  /* FAQ rows: the coral plus becomes a cross when the row opens. */
  summary { list-style: none; cursor: pointer; }
  summary::-webkit-details-marker { display: none; }
  details[open] [data-plus] { transform: rotate(45deg); }
}
```

The existing `tt-marquee` keyframes, `.tt-section`, focus ring, `::selection`
and the reduced-motion block already cover everything else this redesign needs.

---

## 6. Review notes

- Nav and Journey behaviour are deliberately untouched.
- No clinical claim, price, hour, statistic or testimonial was added. The
  address and Dr. Nupur's credentials are the client-verified strings already in
  `content/site.ts` and `content/team.ts`.
- Photography licensing is still unconfirmed (`README.md`), and the clinic
  imagery is still labelled as concept visuals on the page.
- Dr. Nupur's portrait remains a placeholder; the 4:5 production note in
  `content/team.ts` stays a code comment and is never rendered.
