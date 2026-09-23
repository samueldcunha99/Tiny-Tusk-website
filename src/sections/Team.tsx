import { useRef } from 'react'
import { Circled } from '@/components/Circled'
import { Doodle } from '@/components/Doodle'
import { SectionMarker } from '@/components/SectionMarker'
import { StylisedCTA } from '@/components/StylisedCTA'
import { TextOnPath } from '@/components/TextOnPath'
import { DR_NUPUR } from '@/content/team'
import { useSectionMeta } from '@/content/sectionOrder'
import { useReveal } from '@/lib/motion'

/**
 * Dr. Nupur -- the canary plate straight after the welcome. The welcome's
 * powder dips into it in the tagline's smile, so the first two chapters no
 * longer run together as one long field (the user: "this feels one long page
 * box").
 *
 * A book spread (p5): the quote as the headline with its one lassoed word, her
 * own words, and her portrait as a badge -- the guide's p35 type on a path,
 * her name and specialty ringed round a round photograph. There is no approved
 * portrait yet, so the badge holds the heart on a cobalt disc: the slot is kept
 * (the user asked for it) without a grey box pretending a photograph exists.
 * Set `DR_NUPUR.portrait.src` and the photograph takes the disc.
 *
 * On a phone the story reads straight down: headline, portrait, her words. On
 * desktop the headline runs the full width and the portrait stands beside the
 * words, so neither column is left with a hole. On the home page this is an
 * introduction (first paragraph, specialities); the `/dr-nupur` page carries
 * the full biography and what a visit feels like.
 */
export function Team({ asPage = false }: { asPage?: boolean | undefined }) {
  const ref = useRef<HTMLElement>(null)
  const meta = useSectionMeta('team')
  const Heading = asPage ? 'h1' : 'h2'
  const Sub = asPage ? 'h2' : 'h3'
  const [quoteHead, quoteTail] = DR_NUPUR.philosophy.quote.split('understood')
  useReveal(ref)

  return (
    <section
      id="team"
      ref={ref}
      data-surface="canary"
      aria-labelledby="team-heading"
      className={[
        'tt-section relative overflow-hidden bg-canary px-6 text-cobalt md:px-10',
        asPage ? 'pb-20 pt-24 md:pb-28 md:pt-36' : 'pb-20 pt-20 md:pb-24 md:pt-28',
      ].join(' ')}
    >
      {/* Low-contrast register, p25: white on canary, looping round behind the
          portrait. Tablet and up only: on a phone everything stacks in one
          column, so any loop behind the badge also runs behind her name and
          words. */}
      <Doodle
        name="loopStroke"
        tone="white"
        drawOnScroll
        duration={1.8}
        className="pointer-events-none absolute hidden max-w-none md:-right-[16%] md:top-[10%] md:block md:w-[46%]"
      />

      <div className="relative mx-auto grid max-w-[1320px] gap-10 [grid-template-areas:'head'_'badge'_'bio'_'spec'_'more'] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-x-20 lg:[grid-template-areas:'head_head'_'bio_badge'_'spec_badge'_'more_badge']">
        <div className="[grid-area:head]">
          <SectionMarker label={meta.label} />
          <Heading
            id="team-heading"
            data-reveal
            className="mt-5 max-w-[16ch] text-balance font-display text-[clamp(2.4rem,10vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.025em] lg:max-w-none"
          >
            {quoteHead}
            <Circled tone="cobalt">understood</Circled>
            {/* The lasso's own padding would strand the full stop. */}
            <span className="-ml-[0.3em]">{quoteTail}</span>
          </Heading>
        </div>

        {/* On the full page the text runs long, so the portrait stays in view
            beside it; on the home page it simply centres on the text. */}
        <div
          className={[
            'flex flex-col items-center text-center [grid-area:badge]',
            asPage ? 'lg:sticky lg:top-28 lg:self-start' : 'lg:self-center',
          ].join(' ')}
        >
          <PortraitBadge />
          <Sub className="mt-6 font-display text-[clamp(1.75rem,6.5vw,2.5rem)] font-semibold leading-[1.05]">
            {DR_NUPUR.name}
          </Sub>
          {/* CLIENT-VERIFIED credentials (content/team.ts). */}
          <p className="mt-1.5 font-sans text-[0.95rem] font-semibold">{DR_NUPUR.credentials}</p>
        </div>

        {/* Her own words, first person, verbatim (content/team.ts). */}
        <div className="flex flex-col gap-5 font-sans text-[1.05rem] leading-[1.65] [grid-area:bio] md:text-[1.15rem]">
          {(asPage ? DR_NUPUR.bio : DR_NUPUR.bio.slice(0, 1)).map((para) => (
            <p key={para.slice(0, 24)} data-reveal="fast" className="max-w-[54ch]">
              {para}
            </p>
          ))}
        </div>

        <div className="[grid-area:spec]">
          <Sub className="font-display text-[1.4rem] font-semibold">Key specialities</Sub>
          <ul className="mt-4 flex flex-col gap-3">
            {DR_NUPUR.specialities.map((speciality) => (
              <li key={speciality} className="flex items-start gap-3.5 font-sans text-[1rem] leading-snug">
                <span className="mt-[0.2em] block w-5 shrink-0" aria-hidden="true">
                  <Doodle name="markArrow" tone="cobalt" />
                </span>
                {speciality}
              </li>
            ))}
          </ul>
        </div>

        <div className="[grid-area:more]">
          {asPage ? (
            <>
              <Sub className="font-display text-[1.4rem] font-semibold">What a visit with her feels like</Sub>
              <ul className="mt-5 flex flex-col gap-6">
                {DR_NUPUR.expectations.map((beat) => (
                  <li key={beat.title} className="flex items-start gap-4">
                    <Doodle name={beat.glyph} tone="cobalt" drawOnScroll className="mt-1 w-9 shrink-0" />
                    <div>
                      <p className="font-display text-[1.25rem] font-semibold leading-tight">{beat.title}</p>
                      <p className="mt-1 max-w-[48ch] font-sans text-[1rem] leading-relaxed">{beat.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {/* Powder, not canary: a canary button would vanish into the ground. */}
              <div className="-m-4 mt-8 p-4">
                <StylisedCTA lead="Book" rest="a visit with Dr. Nupur" href="/book" fill="powder" />
              </div>
            </>
          ) : (
            <a href="/dr-nupur" className="inline-flex min-h-11 items-center gap-3 font-sans text-[1rem] font-semibold">
              <span className="underline decoration-2 underline-offset-[6px]">More about Dr. Nupur</span>
              <span className="block w-5" aria-hidden="true">
                <Doodle name="markArrow" tone="cobalt" />
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

/**
 * Her name ringed round her portrait. The ring's type sits outside a circle of
 * radius 100 in a 240 box, so the disc stops at 74% of the width, clear of the
 * letters' descenders.
 */
function PortraitBadge() {
  const { src, alt } = DR_NUPUR.portrait
  return (
    <div className="relative aspect-square w-[17rem] md:w-[20rem] lg:w-[22rem]">
      <TextOnPath
        text="Dr. Nupur Agarwal • Pediatric Dentistry"
        mode="ring"
        tone="cobalt"
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-[13%] grid place-items-center overflow-hidden rounded-full bg-cobalt" data-surface="cobalt">
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <Doodle name="doodleHeart" tone="canary" drawOnScroll tap className="w-[44%]" />
        )}
      </div>
    </div>
  )
}
