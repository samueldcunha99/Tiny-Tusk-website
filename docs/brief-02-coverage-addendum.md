# ADDENDUM — USE THE ENTIRE BRAND BOOK

Queue this as a follow-up message in Claude Code.

---

Additional requirement: **every page of the identity guide must be represented in the built
site.** Not just the pages I listed earlier. Nothing in the book is decoration — if it's in
there, it has a job on the site.

Before you finalise the plan, produce `docs/brand-coverage.md`: a table with one row per PDF
page (36 rows), listing what that page defines and the exact component or section where it is
used. Any row you cannot place, flag to me rather than silently dropping. At the end of the
build, re-verify the table against the real code.

Extract vectors from **every** page that contains artwork, not only pages 6/24/28–35.

## Page-by-page map (PDF page numbers; the printed folio differs)

**Cover & structure**
- **p1** — Tagline roundel + wordmark + tag on cobalt. This is the preloader's final frame and
  the footer's centrepiece.
- **p2** — Contents page: the `00 / 01 / 02 / 03 / 04` numbering system and section labels.
  Use this numbering on section headers and on the scroll-progress rail. It's the book's own
  wayfinding — carry it onto the site.
- **p3** — Foreword: **Detection · Treatment · Care · Smile!** The four-beat journey section.
- **p4, p16, p21, p22** — Section dividers: full-bleed colour field, section number + name set
  small. Reuse this exact device as the transition between major site sections.
- **p36** — Back cover: tagline roundel alone on cobalt. Use as the final footer frame.

**Logo system**
- **p5** — Primary mark.
- **p6** — Single-stroke construction → the preloader draw and every stroke animation.
- **p7** — Clear space (equal to the mark's own height) + minimum size **64px digital**.
  Enforce both inside the `<Logo>` component; add a dev-only warning if rendered under 64px.
- **p8** — Logo placement: top-left preferred, central axis for special cases.
- **p9** — Wordmark.
- **p10** — Three lockups: wordmark · wordmark+logo · wordmark+logo+tag. Build all three as
  variants of one component and switch between them responsively (full lockup on desktop
  footer, mark alone in the mobile nav).
- **p11, p12, p13** — Placement rules per lockup. p13: full lockup belongs centre or
  bottom-centre with generous negative space → footer.
- **p14** — Tagline unit: type arcing over the mark, closed by a smile arc below.
- **p15** — Four tagline-unit placement variants. Use all four somewhere: hero corner roundel,
  section-break stamp, footer centrepiece, and the booking success state.

**Typography**
- **p17** — Avenir Next Regular + Medium: body and headers.
- **p18, p19** — Avenir Next Condensed Regular + Medium: display. Two pages, so treat both
  weights as first-class — don't ship display in a single weight.
- **p20** — Display / H1 / H2 / Body scale with tracking and leading. Also note the mixed-weight
  convention shown throughout: **DemiBold first word + Regular second word** ("**Schedule**
  Appointment", "**Lorem** Ipsum", "**Ria's** Journey", "**Cavities** stages"). Make this a
  reusable `<MixedWeightLabel>` and use it on every CTA and card title.

**Colour**
- **p23** — Primary palette, 4 colours.
- **p24** — High contrast: cobalt+canary · coral+canary · powder+cobalt · canary+cobalt.
- **p25** — Low contrast pairings.
- **p26** — Official: cobalt+white · white+powder · cobalt+cobalt-tint · white+cobalt. Use this
  restrained set for the legal/privacy pages, the booking form, and clinical information —
  "official documentation, avoid playfulness."
- **p27** — Monochrome: **white at 33% opacity** on any solid brand colour. Use for watermark
  marks and background doodles on coloured sections.

**Backgrounds**
- **p28** — Oversized canary loop strokes on powder blue.
- **p29** — Low **and** high contrast variants, and note the distinction: *low contrast is
  tonal* — a lighter coral loop on coral, a lighter canary loop on canary — while *high
  contrast crosses colours* (canary on powder, white on cobalt). Build the background
  component with a `contrast="low" | "high"` prop and use both across the site.

**Illustrations**
- **p30** — Four core doodles: toothbrush with scribbled bristles, toothpaste tube, heart,
  grinning face. All four must appear.
- **p31** — Four supporting marks: lasso ellipse, three motion dashes, curved arrow, zigzag.
  All four must appear.
- **p32** — Usage rules, and these are specific:
  - a doodle blown up to become an **oversized outline background** behind a title
  - the **lasso ellipse circling one word inside a headline** ("the right", "2 minute") —
    build this as an `<Circled>` inline wrapper, it's a signature move
  - the **curved arrow as a small trailing marker** under a subtitle
  - doodles as **canary/coral overlays on photographs**
  - the **logo watermark top-left on every image tile**
- **p33** — Stylised CTA ellipse in all three fills (canary, powder, coral), each with the
  offset hand-drawn cobalt outline. Use all three.
- **p34** — CTA usage in context: `Ria's Journey`, `Do not use these!`, `Cavities stages`,
  and the `Welcome to Tiny Tusk` + `Schedule Appointment` layout. The "Do not use these!"
  tile is a piece of content — a short guide to products to avoid. Build it as a real section.
- **p35** — Type on a path, and it's broader than the tagline: arbitrary copy set on an arc
  (the welcome sentence curving over a smiley + heart), the tagline roundel, and a **repeating
  ring of text** ("why? when? & how?" orbiting a title). Build one `<TextOnPath>` component
  that handles arc, full roundel, and repeating-ring modes, and use each mode at least once.

## Rules

- Every doodle and supporting mark from p30–p31 appears at least once, animated with a
  stroke-draw, never as a static import.
- Both background contrast modes from p29 appear.
- All three CTA fills from p33 appear.
- All three `<TextOnPath>` modes from p35 appear.
- The official palette from p26 governs form and legal surfaces; the playful palettes govern
  marketing surfaces. Don't blur the two.
- If using a brand element would hurt usability or accessibility, tell me and propose an
  alternative — don't just include it to tick the box, and don't silently omit it.
