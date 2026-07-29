import { Doodle } from '@/components/Doodle'
import { SectionNumber } from '@/components/SectionNumber'
import { TESTIMONIALS } from '@/content/testimonials'
import { SECTIONS } from '@/content/site'

export function Testimonials() {
  const meta = SECTIONS[7]
  const cards = [...TESTIMONIALS, ...TESTIMONIALS]
  return <section id="voices" className="tt-section overflow-hidden bg-cobalt py-24 md:py-32" data-surface="cobalt" aria-labelledby="voices-heading"><div className="relative mx-auto max-w-[1400px] px-6 md:px-10"><div className="relative z-10"><SectionNumber number={meta.number} label={meta.label} tone="canary" /><h2 id="voices-heading" className="mt-4 font-display text-h1 text-canary">The words we keep hearing</h2></div><Doodle name="markLasso" tone="white" className="absolute -right-8 top-0 w-64 opacity-[0.33]" /><Doodle name="markZigzag" tone="white" className="absolute bottom-0 left-8 w-40 opacity-[0.33]" /></div><div className="tt-marquee-track mt-12 flex w-max gap-5 px-6 md:px-10">{cards.map((item, index) => <figure key={`${item.parent}-${index}`} className="flex w-[min(82vw,430px)] shrink-0 flex-col justify-between rounded-[2rem] bg-white p-7 text-cobalt md:p-9"><blockquote className="font-display text-[clamp(1.6rem,2.5vw,2.4rem)] leading-tight">“{item.quote}”</blockquote><figcaption className="mt-8 border-t border-powder pt-4 font-sans text-sm"><span className="block font-semibold">{item.parent}</span><span>{item.child}</span></figcaption></figure>)}</div></section>
}
