import { useState } from 'react'
import { BrandImage } from '@/components/BrandImage'
import { CoralPageAccent } from '@/components/CoralPageAccent'
import { Circled } from '@/components/Circled'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { SectionNumber } from '@/components/SectionNumber'
import { PARENT_ARTICLES } from '@/content/parents'
import { sectionMeta } from '@/content/site'

export function ParentsCorner({ asPage = false }: { asPage?: boolean | undefined }) {
  const filters = ['All', 'Routines', 'Guides', 'Products'] as const
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const meta = sectionMeta('parents')
  const Heading = asPage ? 'h1' : 'h2'
  const CardHeading = asPage ? 'h2' : 'h3'
  const articles = filter === 'All'
    ? PARENT_ARTICLES
    : PARENT_ARTICLES.filter((article) => article.category === filter)

  return (
    <section
      id="parents"
      className={[
        'tt-section relative bg-canary px-6 md:px-10',
        asPage
          ? 'py-24 md:py-32'
          : 'border-t-8 border-cobalt py-20 md:py-24',
      ].join(' ')}
      data-surface="canary"
      data-home-divider={asPage ? undefined : 'cobalt'}
      aria-labelledby="parents-heading"
    >
      {asPage ? <CoralPageAccent /> : null}
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />
        <Heading id="parents-heading" className="mt-4 max-w-3xl font-display text-h1 text-cobalt">
          A little <Circled tone="cobalt">backup</Circled> for home
        </Heading>
        <p className="mt-5 max-w-measure font-sans text-body text-cobalt">
          Useful answers for the ordinary questions that usually arrive while you are holding a toothbrush.
        </p>

        <div className="mt-8 flex flex-wrap gap-3" aria-label="Filter parent guides">
          {filters.map((option) => {
            const active = filter === option

            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(option)}
                className={[
                  'min-h-11 rounded-full border-2 border-cobalt px-5 font-sans font-semibold transition-colors',
                  active ? 'bg-cobalt text-canary' : 'bg-paper text-cobalt hover:bg-powder',
                ].join(' ')}
              >
                {option}
              </button>
            )
          })}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-6">
          {articles.map((article, index) => (
            <article
              key={article.id}
              className={[
                'flex overflow-hidden rounded-[2rem] bg-paper shadow-[0_10px_30px_rgba(24,82,142,0.10)]',
                filter === 'All' && index < 2 ? 'xl:col-span-3' : '',
                filter === 'All' && index >= 2 ? 'xl:col-span-2' : '',
                filter !== 'All' ? 'xl:col-span-3' : '',
              ].join(' ')}
            >
              <div className="flex w-full flex-col p-5 sm:p-7">
                {/* No lasso here: circling an entire multi-word title forces
                    nowrap and clips the heading mid-word. The guide's lasso
                    encloses a single word — it is used on the section heading
                    above, where it belongs. */}
                <CardHeading className="text-balance font-display text-h2 text-cobalt">
                  <MixedWeightLabel lead={article.title.lead} rest={article.title.rest} display />
                </CardHeading>
                <BrandImage
                  webp={`/images/${article.image.stem}.webp`}
                  png={`/images/${article.image.stem}.png`}
                  alt={article.image.alt}
                  width={article.image.width}
                  height={article.image.height}
                  title={{ ...article.title, fill: article.fill, href: '/parents-corner' }}
                  logoTone={article.image.logoTone}
                  doodle={article.image.doodle}
                  doodleTone={article.image.doodleTone}
                  className="mt-6 aspect-[4/3]"
                />
                <p className="mt-7 font-sans text-base leading-relaxed text-cobalt">{article.summary}</p>
                <a
                  href="/parents-corner"
                  className="mt-6 inline-flex min-h-11 items-center font-sans font-semibold text-cobalt underline decoration-powder underline-offset-4"
                >
                  Read the guide <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
