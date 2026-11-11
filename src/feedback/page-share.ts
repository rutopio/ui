import { useState } from "react"

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

export function usePageShare({
  fallbackUrl = "",
  onCopied,
  onCopyError,
}: {
  fallbackUrl?: string
  onCopied?: (url: string) => void
  onCopyError?: () => void
} = {}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const shareUrl =
    typeof window !== "undefined" ? window.location.href : fallbackUrl

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
      onCopied?.(shareUrl)
    } catch {
      onCopyError?.()
    }
  }

  const share = async () => {
    if (window.matchMedia("(pointer: coarse)").matches && navigator.share) {
      try {
        await navigator.share({ title: document.title, url: shareUrl })
      } catch (error) {
        if (!(error instanceof Error && error.name === "AbortError"))
          setOpen(true)
      }
      return
    }
    setOpen(true)
  }

  return {
    open,
    setOpen,
    copied,
    shareUrl,
    targets: getSocialShareTargets(shareUrl),
    copy,
    share,
  }
}
