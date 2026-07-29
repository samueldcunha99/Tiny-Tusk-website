/**
 * A consistent chapter-edge marker for standalone marketing pages.
 *
 * Coral already appears inside the content system through cards, CTAs and
 * doodles. Keeping this route-level accent to one edge rule avoids introducing
 * a floating graphic field that is disconnected from each page's layout.
 */
export function CoralPageAccent() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-2 bg-coral"
      aria-hidden="true"
    />
  )
}
