export interface ParentArticle {
  id: string
  category: 'Routines' | 'Guides' | 'Products'
  title: { lead: string; rest: string }
  summary: string
  fill: 'canary' | 'powder' | 'coral'
  image: {
    stem: string
    alt: string
    width: number
    height: number
    logoTone: 'white' | 'cobalt'
    doodle: 'doodleFace' | 'doodleHeart' | 'markZigzag'
    doodleTone: 'canary' | 'coral'
  }
}

export const PARENT_ARTICLES: readonly ParentArticle[] = [
  { id: 'toothpaste', category: 'Products', title: { lead: 'Choosing the right', rest: 'toothpaste' }, summary: 'What matters at the sink, what does not, and which ingredients are worth avoiding for little mouths.', fill: 'canary', image: { stem: 'brushing-demo', alt: 'A hand brushing a dental model.', width: 711, height: 799, logoTone: 'cobalt', doodle: 'doodleHeart', doodleTone: 'coral' } },
  { id: 'two-minutes', category: 'Routines', title: { lead: 'Mythbusting the', rest: '2-minute rule & more…' }, summary: 'Two minutes is useful, but it is not a test. Here is how to make the time feel manageable.', fill: 'powder', image: { stem: 'child-pointing-smile', alt: 'A child pointing to her smile in the clinic.', width: 800, height: 1200, logoTone: 'cobalt', doodle: 'doodleFace', doodleTone: 'canary' } },
  { id: 'retainers', category: 'Guides', title: { lead: 'A full guide to', rest: 'retainers, and why, when & how' }, summary: 'The plain English version of what retainers do and how to make them part of a normal evening.', fill: 'coral', image: { stem: 'retainer-product', alt: 'A clear dental retainer on a white background.', width: 901, height: 305, logoTone: 'cobalt', doodle: 'markZigzag', doodleTone: 'canary' } },
  { id: 'cavities', category: 'Guides', title: { lead: 'Cavities', rest: 'stages' }, summary: 'Early signs, what we can do before a filling is needed, and when it is time to call.', fill: 'canary', image: { stem: 'cavities-stages', alt: 'A child in a dental chair under a blue curing light.', width: 1199, height: 1798, logoTone: 'white', doodle: 'doodleHeart', doodleTone: 'canary' } },
  { id: 'avoid', category: 'Products', title: { lead: 'Do not use', rest: 'these!' }, summary: 'A short, non-alarmist guide to abrasive pastes, adult rinses, and products that promise too much.', fill: 'powder', image: { stem: 'toothbrush-product', alt: 'A toothbrush on a white background.', width: 649, height: 704, logoTone: 'cobalt', doodle: 'markZigzag', doodleTone: 'coral' } },
] as const
