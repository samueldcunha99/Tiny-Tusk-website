import { useEffect, useRef } from 'react'
import { Circled } from '@/components/Circled'
import { Doodle } from '@/components/Doodle'
import { Logo } from '@/components/Logo'
import { LoopField } from '@/components/LoopField'
import { StylisedCTA } from '@/components/StylisedCTA'
import { SectionMarker } from '@/components/SectionMarker'
import { colourVar } from '@/components/BrandArtView'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'
import { DR_NUPUR } from '@/content/team'
import { useSectionMeta } from '@/content/sectionOrder'

/**
 * Mobile Dr. Nupur -- canary.
 *
 * The philosophy quote is the heading, with the guide's lasso (p32) on the
 * single word "understood". Never lasso more than one word: `Circled` sets
 * `nowrap`, and a wrapped multi-word phrase clips.
 *
 * THE OFFICIAL REGISTER. Credentials are a clinical claim, so they sit in the
 * cobalt-on-cobalt register (p26) rather than on the canary field with the rest
 * of the copy. The panel overlaps the portrait by 32px, which ties the two
 * together and stops the canary section reading as three stacked blocks.
 *
 * THE PORTRAIT DOES NOT EXIST YET. `DR_NUPUR.portrait.productionNote` is
 * guidance for whoever commissions the shoot and must never render, so the slot
 * is an honest 4:5 `cobalt-20` placeholder that says what is missing, with the
 * coral dashes breaking its corner as they will over the real photograph.
 *
 * On the home page this is the short register: quote, portrait, name and
 * credentials, the first bio paragraph, and the way out. `asPage` adds the five
 * client-supplied specialities, the full bio and the three expectation cards.
 */
export function TeamMobile({ asPage = false }: { asPage?: boolean | undefined }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('team')
  const Heading = asPage ? 'h1' : 'h2'
  const bio = asPage ? DR_NUPUR.bio : DR_NUPUR.bio.slice(0, 1)

  useEffect(() => {
    const root = ref.current
    if (!root || reduced) return
    const ctx = gsap.context(() => {
      gsap.from('[data-expect-card]', {
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: EASE.entrance,
        stagger: STAGGER,
        scrollTrigger: { trigger: '[data-expect-list]', start: 'top 88%' },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="team"
      ref={ref}
      className="tt-section relative bg-paper pb-14"
      aria-labelledby="team-mobile-heading"
    >
      <div
        data-surface="canary"
        className={[
          'relative overflow-hidden bg-canary px-6',
          asPage ? 'pb-10 pt-[6.5rem]' : 'pb-10 pt-[3.25rem]',
        ].join(' ')}
      >
        <LoopField surface="canary" contrast="low" depth={0.24} count={2} />

        <div className="relative z-10">
          <SectionMarker label={meta.label} />

          <Heading
            id="team-mobile-heading"
            className="mt-4 font-display text-[clamp(2rem,8.7vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-cobalt"
            data-animate
          >
            A first visit should leave a child feeling <Circled>understood</Circled>.
          </Heading>

          {/* 4:5 was a slab of empty cobalt-20 the height of a phone screen for
              a photograph that does not exist. A 3:2 strip says the same thing
              and stops the section opening on a hole. */}
          <div className="relative mt-7 grid aspect-[3/2] place-items-center overflow-hidden rounded-[1.5rem] bg-cobalt-20">
            <div className="flex flex-col items-center gap-2.5 p-6 text-center">
              <Logo size={68} tone="cobalt" title={DR_NUPUR.portrait.alt} />
              {/* cobalt-20 is a pale ground: /70 measured 3.17:1 on it. */}
              <p className="font-sans text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-cobalt">
                Portrait to be supplied
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The official register (p26): credentials are verified clinical fact,
          so they keep their cobalt bed. It no longer overlaps the portrait --
          two boxes climbing over each other was the "too many boxes" note. */}
      <div className="px-6">
        <div
          data-surface="cobalt"
          className="mt-4 rounded-[1.5rem] bg-cobalt p-6"
        >
          <p className="font-display text-[2.125rem] font-semibold leading-none text-canary">
            {DR_NUPUR.name}
          </p>
          {/* CLIENT-VERIFIED. Do not weaken or remove -- see content/team.ts. */}
          <p className="mt-2.5 font-sans text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-white">
            {DR_NUPUR.credentials}
          </p>

          {asPage ? (
            <div className="mt-[1.125rem] border-t border-white/20 pt-[1.125rem]">
              <p className="font-sans text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-white/70">
                Key specialities
              </p>
              <ul className="mt-3.5 flex flex-col gap-2.5">
                {DR_NUPUR.specialities.map((speciality) => (
                  <li key={speciality} className="flex gap-3 font-sans text-[0.9rem] leading-[1.45] text-white">
                    <span
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                      style={{ background: colourVar('canary') }}
                      aria-hidden="true"
                    />
                    {speciality}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {/* CLIENT-SUPPLIED, IN DR. NUPUR'S OWN WORDS. Verbatim, first person --
          do not rewrite into the site's third-person voice. */}
      <div className="mt-8 flex flex-col gap-4 px-6">
        {bio.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="font-sans text-[1rem] leading-[1.6] text-cobalt">
            {paragraph}
          </p>
        ))}
      </div>

      {asPage ? (
        <div className="mt-7 px-6">
          <p className="flex items-center gap-3.5">
            <span className="h-0.5 w-11 shrink-0" style={{ background: colourVar('coral') }} aria-hidden="true" />
            <span className="whitespace-nowrap font-sans text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-cobalt">
              What to expect
            </span>
          </p>

          <div className="mt-[1.125rem] flex flex-col gap-3" data-expect-list>
            {DR_NUPUR.expectations.map((beat) => (
              <article
                key={beat.title}
                data-expect-card
                data-animate
                data-surface={beat.surface}
                className="flex gap-4 rounded-[1.625rem] p-5"
                style={{ background: colourVar(beat.surface) }}
              >
                <span className="w-12 shrink-0" aria-hidden="true">
                  <Doodle name={beat.glyph} tone={beat.element} />
                </span>
                <div>
                  <h3
                    className="font-display text-[1.4375rem] font-semibold leading-[1.1]"
                    style={{ color: colourVar(beat.element) }}
                  >
                    {beat.title}
                  </h3>
                  <p
                    className="mt-2 font-sans text-[0.9rem] leading-[1.5]"
                    style={{ color: colourVar(beat.element) }}
                  >
                    {beat.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {/* On her own page this is the page's one filled action. On the home page
          it is a way through to her page, and "Book a visit" further down is
          the only filled button there -- see the one-action rule in
          `Home.mobile.tsx`. */}
      <div className="mt-6 px-6">
        {asPage ? (
          <StylisedCTA
            lead="Book"
            rest="with Dr. Nupur"
            href="/book"
            fill="canary"
            className="min-h-[3.625rem] w-full max-w-[18.75rem]"
          />
        ) : (
          <a
            href="/dr-nupur"
            className="inline-flex min-h-11 items-center font-sans text-[0.9rem] font-semibold text-cobalt underline underline-offset-4"
          >
            Meet Dr. Nupur
          </a>
        )}
      </div>
    </section>
  )
}
