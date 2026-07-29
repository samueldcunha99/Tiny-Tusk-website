export const CONCERNS = ['First visit', 'A toothache or break', 'A check-up', 'Brushing or toothpaste advice'] as const
export const TIMES = ['Morning', 'After school', 'Saturday morning', 'Please call me to talk it through'] as const
export const BOOKING_STEPS = [
  'A few basics',
  'What brings you in',
  'A time that might suit',
  'How to reach you',
] as const

export interface BookingValues {
  childName: string
  childAge: string
  concern: string
  preferredTime: string
  parentName: string
  phone: string
  email: string
}

export const EMPTY_BOOKING: BookingValues = { childName: '', childAge: '', concern: '', preferredTime: '', parentName: '', phone: '', email: '' }
