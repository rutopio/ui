import type { ReactNode } from "react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";

import { transitions } from "../motion/motion.js";
import { cn } from "../shared/utils.js";

const swap = (visible: boolean, reducedMotion: boolean | null) => ({
  opacity: visible ? 1 : 0,
  scale: reducedMotion || visible ? 1 : 0.85,
  filter: reducedMotion ? "none" : visible ? "blur(0px)" : "blur(4px)",
});

// Cross-fades an idle icon to a check on success: the two glyphs sit stacked and
// swap with a spring scale + blur, matching the mail-dialog feedback. Shared so
// every "copied!" affordance animates the same way. `idle` overrides the default
// copy glyph (e.g. a link icon).
export function CopyFeedbackIcon({
  copied,
  idle = <CopyIcon className="size-4" aria-hidden="true" />,
  className,
}: {
  copied: boolean;
  idle?: ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion
    ? transitions.gentleFade
    : transitions.iconSwap;

  return (
    <div className={cn("relative size-4", className)}>
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={swap(copied, reducedMotion)}
        transition={transition}
      >
        <CheckIcon className="size-4" aria-hidden="true" />
      </motion.span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={swap(!copied, reducedMotion)}
        transition={transition}
      >
        {idle}
      </motion.span>
    </div>
  );
}
