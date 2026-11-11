import {
  useCallback,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../primitives/drawer.js"

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

export function SearchHighlight({
  text,
  ranges,
}: {
  text: string
  ranges: [number, number][]
}) {
  if (ranges.length === 0) return <>{text}</>
  const parts: ReactNode[] = []
  let cursor = 0
  for (const [start, end] of ranges) {
    if (start > cursor) parts.push(text.slice(cursor, start))
    parts.push(
      <mark
        key={start}
        className="rounded-sm bg-primary/20 px-0.5 text-foreground"
      >
        {" "}
        {text.slice(start, end)}{" "}
      </mark>,
    )
    cursor = end
  }
  if (cursor < text.length) parts.push(text.slice(cursor))
  return <>{parts}</>
}

export function SearchMobileDrawer({
  open,
  onOpenChange,
  inputRef,
  title,
  description,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  inputRef: RefObject<HTMLInputElement | null>
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[70dvh]" initialFocus={inputRef}>
        <DrawerHeader className="sr-only">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  )
}
