import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export { useActiveOutlineId } from "../../hooks/use-active-outline-id.js";
import { useActiveOutlineId } from "../../hooks/use-active-outline-id.js";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { motion, useReducedMotion } from "motion/react";
import { ActionMenu } from "./action-menu.js";
import { motionTransitions } from "../../lib/motion/motion-tokens.js";
import { cn } from "../../lib/class-names.js";
const RING_CIRCUMFERENCE = 2 * Math.PI * 6.25;
export function ReadingProgressRing({ progress }) {
    const reducedMotion = useReducedMotion();
    return (_jsxs("svg", { "aria-hidden": "true", viewBox: "0 0 16 16", className: cn("size-4", "-rotate-90"), children: [_jsx("circle", { cx: "8", cy: "8", r: "6.25", fill: "none", stroke: "currentColor", strokeWidth: "2.5", className: "opacity-20" }), _jsx(motion.circle, { cx: "8", cy: "8", r: "6.25", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeDasharray: RING_CIRCUMFERENCE, initial: false, animate: { strokeDashoffset: (1 - progress) * RING_CIRCUMFERENCE }, transition: reducedMotion ? motionTransitions.instant : motionTransitions.progress })] }));
}
export function OutlineMenu({ items, ariaLabel, pageProgress, sectionProgress, className, }) {
    const activeId = useActiveOutlineId(items, sectionProgress);
    if (items.length === 0)
        return null;
    return (_jsx(ActionMenu, { label: ariaLabel, triggerLabel: `${Math.round(pageProgress * 100)}% read. ${ariaLabel}`, trigger: _jsx(ReadingProgressRing, { progress: pageProgress }), side: "left", openOnHover: true, className: className, indicator: _jsx(ArrowLeftIcon, { className: "size-4", "aria-hidden": "true" }), items: items.map((item) => ({
            id: item.id,
            label: item.label,
            depth: item.depth,
            href: item.href,
            active: item.id === activeId,
            ariaCurrent: item.id === activeId ? "location" : undefined,
        })) }));
}
