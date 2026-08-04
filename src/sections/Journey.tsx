import { useIsMobile } from '@/lib/viewport'
// Aliased so `Journey.desktop.tsx` keeps its original export name and stays
// exactly the file that shipped. The pinned horizontal track is desktop-only.
import { Journey as JourneyDesktop } from './Journey.desktop'
import { JourneyMobile } from './Journey.mobile'

export function Journey({ asPage = false }: { asPage?: boolean | undefined }) {
  return useIsMobile() ? <JourneyMobile asPage={asPage} /> : <JourneyDesktop asPage={asPage} />
}
