export function getSocialShareTargets(url: string) {
  const encodedUrl = encodeURIComponent(url)
  return [
    {
      label: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    { label: "X", url: `https://twitter.com/intent/tweet?url=${encodedUrl}` },
    {
      label: "Threads",
      url: `https://www.threads.net/intent/post?url=${encodedUrl}`,
    },
  ] as const
}

export function openShareWindow(url: string) {
  window.open(url, "_blank", "noopener,noreferrer,width=600,height=600")
}

export async function shareOrCopyCurrentPage({
  onCopied,
  onShareError,
  onCopyError,
}: {
  onCopied: () => void
  onShareError: () => void
  onCopyError: () => void
}) {
  const url = window.location.href
  if (window.matchMedia("(pointer: coarse)").matches && navigator.share) {
    try {
      await navigator.share({ title: document.title, url })
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError"))
        onShareError()
    }
    return
  }
  try {
    await navigator.clipboard.writeText(url)
    onCopied()
  } catch {
    onCopyError()
  }
}
