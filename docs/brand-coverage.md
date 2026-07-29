# Brand coverage — every page of the identity guide

One row per PDF page (36). "Where it lives" names the component or section that
carries it. Rows marked **FLAG** need a decision from you; see the bottom.

Status legend: `planned` = mapped, not yet built · `built` = shipped and verified.
The right-hand column is re-verified against the real code at the end of the build.

## 01 · Cover & structure

| # | Page defines | Where it lives | Status |
|---|---|---|---|
| 1 | Cover: tagline roundel + wordmark + tag on paper | `<Preloader>` final frame; `<Footer>` centrepiece | planned |
| 2 | Contents: `00–04` numbering + section labels | `<SectionNumber>` on every section header; `<ScrollRail>` progress numerals | planned |
| 3 | Foreword: **Detection · Treatment · Care · Smile!** | `<JourneySection>` — the pinned four-beat horizontal scroll | planned |
| 4 | Section divider: `01 The Logo` | `<SectionDivider>` device (full-bleed colour field + number + name) | planned |
| 16 | Section divider: `02 Typography` | same `<SectionDivider>`, canary variant | planned |
| 21 | Section divider: `03 Colours` | same `<SectionDivider>`, coral variant | planned |
| 22 | Section divider: `04 More Assets` | same `<SectionDivider>`, powder variant | planned |
| 36 | Back cover: tagline roundel alone | `<Footer>` final frame | planned |

## 02 · Logo system

| # | Page defines | Where it lives | Status |
|---|---|---|---|
| 5 | Primary mark | `<Logo variant="mark">` | planned |
| 6 | Single-stroke construction | `logo-stroke.svg` centreline → `<Preloader>` draw + every stroke animation | **extracted, 99.72% IoU** |
| 7 | Clear space (= mark's own height) + min **64px** digital | `<Logo>` padding token + dev-only `console.warn` under 64px | planned |
| 8 | Placement: top-left preferred, central axis for special cases | `<Nav>` (top-left), `<Preloader>`/`<Footer>` (centred) | planned |
| 9 | Wordmark | `<Logo variant="wordmark">` — **FLAG 4** | planned |
| 10 | Three lockups: wordmark · +logo · +tag | `<Logo variant>` union, switched responsively | planned |
| 11 | Placement rules — wordmark | `<Logo>` placement prop, documented in Storybook-style page | planned |
| 12 | Placement rules — wordmark + logo | as above | planned |
| 13 | Placement — full lockup centre / bottom-centre | `<Footer>` full lockup with generous negative space | planned |
| 14 | Tagline unit: type on arc + smile arc closing the circle | `<TaglineUnit>` built on `<TextOnPath mode="roundel">` | **extracted, 97.82% IoU** |
| 15 | Four tagline-unit placements | hero corner roundel · section-break stamp · footer centrepiece · booking success | planned |

## 03 · Typography

| # | Page defines | Where it lives | Status |
|---|---|---|---|
| 17 | Avenir Next Regular + Medium | `--font-sans` (Figtree stand-in), body + H1/H2 | planned |
| 18 | Avenir Next Condensed Regular + Medium | `--font-display` (Barlow Semi Condensed stand-in) | planned |
| 19 | Condensed specimen (second weight page) | both display weights treated as first-class — **FLAG 5** | planned |
| 20 | Display/H1/H2/Body scale + mixed-weight convention | `type.css` fluid `clamp()` ramp + `<MixedWeightLabel>` | planned |

## 04 · Colour

| # | Page defines | Where it lives | Status |
|---|---|---|---|
| 23 | Primary palette, 4 colours | `tailwind.config.ts` brand tokens — **FLAG 1** | planned |
| 24 | High contrast pairings | `<Surface tone="…" contrast="high">` allowed-pair map | planned |
| 25 | Low contrast pairings (tonal) | same map, `contrast="low"` | planned |
| 26 | Official pairings | governs `<BookingForm>`, legal/privacy pages, clinical info | planned |
| 27 | Monochrome: white @ 33% on solid brand colour | `<DoodleField>` watermark doodles on coloured sections | planned |

## 05 · Backgrounds, illustrations, CTAs

| # | Page defines | Where it lives | Status |
|---|---|---|---|
| 28 | Oversized canary loop strokes on powder | `<LoopField>` — parallax hero background | **extracted (live strokes, 100%)** |
| 29 | Low **and** high contrast variants | `<LoopField contrast="low"\|"high">`, both used | **extracted, 100%** |
| 30 | Four core doodles: toothbrush, toothpaste, heart, face | `<Doodle name>` — all four, stroke-drawn | **extracted; brush + tube need hand-finish (FLAG 2)** |
| 31 | Four supporting marks: lasso, dashes, arrow, zigzag | `<Mark name>` — all four | **extracted; arrow needs hand-finish (FLAG 2)** |
| 32 | Usage: oversized outline bg · lasso circling a word · trailing arrow · overlays on photos · logo watermark on image tiles | `<Circled>`, `<BrandImage>` watermark, `<DoodleField>` | planned |
| 33 | Stylised CTA ellipse, 3 fills + offset outline | `<StylisedCTA fill="canary"\|"powder"\|"coral">` | **extracted, 99.89% IoU** |
| 34 | CTA usage in context + "Do not use these!" | `<RiasJourney>`, `<CavityStages>`, `<AvoidList>` (a real section) | planned |
| 35 | Type on a path: arc · roundel · repeating ring | `<TextOnPath mode="arc"\|"roundel"\|"ring">`, each used ≥1× | planned |

---

## Flags — decisions I need from you

**FLAG 1 · Canary Yellow RGB/HEX mismatch (p23).** The book prints
`RGB 225,228,151` beside `HEX #FFE497` (= `255,228,151`). The red channel
disagrees. I am using the **hex**, as instructed. Coral's CMYK on the same page
(`1%, 7%, 65%, 0%`) also cannot produce `#F16C59` — it describes a yellow. Both
look like production typos in the book; worth confirming with whoever authored it.

**FLAG 2 · Three doodles self-intersect and cannot be auto-converted to a single
stroke.** The toothbrush's scribbled bristles, the toothpaste tube's squiggle, and
the curved arrow are drawn as strokes that cross *themselves*. Their outlines
therefore can't be decomposed into a centreline the way every other asset could.
I'll hand-author centrelines for those three and hold them to the same ≥97% IoU
bar as the rest — no accuracy is lost, it's just manual. No decision needed unless
you'd rather ship them as static fills (I don't recommend it; the brief wants every
doodle stroke-drawn).

**FLAG 3 · Artwork colours drift from the stated palette.** The guide's own
illustrations use `#1A5694` rather than cobalt `#18528E`; the CTA fills use
`#FFE598` (not `#FFE497`) and `#BFCEFF` (not `#C1CBE7`). I'm snapping all artwork
to the four authoritative hexes so the site is internally consistent. Flagging
because it means the site will not be a pixel-match to the book's illustration pages.

**FLAG 4 · The wordmark may be live Avenir Next text, not vector art.** If so it
cannot ship as-is (no web licence) and must be re-set in the stand-in face, which
will not be letter-identical. Confirming during the build; if it is outlined vector,
this flag disappears.

**FLAG 5 · p19 has mismatched body copy.** Its paragraph reads "We can use strokes
… as backgrounds" — the p28 Backgrounds text — while the page actually shows a
Condensed type specimen. Treating it as the second Condensed weight page per your
addendum. Also noting p23 and p24 both print folio "19", and the `04 More Assets`
divider (p22) sits *before* the colour pages it should follow.

**FLAG 6 · Accessibility override, already applied.** `#FFE497` on `#F16C59` is
brand-sanctioned but measures ~2.2:1. Per the brief it is restricted to display type
≥32px at 600+ weight; body copy on coral is cobalt or white. Every pairing used and
its measured ratio goes in `docs/contrast-audit.md`.
