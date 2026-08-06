# Opening Soon — playful redesign patch

Two files, both against the existing Tiny Tusk repo. No new dependencies, no
new brand tokens, no new artwork.

## 1. Replace

    src/sections/OpeningSoon.tsx  ←  patch/src/sections/OpeningSoon.tsx

## 2. Append

    src/index.css  ←  the two snippets in patch/src/index.css.append.css
    (a `tt-pulse` keyframe + class, and adding `.tt-pulse` to the
    reduced-motion neutraliser)

Nothing else changes. `content/site.ts` is untouched — the address, map query,
`OPENING_DATE` gate and `OPENING_SOON` switch all still drive the page.

## What changed on the page

- **Surface moves from cobalt to powder**, with the guide's high-contrast loop
  field (canary on powder, pp. 28–29) at 55%. Cobalt type on powder is 4.9:1.
- **Coral enters as a supporting element**, never as text and never carrying
  text: the lasso around "soon", the rule beside the body copy, the pulsing
  dot in the status pill, two doodles, and the `✳` separators.
- **The cobalt panel is now only the address card**, tilted −2.2°, straightening
  on hover. Map border is canary at 3px. On desktop the card is pulled up
  168px so the entire map sits above the fold.
- **The body copy sits on a paper panel** with the coral rule, and a ribbon of
  coral / canary / cobalt-60 runs above the strapline band — so all four p19
  primaries are on the page.
- **A canary-on-cobalt strapline marquee** ("Gentle Care for Growing Smiles",
  from `CLINIC.tagline`) runs across the foot of the page, reusing the existing
  `.tt-marquee-track`.
- **The WhatsApp button is gone** from this screen. `WhatsAppButton` itself is
  untouched and still rendered elsewhere.
- **Doodles react to the pointer** (per-element depth, `gsap.quickTo`) and
  squash-and-stretch on tap, along with the logo mark. Both are inside the
  existing `gsap.context` and both are skipped under `prefers-reduced-motion`.

## Notes for review

- The doodles are wrapped in a `span.tt-floating-doodle[data-depth]`; GSAP
  animates the span so the Tailwind `rotate-*` tilt on the `Doodle` itself is
  never overwritten by the spring.
- Motion systems: still the single-stroke draw-on and the LoopField parallax,
  plus the pointer field. If CLAUDE.md §4's two-system rule is meant strictly,
  the pointer field is the thing to cut — deleting the first `gsap.context`
  block leaves a complete static page.
- No content was invented. Both body paragraphs, the address and the landmark
  are verbatim from the previous screen and `content/site.ts`.
