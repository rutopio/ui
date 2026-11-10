import type { ReactNode } from "react"
import { FluidHoverControls } from "./fluid-hover-controls.js"
import { cn } from "./utils.js"

export function PageActionRail({
  label,
  mobileOutline,
  desktopOutline,
  actions,
  desktopVisible,
}: {
  label: string
  mobileOutline?: ReactNode
  desktopOutline?: ReactNode
  actions: ReactNode
  /** Omit for the standard 50rem breakpoint. Supply a measured gutter result when the rail depends on available space. */
  desktopVisible?: boolean
}) {
  return (
    <>
      <FluidHoverControls
        buttonGroup
        orientation="horizontal"
        label={label}
        className={cn(
          "fixed right-4 bottom-[calc(2rem+env(safe-area-inset-bottom))] z-10 h-fit",
          desktopVisible === undefined
            ? "min-[50rem]:hidden"
            : desktopVisible && "hidden",
        )}
      >
        {mobileOutline}
        {actions}
      </FluidHoverControls>
      <FluidHoverControls
        buttonGroup
        orientation="vertical"
        label={label}
        className={cn(
          "fixed top-1/2 left-[var(--gutter-offset)] z-10 h-fit -translate-y-1/2",
          desktopVisible === undefined
            ? "hidden min-[50rem]:flex"
            : !desktopVisible && "hidden",
        )}
      >
        {desktopOutline}
        {actions}
      </FluidHoverControls>
    </>
  )
}
