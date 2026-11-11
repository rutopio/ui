import { useCallback, useRef, useState } from "react"

export function useSearchCommand({
  open: openProp,
  onOpenChange,
  onOpen,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onOpen?: () => void
} = {}) {
  const [openState, setOpenState] = useState(false)
  const open = openProp ?? openState
  const openRef = useRef(open)
  openRef.current = open
  const setOpen = useCallback(
    (value: boolean | ((open: boolean) => boolean)) => {
      const next = typeof value === "function" ? value(openRef.current) : value
      if (next) onOpen?.()
      if (openProp === undefined) setOpenState(next)
      onOpenChange?.(next)
    },
    [onOpen, onOpenChange, openProp],
  )
  const setOpenRef = useRef(setOpen)
  setOpenRef.current = setOpen

  // A global key handler needs one subscription; the ref keeps it current.
  const subscribeShortcut = useCallback(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpenRef.current((current) => !current)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  return { open, setOpen, subscribeShortcut }
}

