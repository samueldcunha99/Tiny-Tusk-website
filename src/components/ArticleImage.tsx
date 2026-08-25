import { useState } from 'react'
import { Doodle } from './Doodle'
import type { ParentArticle } from '@/content/parents'

/**
 * A Parents' Corner photograph, or the placeholder that stands in for one.
 *
 * TWO WAYS TO END UP AT THE PLACEHOLDER, and they mean the same thing to a
 * visitor: `image: null` in `content/parents.ts` (the clinic has not shot it
 * yet -- posts 5 and 6), or a path whose file is not in `public/images/blog/`
 * yet, caught by `onError`. The second is what lets the content file be right
 * before the photographs land, instead of a page full of broken-image icons.
 *
 * Shared by the card grid and the article page, which is the only reason it is
 * a component rather than markup in one of them.
 */
export function ArticleImage({
  image,
  className = 'aspect-[4/3]',
  eager = false,
}: {
  image: ParentArticle['image']
  className?: string | undefined
  /** The article page's own photograph is above the fold; cards are not. */
  eager?: boolean | undefined
}) {
  const [failed, setFailed] = useState(false)

  if (!image || failed) {
    return (
      <div
        className={`flex w-full flex-col items-center justify-center gap-2 bg-powder px-6 text-center ${className}`}
      >
        <Doodle name="doodleFace" tone="cobalt" className="w-8" />
        <p className="font-sans text-[0.75rem] leading-relaxed text-cobalt">
          Clinic photograph on its way.
        </p>
      </div>
    )
  }

  return (
    <img
      src={image.src}
      alt={image.alt}
      onError={() => setFailed(true)}
      className={`w-full object-cover ${className}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}
