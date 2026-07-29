import { useState } from 'react'
import { Doodle } from '@/components/Doodle'
import { SectionNumber } from '@/components/SectionNumber'
import { FAQS } from '@/content/faq'
import { sectionMeta } from '@/content/site'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const meta = sectionMeta('faq')
  return <section id="faq" className="tt-section bg-paper px-6 py-24 md:px-10 md:py-32" aria-labelledby="faq-heading"><div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.7fr_1.3fr]"><div><SectionNumber number={meta.number} label={meta.label} tone="cobalt" /><h2 id="faq-heading" className="mt-4 font-display text-h1 text-cobalt">Questions, answered kindly</h2><p className="mt-5 max-w-measure font-sans text-body text-cobalt">If yours is not here, call us. A short conversation is often the quickest way to settle a worry.</p></div><div className="divide-y-2 divide-powder">{FAQS.map((item, index) => { const active = open === index; const panelId = `faq-panel-${index}`; return <article key={item.question}><h3><button type="button" aria-expanded={active} aria-controls={panelId} onClick={() => setOpen(active ? null : index)} className="flex min-h-[72px] w-full items-center justify-between gap-6 py-5 text-left font-display text-h2 text-cobalt"><span>{item.question}</span><Doodle name="markArrow" tone="cobalt" className={['w-12 shrink-0 transition-transform duration-500 ease-transform', active ? 'rotate-90' : ''].join(' ')} /></button></h3><div id={panelId} className={['grid transition-[grid-template-rows] duration-500 ease-transform', active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'].join(' ')}><div className="overflow-hidden"><p className="max-w-measure pb-6 font-sans text-body text-cobalt">{item.answer}</p></div></div></article> })}</div></div></section>
}
