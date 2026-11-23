"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import { useRef, type ReactNode, type RefObject } from "react";
import { cn } from "../../lib/class-names.js";

export type PopoverSide = "top" | "right" | "bottom" | "left";
export type PopoverAlign = "start" | "center" | "end";

export type PopoverProps = {
  trigger: ReactNode;
  children: ReactNode;
  label: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: PopoverSide;
  align?: PopoverAlign;
  offset?: number;
  padding?: number;
  arrowSize?: number;
  boundary?: RefObject<HTMLElement | null>;
  unstyledTrigger?: boolean;
  triggerClassName?: string;
  className?: string;
};

export function Popover({
  trigger,
  children,
  label,
  open,
  defaultOpen = false,
  onOpenChange,
  side = "bottom",
  align = "center",
  offset = 10,
  padding = 8,
  arrowSize = 9,
  boundary,
  unstyledTrigger = false,
  triggerClassName,
  className,
}: PopoverProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <BasePopover.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <BasePopover.Trigger
        ref={triggerRef}
        type="button"
        className={cn(
          !unstyledTrigger &&
            "inline-flex h-9 select-none items-center gap-2 rounded-[9px] border border-stone-200 bg-white px-3 font-semibold text-[16px] text-stone-700 outline-none transition-[border-color,box-shadow] duration-150 hover:border-stone-300 focus-visible:border-[#4568FF] focus-visible:shadow-[0_1px_2px_rgba(28,25,23,0.08),0_10px_20px_-14px_rgba(69,104,255,0.6)] dark:border-white/[0.16] dark:bg-[#1D1D1A] dark:text-stone-200 dark:focus-visible:border-[#93B0FF] dark:focus-visible:shadow-[0_10px_20px_-14px_rgba(147,176,255,0.5)] dark:hover:border-white/20",
          triggerClassName
        )}
      >
        {trigger}
      </BasePopover.Trigger>
      <BasePopover.Portal>
        <BasePopover.Positioner
          side={side}
          align={align}
          sideOffset={offset}
          collisionPadding={padding}
          collisionBoundary={boundary?.current ?? undefined}
          arrowPadding={11 + arrowSize / 2}
          positionMethod="fixed"
          className="z-50"
        >
          <BasePopover.Popup
            finalFocus={triggerRef}
            className={cn(
              "relative max-h-[calc(100dvh-1rem)] max-w-[calc(100vw-1rem)] origin-[var(--transform-origin)] rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md outline-none transition-[opacity,transform] duration-150 ease-out data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[instant]:transition-none motion-reduce:transition-none",
              className
            )}
          >
            <BasePopover.Arrow
              style={{ width: arrowSize, height: arrowSize }}
              className={(state) =>
                cn(
                  "block rotate-45 border-border bg-popover",
                  state.side === "bottom" &&
                    "-translate-y-1/2 border-t border-l",
                  state.side === "top" &&
                    "translate-y-1/2 border-r border-b",
                  state.side === "right" &&
                    "-translate-x-1/2 border-b border-l",
                  state.side === "left" &&
                    "translate-x-1/2 border-t border-r"
                )
              }
            />
            <BasePopover.Title className="sr-only">{label}</BasePopover.Title>
            <div className="relative max-h-[min(var(--available-height),calc(100dvh-3rem))] overflow-y-auto overscroll-contain">
              {children}
            </div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
