import { Logo } from '@/components/Logo'
import { StylisedCTA } from '@/components/StylisedCTA'
import { LoopField } from '@/components/LoopField'

/**
 * Minimal 404. Previously any unknown URL silently rendered the homepage,
 * which hides broken links from both visitors and crawlers.
 *
 * A fuller treatment (the elephant, lost, with the tagline arc) is item 21 in
 * docs/audit-2026-07-29.md.
 */
export function NotFound() {
  return (
    <section
      className="relative isolate grid min-h-[80svh] place-items-center overflow-hidden bg-powder px-6 py-24"
      data-surface="powder"
      aria-labelledby="notfound-heading"
    >
      <LoopField surface="powder" contrast="low" depth={0.2} count={1} />
      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        <Logo size={120} tone="cobalt" title="Tiny Tusk" />
        <h1 id="notfound-heading" className="mt-8 font-display text-h1 text-cobalt">
          This page wandered off
        </h1>
        <p className="mt-4 max-w-measure font-sans text-body text-cobalt">
          The link you followed does not lead anywhere on our site. Nothing is wrong with your
          appointment — this is just a page that no longer exists.
        </p>
        <div className="mt-9">
          <StylisedCTA lead="Back" rest="to the clinic" href="/" fill="canary" />
        </div>
      </div>
    </section>
  )
}
