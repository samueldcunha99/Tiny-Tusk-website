import type { Config } from 'tailwindcss'

/**
 * Brand tokens. These four hexes are the authoritative palette from p23 of the
 * identity guide. Components must never contain a raw hex -- use these tokens.
 *
 * Note: the guide prints Canary Yellow as RGB 225,228,151 beside HEX #FFE497
 * (= 255,228,151). The hex is authoritative here. See docs/brand-coverage.md
 * FLAG 1. The guide's own illustration artwork also drifts (#1A5694, #FFE598,
 * #BFCEFF); all extracted art is snapped onto these values -- FLAG 3.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cobalt: {
          DEFAULT: '#18528E',
          // lighter tints of cobalt, for the "official / low playfulness"
          // cobalt-on-cobalt pairing (p26). Generated, not invented colours.
          80: '#46759F',
          60: '#7498B5',
          40: '#A3BBCF',
          20: '#D1DDE7',
        },
        coral: '#F16C59',
        canary: '#FFE497',
        powder: '#C1CBE7',
        paper: '#F7F7F7',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      fontSize: {
        // p20 scale, converted to a fluid ramp with the guide's tracking and
        // leading ratios preserved.
        display: ['clamp(4rem, 13vw, 13rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        h1: ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.125', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.5rem, 2.5vw, 2rem)', { lineHeight: '1.125', letterSpacing: '-0.01em' }],
        body: ['clamp(1rem, 1.2vw, 1.25rem)', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
      },
      maxWidth: { measure: '62ch' },
      transitionTimingFunction: {
        entrance: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transform: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
