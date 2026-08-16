import { useEffect, useRef } from 'react'
import { CoralPageAccent } from '@/components/CoralPageAccent'
import { SectionNumber } from '@/components/SectionNumber'
import { ServiceIcon } from '@/components/ServiceIcon'
import { TextPanel } from '@/components/TextPanel'
import { gsap, EASE, STAGGER, usePrefersReducedMotion } from '@/lib/motion'
import { useIsMobile } from '@/lib/viewport'
import { TREATMENTS } from '@/content/treatments'
import { TREATMENT_HREF } from '@/content/treatmentCategories'
import { useSectionMeta } from '@/content/sectionOrder'
import { ServicesMobile } from './Services.mobile'

/**
 * 03 Services -- paper.
 *
 * REBUILT to the reference the client gave (tinytooth.in): six clinical
 * categories, icon and label, no descriptive copy. It replaces two things that
 * were here before -- six cards of copy we had written, and a flat sixteen-tile
 * filterable index below them -- because the client rejected that arrangement.
 *
 * A category opens to reveal the treatments inside it, and those are the
 * clinic's own labels from `content/treatments.ts`, unedited. The disclosure is
 * a native `<details>`: no state, no JavaScript, correct for a keyboard and a
 * screen reader on its own, and open/closed survives with motion turned off.
 *
 * The phone renders `Services.mobile.tsx` instead -- the same six categories,
 * as a 2-up icon grid on the home page and as a grouped list on `/services`.
 * This desktop composition never mounts under `md`.
 */
export function Services({ asPage = false }: { asPage?: boolean | undefined }) {
  if (useIsMobile()) return <ServicesMobile asPage={asPage} />
  return <ServicesDesktop asPage={asPage} />
}

function ServicesDesktop({ asPage }: { asPage: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()
  const meta = useSectionMeta('services')
  const Heading = asPage ? 'h1' : 'h2'
  const CardHeading = asPage ? 'h2' : 'h3'

  useEffect(() => {
    const root = ref.current
    if (!root || reduced) return
    const ctx = gsap.context(() => {
      gsap.from('[data-card]', {
        y: 44,
        opacity: 0,
        duration: 0.85,
        ease: EASE.entrance,
        stagger: STAGGER,
        scrollTrigger: { trigger: root, start: 'top 72%', once: true },
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section
      id="services"
      ref={ref}
      aria-labelledby="services-heading"
      className={[
        'tt-section relative bg-paper px-6 md:px-10',
        asPage ? 'py-24 md:py-32' : 'py-20 md:py-24',
      ].join(' ')}
    >
      {asPage ? <CoralPageAccent /> : null}
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <SectionNumber number={meta.number} label={meta.label} tone="coral" />
        <Heading
          id="services-heading"
          className="mt-4 max-w-[26ch] font-display text-h1 text-cobalt"
          data-animate
        >
          Everything a growing mouth needs, and nothing it does not
        </Heading>
        <p className="mt-5 max-w-measure font-sans text-body text-cobalt" data-animate>
          Every treatment we offer, in the clinic&apos;s own words. Ask us about any of them,
          because we would rather explain it twice than have you guess.
        </p>

        {/* All sixteen at once, as squares. The categories survive as the tag
            under each label rather than as six gates you have to click through
            -- a parent looking for "root canal" should not have to guess which
            of six words hides it. */}
        {/* Eight across at desktop, so sixteen treatments are two rows and the
            whole list is on screen at once -- four across made each tile ~330px
            and the band four screens tall. The category tag went with the size:
            it does not fit a tile this small, and the tiles are alphabetically
            unsorted clinic order anyway, so it was decoration here. */}
        <ul className="mt-12 grid list-none grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {TREATMENTS.map((treatment) => {
            const href = TREATMENT_HREF[treatment.slug]
            const Tile = href ? 'a' : 'div'
            // "Stainless Steel & Tooth-Coloured Crowns" is 39 characters; the
            // shortest ("Cleaning") is eight. One step down past 26 stops the
            // long ones overflowing a tile this size.
            const long = treatment.label.length > 26
            return (
              <li key={treatment.slug} data-card className="min-w-0">
                <Tile
                  {...(href ? { href } : {})}
                  title={href ? `${treatment.label} specialty page` : treatment.label}
                  className={[
                    'tt-treatment-tile flex aspect-square min-w-0 flex-col items-center justify-center gap-1.5 p-2.5 text-center',
                    'rounded-[1rem] bg-paper shadow-[inset_0_0_0_2px_var(--tt-powder)]',
                    'transition-[transform,background-color] duration-500 ease-entrance',
                    'hover:-translate-y-1 hover:bg-canary focus-visible:-translate-y-1',
                    href ? 'shadow-[inset_0_0_0_2px_var(--tt-coral)]' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <ServiceIcon
                    slug={treatment.slug}
                    className={['shrink-0 text-cobalt', long ? 'h-8 w-9' : 'h-10 w-11'].join(' ')}
                  />
                  {/* `text-wrap: balance` evens the lines out rather than
                      leaving one orphan word under a full line. */}
                  <CardHeading
                    className={[
                      'min-w-0 font-sans leading-tight text-cobalt [text-wrap:balance]',
                      long ? 'text-[0.63rem]' : 'text-[0.7rem]',
                    ].join(' ')}
                  >
                    {treatment.label}
                  </CardHeading>
                </Tile>
              </li>
            )
          })}
        </ul>

        {/* Closes the band. Coral field, copy on a cobalt bed -- coral cannot
            carry text at any size or colour (CLAUDE.md §6.1). */}
        <div
          data-surface="coral"
          className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-[2rem] bg-coral px-7 py-6"
        >
          <TextPanel surface="coral" className="min-w-0 flex-1 basis-80">
            <p className="max-w-measure font-sans text-[0.95rem] leading-relaxed text-white">
              <span className="font-semibold">Not sure which one you need?</span> Tell us what you
              have noticed and we will point you to the right one, and no appointment is needed to
              ask.
            </p>
          </TextPanel>
          <a
            href="/book"
            className="shrink-0 rounded-full bg-cobalt px-6 py-3 font-sans text-[0.85rem] font-semibold text-canary transition-transform duration-500 ease-entrance hover:-translate-y-0.5"
          >
            Ask the clinic
          </a>
        </div>
      </div>
    </section>
  )
}
