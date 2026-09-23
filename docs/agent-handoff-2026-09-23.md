# Tiny Tusk — handoff, 2026-09-23

For the next person or agent picking this up. Supersedes the 2026-09-15 handoff,
which is preserved inside the checkpoint tag below.

## What was asked

> "update the code base audit the website i want to redesign it primary focus
> mobile version client wants a very beautiful website use transitions
> animations and all all elements are from brand identity pdf i want a proper
> flow and not many boxes"

Earlier client feedback still stands: "a good flow and continuous framework",
"not too many boxes", colours "in sync with the brand identity", and the
palette as "a continuous flow" rather than one that "jumps around" (audit 37).

## State

- Branch `codex/brand-flow-redesign`, HEAD still `e7d72cc`. **All work is
  uncommitted.** Nothing is deployed.
- `checkpoint/pre-mobile-redesign-2026-09-23` is a snapshot of the working tree
  as it stood before this redesign, untracked files included. Diff against it
  to see exactly what this pass changed.
- `checkpoint/pre-design-flow-2026-09-15` is the older checkpoint, at `e7d72cc`.
- **The client has not yet seen or approved this redesign.**

## Read first

1. `CLAUDE.md` §8 (mirrored in `AGENTS.md` and `GEMINI.md`): how the home page
   is composed, the motion rules, the client decisions to preserve, and the
   traps from this pass.
2. `docs/audit-2026-07-29.md`, top entry: audit items 40–62, what was fixed and
   what is open, and the validation that was actually run.

## Open items, in order of importance

1. Client review of the new composition.
2. Dr. Nupur's sign-off on the four parked FAQ answers (`FAQS_AWAITING_REVIEW`,
   audit 41). One of them gives a toothpaste amount that conflicts with standard
   pediatric guidance.
3. The standing content blockers: brand-book photography licensing (audit 3),
   written consent for testimonials, and email and opening hours.
4. Full-site server rendering of page bodies (audit 52): faster first paint and
   the prerequisite for page-to-page transitions. Route heads are already baked
   (audit 61); once the production domain is known, make `og:image` absolute and
   check the host serves `/route` from `dist/route/index.html`.
5. Smaller items: the unused `lenis` dependency (53), the `GamesArcade` panels
   (54), and `docs/brand-coverage.md` (55).

## Running and checking

```sh
npm run dev -- --host 127.0.0.1          # http://127.0.0.1:5173
npm run typecheck
npm run build && npm run preview -- --host 127.0.0.1 --port 5174
```

After a build, search `dist/` for `Maple Row`, `7946`, `hello@tinytusk.example`
and `Development sample`; all must be absent.

When checking motion in an automated browser, keep the tab in the foreground.
A backgrounded or occluded window throttles animation frames, and reveals then
look frozen half-way. That is an artefact of the test browser, not a site bug.
