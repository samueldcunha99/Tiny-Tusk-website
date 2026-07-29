import { useEffect } from 'react'

interface RouteMetaProps {
  title: string
  description: string
  noIndex?: boolean | undefined
}

function setNamedMeta(name: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.name = name
    document.head.appendChild(element)
  }
  element.content = content
}

function setPropertyMeta(property: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  )
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }
  element.content = content
}

export function RouteMeta({ title, description, noIndex = false }: RouteMetaProps) {
  useEffect(() => {
    document.title = title
    setNamedMeta('description', description)
    setNamedMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow')
    setNamedMeta('twitter:title', title)
    setNamedMeta('twitter:description', description)
    setPropertyMeta('og:title', title)
    setPropertyMeta('og:description', description)
  }, [description, noIndex, title])

  return null
}
