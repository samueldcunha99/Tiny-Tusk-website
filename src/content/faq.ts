export type FaqCategory = 'Visits' | 'At home' | 'Support'

export interface FaqItem {
  question: string
  answer: string
  category: FaqCategory
}

export const FAQS: readonly FaqItem[] = [
  { question: 'When should my child first come in?', answer: 'Around their first birthday, or when the first tooth appears. It is mostly a gentle look and a chance to make the room familiar.', category: 'Visits' },
  { question: 'Can I stay with them?', answer: 'Always. Your child can sit with you, hold your hand, or have you nearby while they find their feet.', category: 'Support' },
  { question: 'What if they will not open their mouth?', answer: 'That is completely okay. We do not force a visit into one appointment. Sometimes the win is simply sitting in the chair and coming back feeling safe.', category: 'Support' },
  { question: 'Do you see dental emergencies?', answer: 'Yes. Call us for pain, a break, swelling, or a knocked-out tooth and we will talk you through the next step and find the earliest appropriate slot.', category: 'Visits' },
  { question: 'How can I prepare my child for their visit at home?', answer: 'Keep it casual and positive! Read storybooks about going to the dentist, practice opening wide together like a lion, and let them know we are going to count their teeth.', category: 'At home' },
  { question: 'What kind of toothpaste should we use at home?', answer: 'Use a age-appropriate fluoride toothpaste with a pea-sized smear for toddlers, or a tiny rice-grain dab for babies under two.', category: 'At home' },
  { question: 'Do you treat children who are very anxious or have special needs?', answer: 'Yes, absolutely. Our whole clinic and approach are designed around neurodiversity, sensory comfort, and pacing every visit at your child’s speed.', category: 'Support' },
  { question: 'How often should my child visit for check-ups?', answer: 'We usually recommend coming by every 6 months to check on growing teeth, refresh fluoride protection, and keep visits feeling routine and stress-free.', category: 'Visits' },
] as const
