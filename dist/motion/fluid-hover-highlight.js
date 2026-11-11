"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { AnimatePresence, motion, useReducedMotion, } from "motion/react";
import { spring } from "./springs.js";
import { cn } from "../shared/utils.js";
const fade = { duration: 0.08 };
const snap = { duration: 0 };
/** A measured rect as animation targets: position as a transform, size as
 *  layout. Exported for the unit test. */
export function toTarget(rect) {
    return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
}
/**
 * Resolves the positional transition. Reduced motion keeps the opacity fade
 * and drops the travel, per the motion guidelines: fewer and gentler, not
 * none. Exported for the unit test.
 */
export function resolveHighlightTransition(transition, reduceMotion) {
    const positional = transition === false || reduceMotion ? snap : (transition ?? spring.fast);
    return { ...positional, opacity: fade };
}
/** The rect and session a set of props resolves to. Exported for the test. */
export function resolveHighlightSource(props) {
    if (props.hover) {
        const { activeIndex, itemRects, isMeasured, session } = props.hover;
        const rect = !props.hidden && isMeasured && activeIndex !== null
            ? (itemRects[activeIndex] ?? null)
            : null;
        return { rect, session };
    }
    return { rect: props.rect, session: props.session };
}
export function FluidHoverHighlight(props) {
    const { from, fadeIn = true, className, transition } = props;
    const { rect, session } = resolveHighlightSource(props);
    // Reads the OS media query directly, so an installed copy honours reduced
    // motion without the app wrapping its tree in MotionConfig. A wrapped app
    // gets the same result twice over: the travel is a transform, which
    // MotionConfig reduces too.
    const reduceMotion = useReducedMotion() ?? false;
    return (_jsx(AnimatePresence, { children: rect && (_jsx(motion.div, { "data-slot": "fluid-hover-highlight", 
            // Pinned to the container's padding corner and moved with a
            // transform, so the travel runs on the compositor instead of
            // re-laying out every frame. Width and height are real layout
            // values, but they only change when the target rect's size does,
            // which in most lists is never.
            className: cn("pointer-events-none absolute top-0 left-0 bg-hover", className), initial: { opacity: fadeIn ? 0 : 1, ...toTarget(from ?? rect) }, animate: { opacity: 1, ...toTarget(rect) }, exit: { opacity: 0, transition: spring.fast.exit }, transition: resolveHighlightTransition(transition, reduceMotion) }, session)) }));
}
