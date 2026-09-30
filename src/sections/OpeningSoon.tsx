import { useEffect, useRef } from 'react'
import { Circled } from '@/components/Circled'
import { Doodle } from '@/components/Doodle'
import { Logo } from '@/components/Logo'
import { MapEmbed } from '@/components/MapEmbed'
import { RouteMeta } from '@/components/RouteMeta'
import { SmileIntoFooter } from '@/components/SmileEdge'
import { StylisedCTA } from '@/components/StylisedCTA'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import {
  CLINIC,
  CLINIC_ADDRESS,
  CLINIC_PHONE,
  MAP_DIRECTIONS_HREF,
  OPENING_COPY,
  OPENING_DATE,
} from '@/content/site'
import { gsap, usePrefersReducedMotion } from '@/lib/motion'

/**
 * The pre-opening holding screen, shown in place of the whole site while
 * `OPENING_SOON` is true (see `content/site.ts`).
 *
 * PLAYFUL REGISTER. A powder surface carrying high-contrast canary loops
 * (pp. 28-29) framed gracefully around the content rather than cutting
 * through the mark or text. Cobalt type on powder (4.9:1), coral used as a
 * supporting accent, and the cobalt panel reserved for the address.
 */
export function OpeningSoon() {
  const mainRef = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    document.documentElement.classList.remove('tt-intro')
    if (reduced) return
    const root = mainRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const doodles = gsap.utils.toArray<HTMLElement>('.tt-floating-doodle')

      // Each doodle drifts toward the pointer by its own depth, so the page
      // feels touched rather than animated. quickTo keeps it to one tween per
      // element per axis instead of one per pointermove event.
      const movers = doodles.map((doodle) => {
        const depth = Number(doodle.dataset.depth ?? 20)
        return {
          depth,
          x: gsap.quickTo(doodle, 'x', { duration: 0.9, ease: 'power3.out' }),
          y: gsap.quickTo(doodle, 'y', { duration: 0.9, ease: 'power3.out' }),
        }
      })

      const onMove = (e: PointerEvent) => {
        const nx = (e.clientX / window.innerWidth - 0.5) * 2
        const ny = (e.clientY / window.innerHeight - 0.5) * 2
        movers.forEach((m) => {
          m.x(nx * m.depth)
          m.y(ny * m.depth)
        })
      }
      window.addEventListener('pointermove', onMove, { passive: true })

      // Tap a doodle or the mark and it springs: every squash pairs with a
      // stretch, the same read as the mark's own arrival.
      const onDown = (e: PointerEvent) => {
        const hit = (e.target as HTMLElement | null)?.closest<HTMLElement>(
          '.tt-floating-doodle, .tt-springy',
        )
        if (!hit) return
        gsap
          .timeline({ overwrite: 'auto' })
          .to(hit, { scaleX: 1.18, scaleY: 0.86, rotation: -9, duration: 0.12 })
          .to(hit, { scaleX: 0.94, scaleY: 1.1, rotation: 7, duration: 0.16 })
          .to(hit, { scaleX: 1, scaleY: 1, rotation: 0, duration: 0.34, ease: 'elastic.out(1, 0.5)' })
      }
      document.addEventListener('pointerdown', onDown)

      return () => {
        window.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerdown', onDown)
      }
    }, mainRef)

    return () => ctx.revert()
  }, [reduced])


  return (
    <>
      <RouteMeta
        title={`${CLINIC.fullName} | Opening Soon in Kharghar, Navi Mumbai`}
        description={`${CLINIC.fullName} is under construction in ${CLINIC_ADDRESS.locality}. Find our address in Kharghar, Navi Mumbai and get directions ahead of opening.`}
      />
      <main
        ref={mainRef}
        id="main"
        data-surface="powder"
        className="relative flex min-h-svh flex-col overflow-hidden bg-powder"
      >
        {/* The brand loop ribbons (pp. 28-29): positioned with intention so their
            sweeping curves enter from the screen edges to frame the content gracefully
            without ever being sliced off at the top border or obscuring the logo or text. */}
        {/* Upper-right loop (desktop & tablet) */}
        <Doodle
          name="loopStroke"
          tone="canary"
          drawOnScroll
          duration={2}
          className="pointer-events-none absolute -right-[10%] top-[2%] hidden w-[46%] max-w-none opacity-65 md:block lg:-right-[6%] lg:top-[1%]"
        />
        {/* Upper-right loop (mobile) */}
        <Doodle
          name="loopStroke"
          tone="canary"
          drawOnScroll
          duration={2}
          className="pointer-events-none absolute -right-[28%] top-[5%] block w-[72%] max-w-none opacity-55 md:hidden"
        />
        {/* Lower-left loop (mobile & desktop) */}
        <Doodle
          name="loopStroke"
          tone="canary"
          drawOnScroll
          duration={2}
          className="pointer-events-none absolute -left-[24%] top-[56%] block w-[78%] max-w-none opacity-55 md:w-[46%] md:top-[50%] lg:-left-[18%]"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1240px] flex-1 px-6 pb-6 pt-10 md:px-10 md:pt-14 lg:px-12">
          {/* ---- the lockup, and the state of things ---- */}
          <div className="flex flex-wrap items-start justify-center md:justify-between gap-8">
            <div className="relative flex w-full md:w-auto items-end justify-center md:justify-start gap-7">
              <span className="tt-bounce-in tt-springy inline-block cursor-pointer">
                <div className="md:hidden">
                  <Logo
                    variant="wordmark-mark-tag"
                    tone="cobalt"
                    size={88}
                    drawable
                    title={`${CLINIC.fullName} logo`}
                  />
                </div>
                <div className="hidden md:block">
                  <Logo
                    variant="wordmark-mark-tag"
                    tone="cobalt"
                    size={116}
                    drawable
                    title={`${CLINIC.fullName} logo`}
                  />
                </div>
              </span>
            </div>

            <p className="mt-1.5 inline-flex items-center gap-2.5 rounded-full bg-cobalt px-5 py-3 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-canary">
              <span aria-hidden="true" className="tt-pulse block h-2.5 w-2.5 rounded-full bg-coral" />
              Under construction
            </p>
          </div>

          {/* ---- the message, and where to find us (comfortable spacing) ---- */}
          <div className="mt-8 sm:mt-10 md:mt-14 grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">
            <div className="tt-hop flex flex-col items-center text-center lg:items-start lg:text-left" style={{ animationDelay: '0.5s' }}>
              <h1 className="font-display text-[clamp(1.55rem,5vw,3.75rem)] font-bold leading-[1.2] text-cobalt">
                <span className="block">Our doors are</span>
                <span className="mt-1 inline-flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                  <span>opening</span>
                  <Circled tone="coral">{OPENING_COPY.headlineLasso}</Circled>
                  <span className="tt-floating-doodle inline-block w-[32px] sm:w-[42px] md:w-[48px] shrink-0 align-middle" data-depth="26">
                    <Doodle name="doodleHeart" tone="coral" drawOnScroll className="w-full rotate-[-12deg]" />
                  </span>
                </span>
              </h1>

              {/* Rendered only when the clinic has actually confirmed a date. */}
              {OPENING_DATE ? (
                <p className="mt-4 font-display text-h2 text-cobalt">{OPENING_DATE}</p>
              ) : null}

              {/* Paper panel: lifts the copy clear of the loop strokes and
                  brings the palette's fourth colour onto the page. */}
              <div className="mt-6 flex max-w-[60ch] gap-5 rounded-3xl bg-paper p-6 shadow-[0_14px_30px_-22px_rgba(24,82,142,0.45)] text-left">
                <span aria-hidden="true" className="block w-1 shrink-0 rounded-full bg-coral" />
                <div className="flex flex-col gap-3.5">
                  {OPENING_COPY.paragraphs.map((p, i) => (
                    <p key={i} className="font-sans text-[1.0625rem] leading-relaxed text-cobalt">
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <StylisedCTA lead="Get" rest="directions" href={MAP_DIRECTIONS_HREF} fill="canary" />
              </div>

              {/* Full-strength cobalt, not a tint: cobalt on powder is 4.92:1,
                  and every opacity step falls under AA (/90 is only 4.13:1).
                  See docs/contrast-audit.md. */}
              <p className="mt-5 flex items-center justify-center lg:justify-start gap-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-cobalt">
                <Doodle name="markArrow" tone="coral" className="w-[30px] shrink-0 rotate-[-8deg]" />
                <span>Nudge the doodles and they wobble</span>
              </p>
            </div>

            {/* The address panel keeps the cobalt surface, so the practical
                part of the page still reads as the official one. */}
            <div className="relative">
              <span className="tt-floating-doodle pointer-events-none absolute -right-2 -top-8 sm:-right-4 sm:-top-[52px] z-[3] block w-[80px] sm:w-[104px]" data-depth="34">
                <Doodle name="doodleToothbrush" tone="cobalt" drawOnScroll className="w-full rotate-[18deg]" />
              </span>
              <div
                className="tt-hop relative z-[2] rounded-[2rem] bg-cobalt p-6 shadow-[0_24px_48px_-24px_rgba(24,82,142,0.55)] text-center lg:text-left"
                style={{ animationDelay: '0.8s' }}
              >
                <h2 className="font-display text-h2 text-canary">Finding {CLINIC.name}</h2>

                <address className="mt-4 font-sans text-[0.9375rem] not-italic leading-relaxed text-white">
                  <p className="font-semibold">{CLINIC_ADDRESS.unit}</p>
                  <p className="text-white/90">
                    {CLINIC_ADDRESS.sector}, {CLINIC_ADDRESS.locality}
                  </p>
                  <p className="text-white/90">
                    {CLINIC_ADDRESS.city}, {CLINIC_ADDRESS.region} {CLINIC_ADDRESS.postcode}
                  </p>
                  <p className="mt-3 flex gap-2 text-xs sm:text-sm text-white/75 justify-center lg:justify-start">
                    <span aria-hidden="true" className="text-coral">
                      ✳
                    </span>
                    <span>{CLINIC_ADDRESS.landmark}</span>
                  </p>
                </address>

                {/* The gate hides every other route, so this panel is the only
                    place a parent can reach the clinic before opening day. */}
                <div className="mt-4 flex flex-col items-center gap-3 lg:items-start">
                  <a
                    href={CLINIC_PHONE.href}
                    className="inline-flex min-h-11 items-center font-display text-[1.15rem] text-canary underline underline-offset-4"
                  >
                    {CLINIC_PHONE.display}
                  </a>
                  <WhatsAppButton variant="row" />
                </div>

                <div className="mt-4 overflow-hidden rounded-[1.25rem] border-[3px] border-canary">
                  <MapEmbed className="block h-[210px] w-full border-0" />
                </div>
              </div>
              <span className="tt-floating-doodle pointer-events-none absolute -bottom-[52px] -left-[46px] z-[1] block w-[126px]" data-depth="20">
                <Doodle name="markZigzag" tone="canary" drawOnScroll className="w-full rotate-[26deg]" />
              </span>
            </div>
          </div>

          <div className="mt-9 flex items-end justify-between gap-6">
            <span className="tt-floating-doodle block w-[92px]" data-depth="30">
                <Doodle name="doodleFace" tone="cobalt" drawOnScroll className="w-full rotate-[-9deg]" />
              </span>
            <span className="tt-floating-doodle block w-[76px]" data-depth="24">
                <Doodle name="doodleToothpaste" tone="coral" drawOnScroll className="w-full rotate-[12deg]" />
              </span>
          </div>
        </div>

        {/* The signature brand smile transition into the cobalt footer */}
        <SmileIntoFooter from="powder" />

        {/* Continuous cobalt footer with tagline marquee ribbon and copyright */}
        <footer className="relative z-10 bg-cobalt text-white" data-surface="cobalt">
          {/* A ribbon of the primary palette, decorative only */}
          <div aria-hidden="true" className="flex h-2.5 sm:h-3">
            <span className="flex-[2] bg-coral" />
            <span className="flex-1 bg-canary" />
            <span className="flex-[3] bg-cobalt-60" />
            <span className="flex-1 bg-coral" />
          </div>

          <div aria-hidden="true" className="overflow-hidden border-b border-white/15 bg-cobalt-80 py-3.5">
            <div className="tt-marquee-track flex w-max [animation-duration:90s]">
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  aria-hidden={copy === 1 ? true : undefined}
                  className="flex flex-none items-center gap-10 pr-10 font-display text-[1.15rem] uppercase tracking-[0.14em] text-canary [white-space:nowrap] md:text-[1.35rem]"
                >
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="flex items-center gap-10">
                      <span>{CLINIC.tagline}</span>
                      <span aria-hidden="true" className="text-coral">
                        ✳
                      </span>
                      <span>{CLINIC.fullName}</span>
                      <span aria-hidden="true" className="text-coral">
                        ✳
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <p className="mx-auto w-full max-w-[1240px] px-6 py-6 text-center font-sans text-xs text-white/80 md:px-10 lg:px-12">
            © {new Date().getFullYear()} {CLINIC.fullName}. All rights reserved.
          </p>
        </footer>
      </main>
    </>
  )
}
