import type { ReactNode } from "react";
import { FluidHoverControls } from "./fluid-hover-controls.js";
import { cn } from "./utils.js";

export function PageActionRail({
  label,
  mobileOutline,
  desktopOutline,
  actions,
}: {
  label: string;
  mobileOutline?: ReactNode;
  desktopOutline?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <>
      <FluidHoverControls
        buttonGroup
        orientation="horizontal"
        label={label}
        className={cn(
          "fixed right-4 bottom-[calc(2rem+env(safe-area-inset-bottom))] z-10 h-fit",
          "min-[50rem]:hidden",
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
          "hidden min-[50rem]:flex",
        )}
      >
        {desktopOutline}
        {actions}
      </FluidHoverControls>
    </>
  );
}
