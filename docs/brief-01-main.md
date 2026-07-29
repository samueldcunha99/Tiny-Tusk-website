# PROMPT FOR CLAUDE CODE (OPUS 5) — TINY TUSK WEBSITE

> Paste everything below the line into Claude Code, and attach
> `TINY_TUSK_Visual_Identity_Guide.pdf` to the same message.

---

You are a senior creative front-end developer + art director. Build me an
**awwwards-caliber, front-end-only marketing website** for **Tiny Tusk — Pediatric
Dental Clinic**. The brand's official Visual Identity Guide is attached as a PDF. It is
the single source of truth for every colour, type, logo and illustration decision. Do not
invent brand elements that contradict it.

Present a short written plan first and wait for my approval before writing code.

---

## 0. FIRST: mine the PDF, don't guess

The PDF is vector art. Extract the real assets instead of redrawing them by eye.

```bash
pip install pymupdf pillow
```

```python
import fitz
d = fitz.open("TINY_TUSK_Visual_Identity_Guide.pdf")
# page 6 = logo construction, 24 = colour interaction, 28-29 = stroke backgrounds,
# 30-31 = illustrations, 33-34 = stylised CTAs, 35 = type on a path
open("logo.svg","w",encoding="utf-8").write(d[5].get_svg_image())   # 0-indexed
```

Do this for pages **6, 9, 14, 24, 28, 29, 30, 31, 33, 34, 35**, then hand-clean the SVGs:
strip the guide's page chrome, normalise `viewBox`, keep paths as **strokes with
`stroke-linecap="round"`** so they can be animated with `stroke-dasharray`. Save them into
`src/assets/brand/`. Also render each page to PNG at 150dpi into a scratch folder so you
can visually reference layout and spacing while you build.

The logo is deliberately **one continuous stroke that loops into an elephant made from a
tooth**. Preserve that — it is the site's hero animation.

---

## 1. Brand system — hard constraints

### Colours (hex is authoritative)

| Token | Name | Hex |
|---|---|---|
| `--tt-cobalt` | Cobalt Blue | `#18528E` |
| `--tt-coral` | Coral Sunset | `#F16C59` |
| `--tt-canary` | Canary Yellow | `#FFE497` |
| `--tt-powder` | Powder Blue | `#C1CBE7` |
| `--tt-paper` | Guide neutral | `#F7F7F7` |
| `--tt-white` | White | `#FFFFFF` |

> Note: the guide lists Canary Yellow's RGB as `225,228,151`, which does not match its own
> hex `#FFE497` (= `255,228,151`). Use the hex. Flag this in the README as a brand-book
> typo to confirm with the client.

**Permitted pairings only** (guide pp. 19–22). Never swap background and element colours:

- *High contrast*: cobalt bg + canary elements · coral bg + canary elements · powder bg +
  cobalt elements · canary bg + cobalt elements
- *Official / low playfulness*: cobalt bg + white · white bg + powder · cobalt bg + a
  lighter cobalt tint · white bg + cobalt
- *Monochrome*: on any solid brand colour, supporting shapes are **white at 33% opacity**

**Accessibility override I want you to respect:** `#FFE497` on `#F16C59` is a
brand-sanctioned pairing but only ~2.2:1. Use it **only for display type ≥ 32px at 600+
weight**, never for body copy, labels, or anything under 24px. Body text on coral must be
cobalt or white. Document every pairing you use and its contrast ratio in
`docs/contrast-audit.md`.

### Typography

Brand fonts are **Avenir Next** (body/H1/H2) and **Avenir Next Condensed** (display
headlines). They are not web-licensed here, so:

- Ship with **Figtree** (variable) as the Avenir Next stand-in and **Barlow Semi
  Condensed** as the Avenir Next Condensed stand-in, both self-hosted as `woff2` in
  `public/fonts/` with `font-display: swap`. No Google Fonts CDN calls.
- Put the family names behind CSS variables (`--font-sans`, `--font-display`) and add a
  commented `@font-face` block so the client can drop in licensed Avenir Next files and
  swap fonts by changing two lines.

Scale from the guide (p. 17), converted to a fluid `clamp()` ramp with the guide's tracking
and leading ratios preserved:

| Role | Font | Size / Tracking / Leading (guide) |
|---|---|---|
| Display | Condensed Regular/DemiBold | 200 / -50 / 210 → `clamp(4rem, 13vw, 13rem)`, `letter-spacing: -0.025em`, `line-height: 1.05` |
| H1 | Sans Medium | 64 / -25 / 72 → `clamp(2.5rem, 5vw, 4rem)`, `-0.02em`, `1.125` |
| H2 | Sans Medium | 32 / -10 / 36 → `clamp(1.5rem, 2.5vw, 2rem)`, `-0.01em`, `1.125` |
| Body | Sans Regular | 24 / -10 / 28 → `clamp(1rem, 1.2vw, 1.25rem)`, `-0.01em`, `1.6` |

### Logo & lockup rules (guide pp. 3–12)

- Lockups: logo alone · wordmark alone · wordmark + logo · wordmark + logo + tag ·
  the circular **tagline unit** ("Gentle Care for Growing Smiles" set on a path arcing over
  the logo, closed by a smile arc below)
- Default placement is **top-left**; centre placement only when the mark is the primary
  element in the frame. The full tagline unit belongs centred, with generous negative space.
- Minimum digital size **64px**. Enforce clear space equal to the logo's own cap height on
  all sides — encode this as padding on the logo component, not as an ad-hoc margin.
- When the logo and wordmark appear on the same surface, use the **simplified** wordmark.

### Graphic assets

- **Backgrounds**: oversized looping canary strokes on powder blue (p. 24) — the same
  single-stroke logic scaled up. Available in low- and high-contrast variants.
- **Illustrations**: cobalt hand-drawn line doodles — toothbrush with scribbled bristles,
  toothpaste tube, heart, grinning face (p. 26).
- **Supporting marks**: lasso ellipse, three motion dashes, curved arrow, zigzag squiggle
  (p. 27) — for highlighting and filling space.
- **Stylised CTA**: a filled ellipse with a **slightly offset hand-drawn cobalt outline**
  that doesn't quite register with the fill, label in mixed weight
  (`**Schedule** Appointment` — DemiBold word + Regular word). This is the signature button.
  Canary, powder and coral fills all permitted.

Tone: *playful but medically trustworthy*. Clean geometric type + generous white space +
childlike doodles. Never crayon-scribble kitsch, never sterile corporate.

---

## 2. Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** with the brand tokens defined in `tailwind.config.ts` (no raw hex
  anywhere in components)
- **GSAP + ScrollTrigger** for scroll choreography, **Lenis** for smooth scroll
- **Zero backend.** Forms validate client-side and resolve to a delightful success state.
  Content lives in typed files under `src/content/` so it reads like a CMS.
- No UI kit, no Bootstrap, no template. Every component hand-built.

---

## 3. Pages & sections

Single-page site with deep-linked sections, plus routed sub-pages for `/team`, `/services`,
`/parents-corner` and `/book`.

1. **Preloader** — the logo's single stroke draws itself in canary on cobalt
   (`stroke-dasharray` + `stroke-dashoffset`), the tagline arc rotates into place, then the
   whole unit scales down into the top-left nav position. Max 1.8s, skippable, runs once
   per session (`sessionStorage`).
2. **Nav** — logo top-left per the guide, transparent over hero, condenses to a floating
   pill on scroll. Mobile: full-screen powder-blue overlay with staggered link reveal and a
   doodle-filled corner.
3. **Hero** — display-size *"Welcome to Tiny Tusk Pediatric Dental Clinic"* with per-line
   clip reveal, the guide's exact welcome copy as the sub-paragraph:
   > "Where little smiles are cared for with kindness, patience, and a whole lot of heart.
   > We believe every child deserves a dental experience that feels safe, gentle, and even a
   > little magical. From a baby's very first tooth to growing confident smiles, we are here
   > to walk beside your child through every tiny milestone."

   Stylised **Schedule Appointment** CTA. Background: slow-parallaxing canary loop strokes
   on powder blue. Coral motion-dash marks accent the headline. Slow-rotating tagline
   roundel anchored bottom-right.
4. **The Tiny Tusk Journey** — the guide's own four beats, **Detection → Treatment → Care →
   Smile!** (p. 1) built as a pinned horizontal-scroll sequence. Each panel takes one brand
   colour, one doodle illustration, one sentence of plain-language reassurance. The
   connecting line between panels is a continuous canary stroke that draws as you scroll —
   the logo's stroke logic scaled across the whole section. **This is the site's signature
   moment; give it the most craft.**
5. **Services** — asymmetric editorial grid: first visit, cleanings & polishing, fluoride &
   sealants, cavity care, retainers & alignment, emergency care. Card hover lifts the card,
   draws its doodle icon stroke-by-stroke, and swaps the fill to the card's brand colour.
6. **Ria's Journey** — scroll-told story of one child's first visit, from nervous to
   grinning, using the guide's `Ria's Journey` coral CTA title treatment. Sticky visual
   column, scrolling narrative column, mood indicator that shifts from powder blue to canary
   as the story resolves. This is the anxiety-reduction section for parents; write it warm
   and specific, not saccharine.
7. **Meet the team** — portrait cards with cobalt doodle accents, hover reveals a "favourite
   part of the job" note and a fun fact. Handwriting-style role labels using the condensed face.
8. **The 2-Minute Brush** — a genuinely interactive widget: tap to start a two-minute timer
   where the canary loop stroke draws around a cobalt tooth as time passes, a doodle face
   gets progressively happier, and a small confetti-of-squiggles fires at the end. Fully
   keyboard-operable, pausable, respects reduced motion.
9. **Parents' Corner** — article cards using the guide's own titles: *"Choosing the right
   toothpaste — avoiding harsh chemicals"*, *"Mythbusting the 2-minute rule & more…"*,
   *"A full guide to retainers — why? when? & how?"*, *"Cavities stages"*. Each card gets a
   stylised ellipse title in a rotating brand colour. Full article pages can be stubbed with
   real, sensible copy.
10. **Parent testimonials** — a slow marquee of quote cards on cobalt, white-at-33% doodles
    drifting behind them.
11. **FAQ** — accordion, cobalt on paper, the curved-arrow supporting mark rotating on open.
12. **Book a visit** — multi-step form (child's name & age → concern → preferred time →
    parent contact) with a progress rail drawn as the brand stroke. Client-side validation
    with kind, non-scolding error messages. Success state: the logo stroke draws and the
    smile arc completes.
13. **Footer** — full centred tagline unit, hours, address, phone, socials, a styled static
    map placeholder, and a marquee of *Gentle Care for Growing Smiles*.

---

## 4. Motion direction

Everything derives from **one continuous stroke**. That is the whole idea — commit to it.

- Section transitions: strokes draw in, never fade in
- Text: per-line clip reveals, `stagger: 0.08`, `power3.out`
- Buttons: magnetic hover, and the hand-drawn outline redraws itself on hover
- Custom cursor: a small cobalt dot that morphs into the smile arc over interactive
  elements — hidden on touch, never blocking clicks
- Doodles parallax at 0.2–0.5× scroll speed
- Easing vocabulary: `power3.out` for entrances, `power2.inOut` for transforms, one
  `elastic.out(1, 0.6)` reserved for the brush-timer completion only
- **Restraint rule**: no more than two animation systems visible at once. Awwwards juries
  reward choreography, not chaos.
- **`prefers-reduced-motion: reduce` must produce a fully static, complete, beautiful site.**
  No content may depend on motion to become visible.

---

## 5. Imagery

I have no licensed photography yet. So:

- Build every illustration as **inline SVG** derived from the guide's doodles — no raster
  dependencies, no external image hosts.
- Wherever real photography belongs (hero portrait, team, Ria's story, service cards),
  render a `<BrandImage>` component that shows a branded placeholder (brand-colour block +
  logo watermark + correct aspect ratio) and accepts a `src` prop.
- Document every needed shot in `docs/photography-brief.md`: slot name, aspect ratio,
  subject direction, and the guide's treatment note (logo top-left corner, stylised ellipse
  title overlaid). The site must look finished with placeholders and better with real photos.

---

## 6. Engineering quality bar

- TypeScript strict, zero `any`, zero console errors or warnings
- Semantic HTML, one `<h1>`, correct heading order, real landmarks
- WCAG 2.1 AA: visible focus rings in cobalt, full keyboard path through every interaction,
  `aria-live` on form validation, `alt` text on every meaningful SVG, `aria-hidden` on decoration
- Responsive at 360 / 768 / 1024 / 1440 / 1920. No horizontal overflow at any width. Touch
  targets ≥ 44px.
- Lighthouse ≥ 95 performance / 100 accessibility / 100 best-practices / ≥ 95 SEO on desktop
- Lazy-load below-fold sections, `content-visibility: auto` on long sections, kill ScrollTriggers
  on unmount, no layout thrash — animate `transform` and `opacity` only
- Open Graph + Twitter meta, `LocalBusiness` / `Dentist` JSON-LD schema, favicon set generated
  from the logo mark
- README covering: setup, the token system, how to swap in licensed Avenir Next, how to
  replace placeholder images, and where each brand rule is enforced in code

---

## 7. Working method

1. Extract assets from the PDF and show me the cleaned logo + doodle SVGs first.
2. Post a short plan: file tree, section order, motion beats. **Wait for my approval.**
3. Build tokens and the design system layer before any section.
4. Build sections in order, running the dev server and screenshotting each at desktop and
   mobile as you go. Verify in the browser yourself — don't ask me to check.
5. Finish with the contrast audit, the photography brief, a reduced-motion pass, and a
   Lighthouse run, and report the actual numbers.

Do not scaffold placeholder sections and call it done. Every section listed above ships
finished, with real copy written in the brand's voice: warm, plain-spoken, parent-to-parent,
never babyish and never clinical.
