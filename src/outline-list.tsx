import type { ReactNode } from "react"
import { cn } from "./utils.js"

export type OutlineListItem = {
  id: string
  label: string
  depth: 2 | 3
  href?: string
}

export function OutlineList({
  items,
  activeId,
  onNavigate,
  indicator,
  className,
}: {
  items: OutlineListItem[]
  activeId: string
  onNavigate?: (id: string) => void
  indicator: ReactNode
  className?: string
}) {
  return (
    <ul className={cn("flex flex-col gap-1", className)}>
      {items.map((item) => {
        const active = activeId === item.id
        return (
          <li key={item.id}>
            <a
              href={item.href ?? `#${encodeURIComponent(item.id)}`}
              data-active={active || undefined}
              aria-current={active ? "location" : undefined}
              onClick={(event) => {
                if (!onNavigate) return
                event.preventDefault()
                onNavigate(item.id)
              }}
              className="flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-base text-foreground focus-visible:outline-2 focus-visible:outline-ring aria-[current=location]:bg-muted"
            >
              <span className={cn("min-w-0", item.depth === 3 && "pl-6")}>{item.label}</span>
              <span className={cn("flex size-4 shrink-0 items-center justify-center", !active && "invisible")} aria-hidden="true">{indicator}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
