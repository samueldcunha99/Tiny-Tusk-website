import { StylisedCTA } from '@/components/StylisedCTA'
import { LoopField } from '@/components/LoopField'
import { Doodle } from '@/components/Doodle'
import { Roundel } from '@/components/Roundel'

/**
 * Fuller 404 treatment: the tagline roundel + smile arc, lost elephant with
 * coral dashes, and centered text/CTA.
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
        <div className="relative grid aspect-square w-[clamp(10rem,16vw,14rem)] place-items-center">
          <Roundel tone="cobalt" className="absolute inset-0 h-full w-full" />
          <Doodle
            name="markDashes"
            tone="coral"
            className="pointer-events-none absolute right-[21%] top-[24%] w-10 z-20"
          />
        </div>
        <h1 id="notfound-heading" className="mt-8 font-display text-h1 text-cobalt">
          This page wandered off
        </h1>
        <p className="mt-4 max-w-measure font-sans text-body text-cobalt">
          The link you followed does not lead anywhere on our site. Nothing is wrong with your
          appointment. This is just a page that no longer exists.
        </p>
        <div className="mt-9">
          <StylisedCTA lead="Back" rest="to the clinic" href="/" fill="canary" />
        </div>
      </div>
    </section>
  )
}
