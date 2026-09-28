import { SITE_URL } from '@/content/site'

/**
 * Google Preferred Sources button (Google Search personalization & AI Overviews).
 *
 * Uses Google's official interactive publisher script (`https://news.google.com/swg/js/v1/publisher.js`)
 * with a styled pill fallback link so it renders cleanly and works across all environments
 * (local development, prerendered SSR, and live production).
 */
export function GooglePreferredSourceButton({
  theme = 'light',
  className = '',
}: {
  theme?: 'light' | 'dark' | undefined
  className?: string | undefined
}) {
  const domain = SITE_URL.replace(/^https?:\/\//, '')
  const href = `https://www.google.com/preferences/source?q=${domain}`

  return (
    <div
      {...{ 'google-add-preferred-source-btn': '' }}
      data-theme={theme}
      className={`inline-flex ${className}`}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-[38px] items-center gap-2.5 rounded-full bg-white px-4 py-1.5 font-sans text-[0.84rem] font-semibold text-[#3c4043] shadow-sm transition-all duration-200 hover:bg-[#f8f9fa] hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canary"
        aria-label="Add Tiny Tusk to your Google Preferred Sources"
        title="Add Tiny Tusk to your Google Preferred Sources"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.13C3.26 21.36 7.36 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.14-1.54.38-2.26V6.61H1.24C.45 8.18 0 9.95 0 12s.45 3.82 1.24 5.39l4.04-3.13z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.24 6.61l4.04 3.13c.95-2.84 3.6-4.99 6.72-4.99z"
          />
        </svg>
        <span>Add to Preferred Sources</span>
      </a>
    </div>
  )
}
