"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { AnimatePresence, motion, useReducedMotion, } from "motion/react";
import { springPresets } from "../../lib/motion/spring-presets.js";
import { cn } from "../../lib/class-names.js";
const fade = { duration: 0.08 };
const snap = { duration: 0 };
export function getHighlightAnimationTarget(rect) {
    return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
}
export function resolveHighlightTransition(transition, reduceMotion) {
    const positional = transition === false || reduceMotion ? snap : (transition ?? springPresets.fast);
    return { ...positional, opacity: fade };
}
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
    // Respect reduced motion even when the consuming app has no MotionConfig.
    const reduceMotion = useReducedMotion() ?? false;
    return (_jsx(AnimatePresence, { children: rect && (_jsx(motion.div, { "data-slot": "fluid-hover-highlight", 
            // Translate position to avoid layout work during travel.
            className: cn("pointer-events-none absolute top-0 left-0 bg-hover", className), initial: { opacity: fadeIn ? 0 : 1, ...getHighlightAnimationTarget(from ?? rect) }, animate: { opacity: 1, ...getHighlightAnimationTarget(rect) }, exit: { opacity: 0, transition: springPresets.fast.exit }, transition: resolveHighlightTransition(transition, reduceMotion) }, session)) }));
}
