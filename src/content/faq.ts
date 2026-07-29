export interface FaqItem { question: string; answer: string }

export const FAQS: readonly FaqItem[] = [
  { question: 'When should my child first come in?', answer: 'Around their first birthday, or when the first tooth appears. It is mostly a gentle look and a chance to make the room familiar.' },
  { question: 'Can I stay with them?', answer: 'Always. Your child can sit with you, hold your hand, or have you nearby while they find their feet.' },
  { question: 'What if they will not open their mouth?', answer: 'That is completely okay. We do not force a visit into one appointment. Sometimes the win is simply sitting in the chair and coming back feeling safe.' },
  { question: 'Do you see dental emergencies?', answer: 'Yes. Call us for pain, a break, swelling, or a knocked-out tooth and we will talk you through the next step and find the earliest appropriate slot.' },
] as const
