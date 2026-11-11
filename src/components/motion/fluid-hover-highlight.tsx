"use client"

import {
  AnimatePresence,
  motion,
  type Transition,
  useReducedMotion,
} from "motion/react"
import type { HoverItemRect, UseFluidHoverResult } from "../../hooks/use-fluid-hover.js"
import { springPresets } from "../../lib/motion/spring-presets.js"
import { cn } from "../../lib/class-names.js"

// The container must establish the positioning context for these measured rects.

export type FluidHoverSource = Pick<
  UseFluidHoverResult,
  "activeIndex" | "itemRects" | "isMeasured" | "session"
>

interface HighlightFromHook {
  hover: FluidHoverSource
  /** Hide with an exit fade while retaining the list state. */
  hidden?: boolean
  rect?: never
  session?: never
}

interface HighlightFromRect {
  /** Container layout coordinates; null triggers the exit fade. */
  rect: HoverItemRect | null
  /** Key for restarting the entrance animation at `from` or the current rect. */
  session: number
  hover?: never
  hidden?: never
}

export type FluidHoverHighlightProps = (
  | HighlightFromHook
  | HighlightFromRect
) & {
  /** Initial rect for a new session, such as the selected row. */
  from?: HoverItemRect | null
  /** Disable when the highlight should appear to slide out of an already filled item. */
  fadeIn?: boolean
  className?: string
  /** False snaps position after reflow while retaining the opacity fade. */
  transition?: Transition | false
}

const fade: Transition = { duration: 0.08 }
const snap: Transition = { duration: 0 }

export function getHighlightAnimationTarget(rect: HoverItemRect) {
  return { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
}

export function resolveHighlightTransition(
  transition: Transition | false | undefined,
  reduceMotion: boolean,
): Transition {
  const positional =
    transition === false || reduceMotion ? snap : (transition ?? springPresets.fast)
  return { ...positional, opacity: fade }
}

export function resolveHighlightSource(props: FluidHoverHighlightProps): {
  rect: HoverItemRect | null
  session: number
} {
  if (props.hover) {
    const { activeIndex, itemRects, isMeasured, session } = props.hover
    const rect =
      !props.hidden && isMeasured && activeIndex !== null
        ? (itemRects[activeIndex] ?? null)
        : null
    return { rect, session }
  }
  return { rect: props.rect, session: props.session }
}

export function FluidHoverHighlight(props: FluidHoverHighlightProps) {
  const { from, fadeIn = true, className, transition } = props
  const { rect, session } = resolveHighlightSource(props)
  // Respect reduced motion even when the consuming app has no MotionConfig.
  const reduceMotion = useReducedMotion() ?? false
  return (
    <AnimatePresence>
      {rect && (
        <motion.div
          key={session}
          data-slot="fluid-hover-highlight"
          // Translate position to avoid layout work during travel.
          className={cn(
            "pointer-events-none absolute top-0 left-0 bg-hover",
            className,
          )}
          initial={{ opacity: fadeIn ? 0 : 1, ...getHighlightAnimationTarget(from ?? rect) }}
          animate={{ opacity: 1, ...getHighlightAnimationTarget(rect) }}
          exit={{ opacity: 0, transition: springPresets.fast.exit }}
          transition={resolveHighlightTransition(transition, reduceMotion)}
        />
      )}
    </AnimatePresence>
  )
}
