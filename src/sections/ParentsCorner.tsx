import { BrandImage } from '@/components/BrandImage'
import { Circled } from '@/components/Circled'
import { MixedWeightLabel } from '@/components/MixedWeightLabel'
import { SectionNumber } from '@/components/SectionNumber'
import { PARENT_ARTICLES } from '@/content/parents'
import { SECTIONS } from '@/content/site'

export function ParentsCorner() {
  const meta = SECTIONS[6]

  return (
    <section
      id="parents"
      className="tt-section bg-canary px-6 py-24 md:px-10 md:py-32"
      data-surface="canary"
      aria-labelledby="parents-heading"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionNumber number={meta.number} label={meta.label} tone="cobalt" />
        <h2 id="parents-heading" className="mt-4 max-w-3xl font-display text-h1 text-cobalt">
          A little <Circled tone="cobalt">backup</Circled> for home
        </h2>
        <p className="mt-5 max-w-measure font-sans text-body text-cobalt">
          Useful answers for the ordinary questions that usually arrive while you are holding a toothbrush.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {PARENT_ARTICLES.map((article) => (
            <article
              key={article.id}
              className="flex overflow-hidden rounded-[2rem] bg-paper shadow-[0_10px_30px_rgba(24,82,142,0.10)]"
            >
              <div className="flex w-full flex-col p-5 sm:p-7">
                <h3 className="font-display text-h2 text-cobalt">
                  <Circled tone="cobalt">
                    <MixedWeightLabel lead={article.title.lead} rest={article.title.rest} display />
                  </Circled>
                </h3>
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
