import { Doodle } from '@/components/Doodle'
import { StylisedCTA } from '@/components/StylisedCTA'
import { Roundel } from '@/components/Roundel'

/**
 * 404 treatment: the tagline roundel + smile arc and centered text/CTA.
 *
 * The loop is sized to sit wholly inside the section at every width: it runs
 * off the sides like a book page's crop, never off the bottom, where the cobalt
 * footer starts and a clipped stroke would read as a straight cut.
 */
export function NotFound() {
  return (
    <section
      className="relative isolate grid min-h-[80svh] place-items-center overflow-hidden bg-powder px-6 py-24"
      data-surface="powder"
      aria-labelledby="notfound-heading"
    >
      <Doodle
        name="loopStroke"
        tone="white"
        drawOnScroll
        duration={1.8}
        className="pointer-events-none absolute -left-[30%] top-[6%] w-[110%] max-w-none md:-left-[12%] md:w-[52%] lg:w-[40%]"
      />
      <div className="relative z-10 flex max-w-xl flex-col items-center text-center">
        <div className="relative grid aspect-square w-[clamp(10rem,16vw,14rem)] place-items-center">
          <Roundel tone="cobalt" className="absolute inset-0 h-full w-full" />
        </div>
        <h1
          id="notfound-heading"
          className="mt-8 text-balance font-display text-[clamp(2.4rem,10vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.025em] text-cobalt"
        >
          This page wandered off
        </h1>
        <p className="mt-5 max-w-[40ch] font-sans text-[1.05rem] leading-[1.6] text-cobalt md:text-[1.15rem]">
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
