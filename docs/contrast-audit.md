# Contrast audit

Every colour pairing used on the site, with its measured WCAG 2.1 contrast
ratio. Computed from the authoritative hexes in `tailwind.config.ts` using the
WCAG relative-luminance formula (`tools/contrast.py`).

Thresholds: **4.5:1** for body text, **3:1** for large text (≥24px regular, or
≥18.66px bold), **3:1** for UI component boundaries.

## Measured ratios

| Surface | Element | Ratio | Body (4.5) | Large (3.0) | Register | Used for |
|---|---|---:|---|---|---|---|
| cobalt `#18528E` | canary `#FFE497` | **6.37** | pass | pass | high (p24) | headings + body on cobalt |
| cobalt | white | **7.97** | pass | pass | official (p26) | body on cobalt |
| cobalt | cobalt-60 `#7498B5` | 2.62 | fail | fail | official (p26) | **decorative only** |
| powder `#C1CBE7` | cobalt | **4.92** | pass | pass | high (p24) | hero, journey panels |
| powder | white | 1.62 | fail | fail | low (p25) | **decorative only** |
| canary `#FFE497` | cobalt | **6.37** | pass | pass | high (p24) | journey panel, service card |
| canary | white | 1.25 | fail | fail | low (p25) | **decorative only** |
| paper `#F7F7F7` | cobalt | **7.44** | pass | pass | official (p26) | page body copy |
| paper | powder | 1.51 | fail | fail | official (p26) | **card borders only** |
| paper | canary | 1.17 | fail | fail | low (p25) | **loop backgrounds only** |
| coral `#F16C59` | canary | 2.39 | fail | fail | high (p24) | **never for text** |
| coral | white | 2.99 | fail | fail | — | **never for text** |
| coral | cobalt | 2.67 | fail | fail | — | **never for text** |

## Finding: coral cannot carry text in any brand colour

This is the one place the brand system and WCAG AA genuinely conflict, and it is
worth stating plainly because the brief's own mitigation does not resolve it.

The brief anticipated that canary-on-coral is weak (it measures 2.39:1) and
restricted it to display type, with the instruction that *"body text on coral
must be cobalt or white."* But measured:

- white on coral is **2.99:1** — short of even the 3:1 large-text floor, by 0.01
- cobalt on coral is **2.67:1**
- canary on coral is **2.39:1**

So there is no legible foreground for coral at any size. Restricting the pairing
to display type is not sufficient; the surface itself cannot host type.

### What we did instead

Coral is kept at full strength as a colour field and as a graphic colour — it is
not tinted, darkened or dropped, so the brand is unchanged. Where copy needs to
appear over coral, the copy sits on a cobalt panel inside the coral field
(`<TextPanel>`; `src/components/TextPanel.tsx`). Canary on that cobalt panel
reads 6.37:1.

This is enforced, not merely documented:

- `NON_TEXT_SURFACES` in `src/design/pairings.ts` lists coral
- `assertLegibleText()` throws in development if text is placed on it
- `<TextPanel>` is a no-op on surfaces that *can* carry text, so call sites wrap
  unconditionally and the rule cannot be forgotten

Applied at: the Journey "Care" panel and the Services "Cavity care" card, and
the coral variant of `<StylisedCTA>` (which gains a cobalt label plate).

**Alternative if you would rather keep type directly on coral:** add a darker
coral tint used *only* as a text bed, exactly as the guide already sanctions a
lighter cobalt tint for the official pairing (p26). Roughly `#B4432F` or darker
would clear 4.5:1 with white. That is a brand change, so it is your call — the
current approach needs no new colour.

## Other accessibility decisions

- **Focus rings** are 3px cobalt at 3px offset, flipping to canary on cobalt and
  coral surfaces where cobalt would disappear (`src/index.css`).
- **Minimum logo size** of 64px (guide p7) is enforced by a dev warning in
  `<Logo>`. It caught a real regression during the build: the condensed nav was
  rendering the mark at 40px. The nav now tightens its padding instead.
- **Doodles rest complete.** Hover redraws them rather than revealing them, so a
  card that is never hovered — or any touch device, where hover does not exist —
  still shows finished artwork.
- **Reduced motion** resolves every stroke-draw to its finished state and
  forces all animated elements visible, so no content depends on motion.

## Still to verify

Sections after Services are typed content only in this pass; their pairings will
be added here as they are built. A full Lighthouse run happens at the end of the
build, not now.
