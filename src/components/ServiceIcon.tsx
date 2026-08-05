/**
 * One of the client's sixteen service icons, inlined.
 *
 * Inlined rather than `<img src>` on purpose: the cleaned files paint their
 * strokes with `currentColor` and their fills with the palette's custom
 * properties (see `tools/clean-service-icons.mjs`), and an <img> resolves
 * neither — it has no access to this document's `:root`. Inline, a tile tints
 * the whole icon by setting `color` and the coral/canary/powder accents come
 * through as drawn.
 *
 * The markup is a build-time asset from this repo, never user input, so
 * `dangerouslySetInnerHTML` is the honest way to mount it.
 */
const SOURCES = import.meta.glob<string>('../assets/service-icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const BY_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(SOURCES).map(([path, svg]) => [
    path.slice(path.lastIndexOf('/') + 1, -'.svg'.length),
    svg,
  ]),
)

export function ServiceIcon({
  slug,
  className,
  mono = false,
}: {
  slug: string
  className?: string | undefined
  /** Strip to a single white stroke at 33% — the guide's monochrome register (p27). */
  mono?: boolean | undefined
}) {
  const svg = BY_SLUG[slug]

  if (!svg) {
    // Same contract as the other dev-time guards: the call site is wrong, so
    // say which slug and let the page carry on without a hole in the layout.
    if (import.meta.env.DEV) {
      console.warn(`<ServiceIcon> unknown slug "${slug}". Known: ${Object.keys(BY_SLUG).join(', ')}`)
    }
    return null
  }

  return (
    <span
      aria-hidden="true"
      className={[
        'tt-service-icon block [&>svg]:h-full [&>svg]:w-full',
        mono ? 'tt-icon-mono' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
