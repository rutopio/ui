import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "./utils.js";
const swap = (visible, reducedMotion) => ({
    opacity: visible ? 1 : 0,
    scale: reducedMotion || visible ? 1 : 0.85,
    filter: reducedMotion ? "none" : visible ? "blur(0px)" : "blur(4px)",
});
const spring = { type: "spring", duration: 0.25, bounce: 0 };
// Cross-fades an idle icon to a check on success: the two glyphs sit stacked and
// swap with a spring scale + blur, matching the mail-dialog feedback. Shared so
// every "copied!" affordance animates the same way. `idle` overrides the default
// copy glyph (e.g. a link icon).
export function CopyFeedbackIcon({ copied, idle = _jsx(CopyIcon, { className: "size-4", "aria-hidden": "true" }), className, }) {
    const reducedMotion = useReducedMotion();
    const transition = reducedMotion
        ? { duration: 0.12, ease: "easeOut" }
        : spring;
    return (_jsxs("div", { className: cn("relative size-4", className), children: [_jsx(motion.span, { className: "absolute inset-0 flex items-center justify-center", initial: false, animate: swap(copied, reducedMotion), transition: transition, children: _jsx(CheckIcon, { className: "size-4", "aria-hidden": "true" }) }), _jsx(motion.span, { className: "absolute inset-0 flex items-center justify-center", initial: false, animate: swap(!copied, reducedMotion), transition: transition, children: idle })] }));
}
