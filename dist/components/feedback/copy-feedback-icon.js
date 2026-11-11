import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { motionTransitions } from "../../lib/motion/motion-tokens.js";
import { cn } from "../../lib/class-names.js";
const swap = (visible, reducedMotion) => ({
    opacity: visible ? 1 : 0,
    scale: reducedMotion || visible ? 1 : 0.85,
    filter: reducedMotion ? "none" : visible ? "blur(0px)" : "blur(4px)",
});
export function CopyFeedbackIcon({ copied, idle = _jsx(CopyIcon, { className: "size-4", "aria-hidden": "true" }), className, }) {
    const reducedMotion = useReducedMotion();
    const transition = reducedMotion
        ? motionTransitions.gentleFade
        : motionTransitions.iconSwap;
    return (_jsxs("div", { className: cn("relative size-4", className), children: [_jsx(motion.span, { className: "absolute inset-0 flex items-center justify-center", initial: false, animate: swap(copied, reducedMotion), transition: transition, children: _jsx(CheckIcon, { className: "size-4", "aria-hidden": "true" }) }), _jsx(motion.span, { className: "absolute inset-0 flex items-center justify-center", initial: false, animate: swap(!copied, reducedMotion), transition: transition, children: idle })] }));
}
