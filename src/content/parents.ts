/**
 * Parents' Corner -- the blog. Seven posts, topics supplied verbatim by the
 * clinic (Dr. Nupur, 2026-08-26); the question she wrote IS the headline.
 *
 * VOICE: parent-to-parent, plain-spoken, never babyish and never alarmist.
 * CLAIMS: general, well-established pediatric guidance only. No prices, no
 * statistics, no case histories, nothing specific to a child we have not seen.
 * A post that needs a real clinic fact gets a TODO comment HERE, never a
 * rendered string (CLAUDE.md 1).
 *
 * IMAGES: the client supplied photographs for five of the seven. They belong
 * in `public/images/blog/` at the paths below. Posts 5 and 6 want clinic
 * photographs that do not exist yet, so their `image` is `null` on purpose and
 * the article renders the placeholder tile -- do not fill them with stock.
 * A path that is not on disk yet degrades to the same tile rather than a
 * broken image, so this file can be correct before the files arrive.
 */
export type ParentCategory = 'Guides' | 'Routines' | 'Visits' | 'Clinic' | 'Treatments'

export interface ParentSection {
  heading: string
  paragraphs: readonly string[]
  points?: readonly string[]
}

export interface ParentArticle {
  /** Also the URL: /parents-corner/<id>. */
  id: string
  category: ParentCategory
  /** The client's question, verbatim. The card headline and the article h1. */
  question: string
  summary: string
  fill: 'canary' | 'powder' | 'coral'
  image: { src: string; alt: string } | null
  intro: string
  sections: readonly ParentSection[]
  /** The line above the booking CTA. */
  closing: string
}

export const PARENT_ARTICLES: readonly ParentArticle[] = [
  {
    id: 'baby-teeth-cavities',
    category: 'Guides',
    question: "Baby teeth cavities: do they really need treatment if they'll fall out anyway?",
    summary: 'They do fall out, yes. But not for years, and a great deal happens in the meantime.',
    fill: 'canary',
    image: {
      src: '/images/blog/baby-teeth-cavities.jpg',
      alt: 'Front baby teeth with dark brown decay along the gumline.',
    },
    intro:
      'It is one of the most reasonable questions a parent can ask, and we hear it often. If the tooth is temporary, why treat it? The short answer is that a baby tooth is temporary the way a school year is temporary. It ends, but a lot depends on how it goes.',
    sections: [
      {
        heading: 'They are here longer than you think',
        paragraphs: [
          'The first baby teeth arrive around six months. The last of them are usually still in place at eleven or twelve. A cavity in a two-year-old is not a problem that sorts itself out in a few months, it is a problem your child lives with through most of primary school.',
        ],
      },
      {
        heading: 'What they are doing while they are here',
        paragraphs: ['A baby tooth is not just a placeholder. It is doing work.'],
        points: [
          'Chewing, which is how your child gets comfortably through a meal.',
          'Speech, because sounds are shaped against the teeth.',
          'Holding space for the adult tooth growing underneath. Lose one early and the neighbouring teeth drift into the gap, so the adult tooth arrives to find its place taken.',
        ],
      },
      {
        heading: 'What an untreated cavity actually does',
        paragraphs: [
          'Decay does not stay still. It works inwards, and when it reaches the nerve it hurts, often at night, often before a child can explain what is wrong. Infection can follow, and an infection sitting above a developing adult tooth is not something to wait out.',
          'The everyday version is quieter and far more common: a child who chews on one side, avoids cold things, sleeps badly, or is out of sorts at school for a reason nobody has connected to a tooth.',
        ],
      },
      {
        heading: 'The part that is genuinely good news',
        paragraphs: [
          'Caught early, this is small. A chalky white patch at the gumline is decay that has not broken through yet, and at that stage the answer is often fluoride, one change at the sink, and keeping an eye on it. No drill, no fuss.',
          'Caught late, the same tooth needs considerably more. The difference between the two is usually one checkup.',
        ],
      },
      {
        heading: 'When to call us',
        paragraphs: [
          'If you can see a white, brown or black mark on a tooth, if your child says a tooth hurts, or if they have started eating differently, book a look. Nothing is lost by finding out it was nothing.',
        ],
      },
    ],
    closing: 'Spotted something and not sure what it is? Bring it in and we will look together.',
  },
  {
    id: 'first-dental-visit',
    category: 'Visits',
    question: 'At what age should I take my child to the dentist for the first time?',
    summary: 'First tooth or first birthday, whichever comes first. Here is why that early.',
    fill: 'powder',
    image: {
      src: '/images/blog/first-dental-visit.jpg',
      alt: 'A smiling baby with the first two lower teeth showing.',
    },
    intro:
      'Most parents expect the answer to be three or four, once a child can sit still and follow instructions. It is earlier than that. The first visit belongs around the first tooth, or the first birthday, whichever arrives first.',
    sections: [
      {
        heading: 'Why so early, when there is barely a tooth',
        paragraphs: [
          'Because a visit at that age is not really about the teeth. It is about the routine around them: how you clean two teeth, what to do about bottles and night feeds, what teething looks like when it is ordinary and when it is not, and what to expect over the coming year.',
          'It is also the visit where nothing hurts, nothing needs doing, and nobody is worried. That matters more than it sounds.',
        ],
      },
      {
        heading: 'The first visit sets the tone for every one after it',
        paragraphs: [
          'A child whose first experience of a dental chair was a friendly five minutes at eighteen months has a very different relationship with the place than a child whose first visit came at five, in pain, for something that had to be fixed that day.',
          'We would much rather your child met us while there was nothing to fix.',
        ],
      },
      {
        heading: 'What actually happens',
        paragraphs: ['For a baby or a toddler it is short and low-key.'],
        points: [
          'Your child sits on your lap, or with you right beside the chair.',
          'A gentle look at the teeth and gums, counting them out loud.',
          'A conversation with you about brushing, feeding and habits.',
          'Time to ask everything you have been meaning to ask.',
        ],
      },
      {
        heading: 'If your child is already older than that',
        paragraphs: [
          'Then the right time is now, not some ideal age that has passed. There is no lecture waiting. Come in, let us have a look, and we will start from wherever you are.',
        ],
      },
    ],
    closing: 'First tooth, first birthday, or the first time you thought about it. Any of those is a good reason to book.',
  },
  {
    id: 'thumb-sucking-and-pacifiers',
    category: 'Routines',
    question: 'Thumb sucking and pacifier use: when to worry',
    summary: 'Normal for a while, worth watching after a point. Where that line actually sits.',
    fill: 'coral',
    image: {
      src: '/images/blog/thumb-sucking-and-pacifiers.jpg',
      alt: 'A young child sucking their thumb.',
    },
    intro:
      'Sucking is a comfort reflex babies are born with, and for the first couple of years it is simply what small children do when they are tired, bored or unsettled. It is not a bad habit at that stage. It becomes worth watching later, and the timing matters more than the habit itself.',
    sections: [
      {
        heading: 'The normal window',
        paragraphs: [
          'Most children give up thumbs and pacifiers on their own somewhere between two and four, as other ways of settling themselves take over. If your one-year-old sucks a thumb at bedtime, that is not a dental problem, and treating it as one usually backfires.',
        ],
      },
      {
        heading: 'What changes as the adult teeth arrive',
        paragraphs: [
          'Sustained sucking puts steady pressure on the teeth and on the shape of the palate. While everything is still baby teeth, that pressure tends to ease off once the habit stops. Once the permanent front teeth are coming through, around five or six, the same pressure has something far more permanent to push against.',
          'That is the point where it stops being a comfort habit and starts being a bite question.',
        ],
      },
      {
        heading: 'Signs worth mentioning to us',
        paragraphs: [],
        points: [
          'The front teeth do not meet when your child bites down, leaving a visible gap.',
          'The top front teeth are angling forwards.',
          'Your child sucks hard enough that the cheeks pull in, or there is a callus on the thumb.',
          'The habit is still going strong past four, or runs through the day rather than just at bedtime.',
        ],
      },
      {
        heading: 'What helps, and what does not',
        paragraphs: [
          'Shaming does not work, and neither does pulling the thumb out mid-sleep. What tends to work is noticing when it happens, offering the same comfort another way at those moments, and letting your child be part of the plan rather than the subject of it. Small visible progress beats a deadline.',
          'If a habit needs more than that, there are gentle options we can talk through. We would rather look first than have you fight it alone.',
        ],
      },
    ],
    closing: 'Bring it up at the next checkup and we will tell you honestly whether it needs anything yet.',
  },
  {
    id: 'early-signs-of-decay',
    category: 'Guides',
    question: 'Signs of tooth decay in toddlers parents often miss',
    summary: 'Decay rarely starts as a hole. It starts as something much easier to overlook.',
    fill: 'canary',
    image: {
      src: '/images/blog/early-signs-of-decay.jpg',
      alt: 'Upper front baby teeth with arrows pointing to chalky white patches along the gumline.',
    },
    intro:
      'Everyone knows to look for a hole. By the time there is a hole, the decay has been underway for a while. The early signs are quieter, and they are the ones worth learning, because that is the stage where very little needs to be done.',
    sections: [
      {
        heading: 'The chalky white line at the gumline',
        paragraphs: [
          'This is the one parents miss most. A dull, chalky band where the tooth meets the gum, usually on the upper front teeth, easiest to see when the teeth are dry. It does not look like damage, it looks like a smudge. It is enamel losing minerals, and it is the last stage that can still be turned around.',
        ],
      },
      {
        heading: 'Colour that is not quite right',
        paragraphs: [
          'Yellow, brown or grey shading, often starting near the gumline or in the grooves of the back teeth. A dark line between two teeth can be decay sitting exactly where a toothbrush never reaches.',
        ],
      },
      {
        heading: 'Changes in how your child eats',
        paragraphs: ['Small children rarely say a tooth hurts. They change their behaviour instead.'],
        points: [
          'Chewing on one side, or refusing food they used to like.',
          'Flinching at cold water, ice cream, or sweet things.',
          'Eating slowly, or leaving harder foods on the plate.',
          'Broken sleep with no obvious cause.',
        ],
      },
      {
        heading: 'Breath and gums',
        paragraphs: [
          'Persistent bad breath in a child who brushes, or gums that are puffy and red along one tooth, are both worth a look. So is a small bump on the gum above a tooth, which should always be seen quickly.',
        ],
      },
      {
        heading: 'How to check at home',
        paragraphs: [
          'Once a week, lift the top lip and look along the gumline in good light. It takes ten seconds. That single spot is where early decay in toddlers shows up first, and it is also the area a quick brush at the end of a long day is most likely to skip.',
        ],
      },
    ],
    closing: 'Seen something you are unsure about? A photo on your phone and a short visit will settle it.',
  },
  {
    id: 'inside-tiny-tusk',
    category: 'Clinic',
    question: 'A day inside Tiny Tusk Dental, Kharghar: what makes a clinic kid-friendly',
    summary: 'Not the mural on the wall. The smaller things that decide how a visit actually goes.',
    fill: 'powder',
    // TODO: clinic photographs. The client is supplying these once the space is
    // finished; until then this renders the placeholder tile. Do not substitute
    // stock photography for a clinic that is not open yet.
    image: null,
    intro:
      'A kid-friendly clinic is not a clinic with a mural. Plenty of places have the mural. What decides how a visit goes is smaller and less photogenic than that, and most of it happens before anyone looks at a tooth.',
    sections: [
      {
        heading: 'Nothing happens before it is explained',
        paragraphs: [
          'Every instrument is shown, named and tried out on a finger or a nail before it goes anywhere near a mouth. Children are not frightened of the chair, they are frightened of not knowing what is about to happen. Take that away and most of the fear goes with it.',
        ],
      },
      {
        heading: 'The visit runs at your child’s pace',
        paragraphs: [
          'Some children climb into the chair at minute one. Some need to watch a parent sit in it first, then look at everything, then decide. Both are fine. A visit that ends with a child still willing to come back has done its job, even if not everything on the list got done that day.',
        ],
      },
      {
        heading: 'You stay where your child can see you',
        paragraphs: [
          'Parents are not sent off to a waiting room. For the youngest children the appointment often happens with them on your lap. You are the thing in the room that makes it safe.',
        ],
      },
      {
        heading: 'Built at child height',
        paragraphs: [
          'Small chairs, low counters, things placed where a four-year-old can reach them, and somewhere to sit that is not a row of adult chairs. It is a quiet signal, and children read it immediately: this place expects me.',
        ],
      },
      {
        heading: 'It ends on a good note',
        paragraphs: [
          'Whatever happened during the appointment, it finishes with something to be pleased about. The next visit is being built during this one.',
        ],
      },
    ],
    closing: 'Come and see it for yourself. A first visit is mostly a conversation.',
  },
  {
    id: 'choosing-a-pediatric-dentist',
    category: 'Guides',
    question: 'Choosing a pediatric dentist in Kharghar or Navi Mumbai: what to look for',
    summary: 'A short, honest checklist for a decision most parents only make once.',
    fill: 'coral',
    // TODO: clinic photographs, as above.
    image: null,
    intro:
      'There are good dentists all over Navi Mumbai, and most of them are perfectly capable of looking at a child’s teeth. Choosing a pediatric practice is a slightly different question: you are choosing how your child will feel about dentistry for the next twenty years. Here is what we would look at.',
    sections: [
      {
        heading: 'Training in children specifically',
        paragraphs: [
          'Pediatric dentistry is its own postgraduate specialisation. It covers growth and development, behaviour, and the treatments that only apply to a mouth still changing shape. Ask directly whether the dentist is trained in it. It is a fair question, and any practice should be glad to answer it.',
        ],
      },
      {
        heading: 'How they handle a first visit',
        paragraphs: [
          'Ask what happens at a first appointment for a two-year-old. If the answer involves showing, explaining, and going at the child’s pace, that is a practice that has thought about children. If the answer is a list of procedures, it may not be.',
        ],
      },
      {
        heading: 'Whether prevention is genuinely the plan',
        paragraphs: [
          'A pediatric practice should spend real time on brushing, diet, fluoride and sealants, and should be willing to watch an early white spot rather than treat it on the spot. Treatment your child did not need is still treatment your child sat through.',
        ],
      },
      {
        heading: 'Practical things that matter more than you expect',
        paragraphs: [],
        points: [
          'How far it is on a school night, and whether parking is a fight.',
          'What happens if a tooth gets knocked out on a Sunday.',
          'Whether you are allowed to stay in the room.',
          'Whether costs are explained before anything starts.',
        ],
      },
      {
        heading: 'Trust your own read of the room',
        paragraphs: [
          'Visit once before you commit to anything. Watch how the team talks to your child rather than to you. Children are unusually good at telling whether someone likes them, and on this one they are worth listening to.',
        ],
      },
    ],
    closing: 'Come in, ask us anything on this list, and decide afterwards.',
  },
  {
    id: 'fluoride-varnish',
    category: 'Treatments',
    question: 'Fluoride varnish at the dentist: what it is and why we recommend it',
    summary: 'A minute of painting on the teeth, and one of the few things that can reverse early decay.',
    fill: 'canary',
    image: {
      src: '/images/blog/fluoride-varnish.jpg',
      alt: 'Two photographs side by side. Left: fluoride varnish being painted onto a child’s teeth, captioned “Fluoride varnish is painted on the teeth”. Right: a healthy smile, captioned “Teeth remain strong and healthy as a result”.',
    },
    intro:
      'Fluoride varnish is a small, sticky coating painted onto the teeth at a checkup. It takes about a minute, it does not hurt, and it is one of the few things in dentistry that can strengthen a tooth which has already begun to weaken.',
    sections: [
      {
        heading: 'What it actually is',
        paragraphs: [
          'A concentrated fluoride in a resin base that sets on contact with saliva, so it stays put instead of being swallowed or rinsed away. It is brushed on with a small applicator, tooth by tooth. Children usually find it more interesting than unpleasant.',
        ],
      },
      {
        heading: 'What it does',
        paragraphs: [
          'Enamel is constantly losing and regaining minerals. Fluoride shifts that balance towards regaining them, hardens the surface against acid, and slows the bacteria producing that acid.',
          'This is why an early white spot is often treated with varnish and one change at the sink rather than a filling. At that stage the tooth can still repair itself, and varnish is what tips it.',
        ],
      },
      {
        heading: 'What the appointment looks like',
        paragraphs: [],
        points: [
          'The teeth are dried with gauze or a soft brush.',
          'The varnish is painted on. About a minute for a full set.',
          'It sets straight away. Your child can talk, drink water, and get on with the day.',
          'The teeth may look faintly yellow or dull for a few hours. That is the coating, and it brushes off.',
        ],
      },
      {
        heading: 'Afterwards',
        paragraphs: [
          'Soft food and no hot drinks for a few hours, and skip brushing until the next morning so the varnish gets its full time on the tooth. We will tell you exactly when to brush again before you leave.',
        ],
      },
      {
        heading: 'How often',
        paragraphs: [
          'Usually at routine checkups, and more often for a child at higher risk of decay. It is not a substitute for brushing and it is not a one-time fix. It is one steady, low-effort thing that keeps a small problem from becoming a big one.',
        ],
      },
    ],
    closing: 'Ask us about varnish at your next visit, or book one and we will look at whether it is worth doing now.',
  },
] as const

/** Look an article up by its slug. `undefined` means the route should 404. */
export function parentArticle(id: string): ParentArticle | undefined {
  return PARENT_ARTICLES.find((a) => a.id === id)
}
