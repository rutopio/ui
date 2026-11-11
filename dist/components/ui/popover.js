"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { usePopover } from "../../hooks/use-popover.js";
export { usePopover } from "../../hooks/use-popover.js";
import { useCallback, useEffect, useId, useRef, useState, } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/class-names.js";
const EASE = [0.23, 1, 0.32, 1];
const CROSSFADE = {
    type: "spring",
    stiffness: 260,
    damping: 34,
    mass: 0.8,
};
const ARROW_EDGE = {
    bottom: "border-t border-l",
    top: "border-b border-r",
    right: "border-b border-l",
    left: "border-t border-r",
};
const FROM = {
    top: { y: 6 },
    bottom: { y: -6 },
    left: { x: 6 },
    right: { x: -6 },
};
export function Popover({ trigger, children, label, open: controlled, defaultOpen = false, onOpenChange, side = "bottom", align = "center", offset = 10, padding = 8, arrowSize = 9, boundary, unstyledTrigger = false, triggerClassName = "", className = "", }) {
    const [uncontrolled, setUncontrolled] = useState(defaultOpen);
    const open = controlled ?? uncontrolled;
    const id = useId();
    const reduced = useReducedMotion();
    const notify = useRef(onOpenChange);
    notify.current = onOpenChange;
    const { anchorRef, floatingRef, panelRef, contentRef, arrowRef, side: at, } = usePopover({
        open,
        side,
        align,
        offset,
        padding,
        arrowSize,
        boundary,
    });
    const setOpen = useCallback((next) => {
        if (controlled === undefined)
            setUncontrolled(next);
        notify.current?.(next);
    }, [controlled]);
    const setPanelRef = useCallback((element) => {
        panelRef.current = element;
        element?.focus({ preventScroll: true });
    }, [panelRef]);
    useEffect(() => {
        if (!open)
            return;
        const onPointerDown = (event) => {
            const target = event.target;
            if (!target)
                return;
            if (panelRef.current?.contains(target) ||
                anchorRef.current?.contains(target))
                return;
            setOpen(false);
        };
        const onKeyDown = (event) => {
            if (event.key !== "Escape")
                return;
            event.stopPropagation();
            anchorRef.current?.focus({ preventScroll: true });
            setOpen(false);
        };
        document.addEventListener("pointerdown", onPointerDown, true);
        document.addEventListener("keydown", onKeyDown, true);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown, true);
            document.removeEventListener("keydown", onKeyDown, true);
        };
    }, [open, setOpen, anchorRef, panelRef]);
    return (_jsxs(_Fragment, { children: [_jsx("button", { ref: anchorRef, type: "button", "aria-haspopup": "dialog", "aria-expanded": open, "aria-controls": open ? id : undefined, onClick: () => setOpen(!open), className: cn(!unstyledTrigger &&
                    "inline-flex h-9 select-none items-center gap-2 rounded-[9px] border border-stone-200 bg-white px-3 font-semibold text-[16px] text-stone-700 outline-none transition-[border-color,box-shadow] duration-150 hover:border-stone-300 focus-visible:border-[#4568FF] focus-visible:shadow-[0_1px_2px_rgba(28,25,23,0.08),0_10px_20px_-14px_rgba(69,104,255,0.6)] dark:border-white/[0.16] dark:bg-[#1D1D1A] dark:text-stone-200 dark:focus-visible:border-[#93B0FF] dark:focus-visible:shadow-[0_10px_20px_-14px_rgba(147,176,255,0.5)] dark:hover:border-white/20", triggerClassName), children: trigger }), typeof document !== "undefined" &&
                createPortal(_jsx(AnimatePresence, { children: open ? (_jsx("div", { ref: floatingRef, className: "fixed top-0 left-0 z-50", onBlurCapture: (event) => {
                            const next = event.relatedTarget;
                            if (!next)
                                return;
                            if (panelRef.current?.contains(next) ||
                                anchorRef.current?.contains(next))
                                return;
                            setOpen(false);
                        }, children: _jsxs(motion.div, { ref: setPanelRef, id: id, role: "dialog", "aria-label": label, tabIndex: -1, initial: reduced
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.95, ...FROM[at] }, animate: { opacity: 1, scale: 1, x: 0, y: 0 }, exit: reduced
                                ? { opacity: 0, transition: { duration: 0.1 } }
                                : {
                                    opacity: 0,
                                    scale: 0.97,
                                    transition: { duration: 0.13, ease: EASE },
                                }, transition: reduced
                                ? { duration: 0 }
                                : {
                                    ...CROSSFADE,
                                    opacity: { duration: 0.14, ease: EASE },
                                }, className: cn("relative rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md focus-visible:outline-none", className), children: [_jsx("span", { ref: arrowRef, "aria-hidden": true, style: {
                                        width: arrowSize,
                                        height: arrowSize,
                                        transform: "rotate(45deg)",
                                    }, className: cn("absolute block border-border bg-popover", ARROW_EDGE[at]) }), _jsx("div", { ref: contentRef, className: "relative overflow-y-auto overscroll-contain", children: children })] }) }, "popover")) : null }), document.body)] }));
}
