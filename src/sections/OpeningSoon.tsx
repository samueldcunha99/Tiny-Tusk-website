import { useEffect, useRef } from 'react'
import { Circled } from '@/components/Circled'
import { Doodle } from '@/components/Doodle'
import { Logo } from '@/components/Logo'
import { LoopField } from '@/components/LoopField'
import { RouteMeta } from '@/components/RouteMeta'
import { StylisedCTA } from '@/components/StylisedCTA'
import {
  CLINIC,
  CLINIC_ADDRESS,
  MAP_DIRECTIONS_HREF,
  MAP_EMBED_SRC,
  OPENING_DATE,
} from '@/content/site'
import { gsap, usePrefersReducedMotion } from '@/lib/motion'

/**
 * The pre-opening holding screen, shown in place of the whole site while
 * `OPENING_SOON` is true (see `content/site.ts`).
 *
 * PLAYFUL REGISTER. The earlier version of this screen sat in the guide's
 * "official" cobalt-on-cobalt pairing (p26). This one moves to the playful end
 * of the same page: a powder surface carrying high-contrast canary loops
 * (pp. 28-29), cobalt type on powder (4.9:1), coral used as a supporting
 * element only, and the cobalt panel reserved for the address so the map still
 * reads as the practical part of the page.
 *
 * Colour rules kept intact:
 *  - coral never carries text and is never a text colour; it appears as the
 *    lasso around "soon", the accent rule beside the body copy, the pulsing
 *    dot in the status pill and two doodles.
 *  - canary carries no small text; it is the loop field, the map border and
 *    the display-sized strapline on cobalt.
 *  - the strapline marquee is canary on cobalt (display size, 6.4:1).
 *
 * Motion. The two permitted systems are unchanged: the single-stroke draw-on
 * shared by the logo, doodles and lasso, and the LoopField parallax. Added on
 * top is one pointer-follow field for the doodles plus a squash-and-stretch
 * spring on tap — both are the same cartoon vocabulary as `tt-bounce-in`, both
 * are skipped entirely under reduced motion, and neither reveals content.
 *
 * Deliberately does NOT mount the preloader: it animates its mark onto the
 * nav logo's measured position, and there is no nav here to land on.
 */
export function OpeningSoon() {
  const mainRef = useRef<HTMLElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
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

  // The address card rests tilted and straightens when a parent reaches for it.
  const straighten = (on: boolean) => () => {
    const card = cardRef.current
    if (!card || reduced) return
    card.style.transform = on ? 'rotate(0deg) translateY(-6px)' : 'rotate(-2.2deg)'
  }

  return (
    <>
      <RouteMeta
        title={`${CLINIC.fullName} — Opening Soon in Kharghar, Navi Mumbai`}
        description={`${CLINIC.fullName} is under construction in ${CLINIC.tagline.toLowerCase()}. Find our address in Kharghar, Navi Mumbai and get directions ahead of opening.`}
      />
      <main
        ref={mainRef}
        id="main"
        data-surface="powder"
        className="relative flex min-h-svh flex-col overflow-hidden bg-powder"
      >
        {/* The guide's high-contrast register: canary loops on powder (p28).
            Held at 55% so cobalt body copy stays well clear of the strokes. */}
        <LoopField
          surface="powder"
          contrast="high"
          count={3}
          depth={0.35}
          className="opacity-[0.55]"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1240px] flex-1 px-6 pb-5 pt-8 md:px-10 lg:px-12">
          {/* ---- the lockup, and the state of things ---- */}
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="flex items-end gap-7">
              <span className="tt-bounce-in tt-springy inline-block cursor-pointer">
                <Logo
                  variant="wordmark-mark-tag"
                  tone="cobalt"
                  size={124}
                  drawable
                  title={`${CLINIC.fullName} logo`}
                />
              </span>
              <span className="tt-floating-doodle mb-7 block w-[74px]" data-depth="26">
                <Doodle name="doodleHeart" tone="coral" drawOnScroll className="w-full rotate-[-14deg]" />
              </span>
            </div>

            <p className="mt-1.5 inline-flex items-center gap-2.5 rounded-full bg-cobalt px-5 py-3 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-canary">
              <span aria-hidden="true" className="tt-pulse block h-2.5 w-2.5 rounded-full bg-coral" />
              Under construction
            </p>
          </div>

          {/* ---- the message, and where to find us ---- */}
          <div className="mt-5 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">
            <div className="tt-hop" style={{ animationDelay: '0.5s' }}>
              {/* Deliberately still. Splitting this into per-letter spans
                  collapsed the word spaces and pulled the lasso off "soon". */}
              <h1 className="font-display text-[clamp(3rem,5.6vw,5.25rem)] leading-[1.02] tracking-[-0.025em] text-cobalt [text-wrap:pretty]">
                Our doors are opening <Circled tone="coral">soon</Circled>
              </h1>

              {/* Rendered only when the clinic has actually confirmed a date. */}
              {OPENING_DATE ? (
                <p className="mt-4 font-display text-h2 text-cobalt">{OPENING_DATE}</p>
              ) : null}

              {/* Paper panel: lifts the copy clear of the loop strokes and
                  brings the palette's fourth colour onto the page. */}
              <div className="mt-6 flex max-w-[60ch] gap-5 rounded-3xl bg-paper p-6 shadow-[0_14px_30px_-22px_rgba(24,82,142,0.45)]">
                <span aria-hidden="true" className="block w-1 shrink-0 rounded-full bg-coral" />
                <div className="flex flex-col gap-3.5">
                  <p className="font-sans text-[1.0625rem] leading-relaxed text-cobalt">
                    We are building a calm, gentle place for children&apos;s teeth in
                    Kharghar — one where a first visit feels safe, unhurried, and
                    even a little magical. The clinic is being finished right now,
                    and the full website is on its way with it.
                  </p>
                  <p className="font-sans text-[1.0625rem] leading-relaxed text-cobalt">
                    Come and find us here when we open. We cannot wait to meet your
                    family.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <StylisedCTA lead="Get" rest="directions" href={MAP_DIRECTIONS_HREF} fill="canary" />
              </div>

              <p className="mt-5 flex items-center gap-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cobalt/65">
                <Doodle name="markArrow" tone="coral" className="w-[34px] shrink-0 rotate-[-8deg]" />
                Nudge the doodles — they wobble
              </p>
            </div>

            {/* The address panel keeps the cobalt surface, so the practical
                part of the page still reads as the official one. It is pulled
                up on desktop so the whole map is visible without scrolling. */}
            <div className="relative lg:-mt-[168px]">
              <span className="tt-floating-doodle pointer-events-none absolute -right-4 -top-[52px] z-[3] block w-[104px]" data-depth="34">
                <Doodle name="doodleToothbrush" tone="cobalt" drawOnScroll className="w-full rotate-[18deg]" />
              </span>
              <div
                ref={cardRef}
                onPointerEnter={straighten(true)}
                onPointerLeave={straighten(false)}
                className="tt-hop relative z-[2] rounded-[2rem] bg-cobalt p-6 shadow-[0_24px_48px_-24px_rgba(24,82,142,0.55)] transition-transform duration-500 ease-entrance lg:rotate-[-2.2deg]"
                style={{ animationDelay: '0.8s' }}
              >
                <h2 className="font-display text-h2 text-canary">Finding {CLINIC.name}</h2>

                <address className="mt-4 font-sans text-[0.9375rem] not-italic leading-relaxed text-white">
                  <p className="font-semibold">{CLINIC_ADDRESS.society}</p>
                  <p className="text-white/90">{CLINIC_ADDRESS.unit}</p>
                  <p className="text-white/90">
                    {CLINIC_ADDRESS.sector}, {CLINIC_ADDRESS.locality}
                  </p>
                  <p className="text-white/90">
                    {CLINIC_ADDRESS.city}, {CLINIC_ADDRESS.region} {CLINIC_ADDRESS.postcode}
                  </p>
                  <p className="mt-3 flex gap-2 text-sm text-white/75">
                    <span aria-hidden="true" className="text-coral">
                      ✳
                    </span>
                    {CLINIC_ADDRESS.landmark}
                  </p>
                </address>

                <div className="mt-4 overflow-hidden rounded-[1.25rem] border-[3px] border-canary">
                  <iframe
                    src={MAP_EMBED_SRC}
                    title={`Map showing ${CLINIC.fullName} in ${CLINIC_ADDRESS.locality}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="block h-[210px] w-full border-0"
                  />
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

        {/* A ribbon of the primary palette, decorative only. */}
        <div aria-hidden="true" className="relative z-10 flex h-3.5">
          <span className="flex-[2] bg-coral" />
          <span className="flex-1 bg-canary" />
          <span className="flex-[3] bg-cobalt-60" />
          <span className="flex-1 bg-coral" />
        </div>

        {/* ---- the strapline, running ---- */}
        <div className="relative z-10 overflow-hidden bg-cobalt py-5">
          <div className="tt-marquee-track flex w-max">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
                className="flex flex-none items-center gap-10 pr-10 font-display text-[2rem] leading-none tracking-[0.02em] text-canary [white-space:nowrap]"
              >
                {[0, 1, 2].map((i) => (
                  <span key={i} className="flex items-center gap-10">
                    {CLINIC.tagline}
                    <span aria-hidden="true" className="text-coral">
                      ✳
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 mx-auto w-full max-w-[1240px] px-6 pb-9 pt-5 font-sans text-xs text-cobalt/70 md:px-10 lg:px-12">
          © {new Date().getFullYear()} {CLINIC.fullName}. All rights reserved.
        </p>
      </main>
    </>
  )
}
