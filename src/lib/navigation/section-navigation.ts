let pendingScroll: number | undefined

export function scrollToSection(id: string, onBeforeNavigate?: () => void) {
  onBeforeNavigate?.()
  window.clearTimeout(pendingScroll)
  const sourceUrl = window.location.href
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches
  pendingScroll = window.setTimeout(
    () => {
      pendingScroll = undefined
      if (window.location.href !== sourceUrl) return
      const heading = document.getElementById(id)
      if (!heading) return
      heading.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" })
      history.replaceState(null, "", `#${encodeURIComponent(id)}`)
    },
    reduceMotion ? 0 : 350,
  )
}

export async function copySectionLink(
  id: string,
  onCopied?: () => void,
  onError?: () => void,
) {
  const url = new URL(window.location.href)
  url.hash = id
  try {
    await navigator.clipboard.writeText(url.href)
    onCopied?.()
  } catch {
    onError?.()
  }
}
