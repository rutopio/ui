export { useActiveOutlineId } from "../../hooks/use-active-outline-id.js";
import type { OutlineItem } from "../../types/outline.js";
export type { OutlineItem } from "../../types/outline.js";
import { useActiveOutlineId } from "../../hooks/use-active-outline-id.js";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";

import { ActionMenu } from "./action-menu.js";
import { motionTransitions } from "../../lib/motion/motion-tokens.js";
import { cn } from "../../lib/class-names.js";

const RING_CIRCUMFERENCE = 2 * Math.PI * 6.25;

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
        transition={reducedMotion ? motionTransitions.instant : motionTransitions.progress}
      />
    </svg>
  );
}

export function OutlineMenu({
  items,
  ariaLabel,
  pageProgress,
  sectionProgress,
  className,
}: {
  items: OutlineItem[];
  ariaLabel: string;
  pageProgress: number;
  sectionProgress: Record<string, number>;
  className?: string;
}) {
  const activeId = useActiveOutlineId(items, sectionProgress);

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
