export interface Testimonial { quote: string; parent: string; child: string }

export const TESTIMONIALS: readonly Testimonial[] = [
  { quote: 'They spoke to my daughter, not over her. She came out proud of herself.', parent: 'Amelia, parent of Ivy', child: 'First visit' },
  { quote: 'We finally have a brushing routine that does not end in a negotiation.', parent: 'Sam, parent of Theo', child: 'Home care visit' },
  { quote: 'Clear advice, no fuss, and a team that remembered what worried him last time.', parent: 'Nadia, parent of Yusuf', child: 'Review visit' },
  { quote: 'Our son asked when he could go back. I did not see that coming.', parent: 'Tom, parent of Finn', child: 'First visit' },
] as const
