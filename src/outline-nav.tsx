import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

import { ActionMenu } from "./action-menu.js";
import { transitions } from "./motion.js";
import { cn } from "./utils.js";

const RING_CIRCUMFERENCE = 2 * Math.PI * 6.25;

// A flat outline entry shared by the side dropdown and the mobile drawer.
export interface OutlineItem {
  id: string;
  label: string;
  href: string; // "#id"
  depth: 2 | 3;
}

// Text outline shown in the mobile drawer: full labels, the active one bolded.
// Compute the deepest entered item from reading progress.
export function useOutlineActive(
  items: OutlineItem[],
  progress: Record<string, number>,
): string {
  return useMemo(() => {
    let active = items[0]?.id ?? "";
    for (const item of items) {
      if ((progress[item.id] ?? 0) > 0) active = item.id;
    }
    return active;
  }, [items, progress]);
}

export function ReadingProgressRing({ progress }: { progress: number }) {
  const reducedMotion = useReducedMotion();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={cn("size-4", "-rotate-90")}
    >
      <circle
        cx="8"
        cy="8"
        r="6.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-20"
      />
      <motion.circle
        cx="8"
        cy="8"
        r="6.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={RING_CIRCUMFERENCE}
        initial={false}
        animate={{ strokeDashoffset: (1 - progress) * RING_CIRCUMFERENCE }}
        transition={reducedMotion ? transitions.instant : transitions.progress}
      />
    </svg>
  );
}

// An action-rail progress ring reveals a single-level heading dropdown.
export function OutlineNav({
  items,
  ariaLabel,
  pageProgress,
  progress,
  className,
}: {
  items: OutlineItem[];
  ariaLabel: string;
  pageProgress: number;
  progress: Record<string, number>;
  className?: string;
}) {
  const activeId = useOutlineActive(items, progress);

  if (items.length === 0) return null;

  return (
    <ActionMenu
      label={ariaLabel}
      triggerLabel={`${Math.round(pageProgress * 100)}% read. ${ariaLabel}`}
      trigger={<ReadingProgressRing progress={pageProgress} />}
      side="left"
      openOnHover
      className={className}
      indicator={<ArrowLeftIcon className="size-4" aria-hidden="true" />}
      items={items.map((item) => ({
        id: item.id,
        label: item.label,
        depth: item.depth,
        href: item.href,
        active: item.id === activeId,
        ariaCurrent: item.id === activeId ? ("location" as const) : undefined,
      }))}
    />
  );
}
