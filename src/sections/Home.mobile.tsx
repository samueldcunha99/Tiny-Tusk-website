import { SectionOrder } from '@/content/sectionOrder'
import type { SectionId } from '@/content/site'
import { Hero } from './Hero'
import { ServicesMobile } from './Services.mobile'
import { TeamMobile } from './Team.mobile'
import { BookBandMobile } from './BookBand.mobile'

/**
 * What this page renders, in order. `<SectionOrder>` still counts it so any
 * section that does show a numeral counts off what actually renders rather
 * than off the registry (see `sectionOrder.tsx`).
 */
const HOME_MOBILE_ORDER: readonly SectionId[] = ['hero', 'services', 'team', 'book']

/**
 * The mobile home page.
 *
 * FOUR SECTIONS, AND WHY IT USED TO BE MORE
 *
 * The redesign shipped six: Welcome, the Journey strip, Services, Dr. Nupur,
 * Find Us and Book. Client review called it "too many colours, too many boxes,
 * too much text, very confusing" -- which is four descriptions of one problem.
 * Every section was built from the same recipe (full-bleed brand colour +
 * background artwork + numeral + heading + lede + boxes + its own call to
 * action), so all six were equally loud and nothing led. Six screens counted
 * five full-bleed grounds, five corner radii, six LoopFields, sixteen
 * paragraphs and seven exits.
 *
 * The rules this page now holds to, and which must survive the next edit:
 *
 *   1. ONE CONTINUOUS COLOUR RUN. The page steps through the palette once, in
 *      one direction, each ground a step warmer and darker than the last:
 *
 *        powder -> paper -> canary -> coral -> cobalt (the footer)
 *
 *      Cool, neutral, warm, warmer, close. Paper is the neutral hinge in the
 *      middle, not the page's default -- the hero holds colour from the first
 *      screen, which is what the client asked for after seeing a white one.
 *
 *      It never goes back. The client's note was that the colour "jumps
 *      around" -- six sections previously ran powder, cobalt, paper, canary,
 *      powder, coral, which visits cobalt twice and reverses direction three
 *      times. A ground change is now the only separator a section needs, and
 *      LoopField appears twice on the page rather than six times.
 *   2. ONE BOX LANGUAGE. One radius (1.5rem, matching `<TextPanel>`), one
 *      padding, no box inside a box. A list is a list with rules between rows,
 *      not a grid of tiles. Anything that is a single idea has no box at all.
 *   3. ONE HEADING AND ONE LINE. Body copy lives on the page it belongs to.
 *      No lede that restates the heading above it.
 *   4. ONE PRIMARY ACTION. "Book a visit" is the only filled button on the
 *      page. Every other exit is a quiet underlined link, and the section
 *      numerals are gone (see `<SectionMarker>`).
 *
 *   00 Welcome     -- who we are, one action                 (powder)
 *   01 What we do  -- the logo story, then six groups as rows (paper)
 *   02 Dr. Nupur   -- the quote and the register             (canary)
 *   03 Book        -- the action, the address, WhatsApp      (coral)
 *
 * THE LOGO STORY opens section 01 rather than being a section of its own: one
 * small row, set as the identity guide sets it on p3. See `<LogoStory>`. It is
 * what the swipeable Journey strip became when the client asked for the book's
 * version instead. It is on paper because the guide prints it on white and its
 * coral line art measures 1.84:1 on powder.
 *
 * WHAT IS NOT HERE. The Journey strip was cut: `/journey` renders the whole
 * thing properly and the hero links straight to it. Find Us was folded into
 * the booking band -- a parent looking for the door and a parent booking a
 * visit want the same three facts. Inside the Clinic, Games, Parents' Corner,
 * FAQs, Laughing Gas and Parent Voices each own a route and are reachable from
 * the nav dropdown and the footer grid. Nothing on this page links to a
 * section this page does not render.
 *
 * `Hero` is a dispatcher and resolves to its mobile twin here.
 */
export function HomeMobile() {
  return (
    <SectionOrder ids={HOME_MOBILE_ORDER}>
      <Hero />
      <ServicesMobile />
      <TeamMobile />
      <BookBandMobile />
    </SectionOrder>
  )
}
