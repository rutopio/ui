"use client";
import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useId, useMemo, useRef, useState, } from "react";
import { FluidHoverHighlight } from "../motion/fluid-hover-highlight.js";
import { ScrollArea } from "../ui/scroll-area.js";
import { springPresets } from "../../lib/motion/spring-presets.js";
import { useFluidHover } from "../../hooks/use-fluid-hover.js";
import { useMountEffect } from "../../hooks/use-mount-effect.js";
import { cn } from "../../lib/class-names.js";
const HTTP_URL_RE = /^https?:\/\//;
export function ActionMenu({ label, trigger, items, side = "bottom", align = "end", openOnHover = true, triggerLabel = label, triggerClassName, className, indicator, scrollToActive = side === "left", }) {
    const id = useId();
    const reducedMotion = useReducedMotion();
    const [open, setOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const openRef = useRef(false);
    const modeRef = useRef(null);
    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const listRef = useRef(null);
    const itemRefs = useRef([]);
    const timer = useRef(undefined);
    const focusFrame = useRef(null);
    const hover = useFluidHover(listRef, { axis: "y", nearest: true });
    const itemRefCallbacks = useMemo(() => Array.from({ length: items.length }, (_, index) => (element) => {
        itemRefs.current[index] = element;
        hover.registerItem(index, element);
    }), [items.length, hover.registerItem]);
    const close = useCallback((restoreFocus = false) => {
        clearTimeout(timer.current);
        if (focusFrame.current !== null)
            cancelAnimationFrame(focusFrame.current);
        focusFrame.current = null;
        openRef.current = false;
        modeRef.current = null;
        setOpen(false);
        hover.setActiveIndex(null);
        if (restoreFocus)
            triggerRef.current?.focus();
    }, [hover.setActiveIndex]);
    useMountEffect(() => {
        const onPointerDown = (event) => {
            if (openRef.current && !rootRef.current?.contains(event.target))
                close();
        };
        document.addEventListener("pointerdown", onPointerDown, true);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown, true);
            clearTimeout(timer.current);
            if (focusFrame.current !== null)
                cancelAnimationFrame(focusFrame.current);
        };
    });
    const focusItem = (index) => {
        if (focusFrame.current !== null)
            cancelAnimationFrame(focusFrame.current);
        focusFrame.current = requestAnimationFrame(() => {
            focusFrame.current = null;
            itemRefs.current[index]?.focus();
        });
    };
    const openMenu = (mode, focus = false) => {
        clearTimeout(timer.current);
        if (items.length === 0)
            return;
        if (mode === "hover" && openRef.current)
            return;
        const index = Math.max(0, items.findIndex((item) => item.active));
        if (!openRef.current) {
            setFocusedIndex(index);
            openRef.current = true;
            modeRef.current = mode;
            setOpen(true);
        }
        else if (mode === "click") {
            modeRef.current = "click";
            setFocusedIndex(index);
        }
        if (focus)
            focusItem(index);
    };
    const move = (index) => {
        if (items.length === 0)
            return;
        const next = (index + items.length) % items.length;
        setFocusedIndex(next);
        hover.setActiveIndex(next);
        if (!openRef.current)
            openMenu("click");
        focusItem(next);
    };
    const onKeyDown = (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            close(true);
        }
        else if (event.key === "ArrowDown") {
            event.preventDefault();
            move(openRef.current ? focusedIndex + 1 : 0);
        }
        else if (event.key === "ArrowUp") {
            event.preventDefault();
            move(openRef.current ? focusedIndex - 1 : items.length - 1);
        }
        else if (event.key === "Home") {
            event.preventDefault();
            move(0);
        }
        else if (event.key === "End") {
            event.preventDefault();
            move(items.length - 1);
        }
    };
    const scrollActiveIntoView = (element) => {
        if (!scrollToActive || !element)
            return;
        const frame = requestAnimationFrame(() => {
            const viewport = element.querySelector('[data-slot="scroll-area-viewport"]');
            const active = element.querySelector('[data-active="true"]');
            if (!viewport || !active)
                return;
            const viewportRect = viewport.getBoundingClientRect();
            const activeRect = active.getBoundingClientRect();
            viewport.scrollTop += activeRect.top - viewportRect.top - viewport.clientHeight / 2 + activeRect.height / 2;
        });
        focusFrame.current = frame;
    };
    return (_jsxs("div", { ref: rootRef, role: "group", "aria-label": label, "data-slot": side === "left" ? "button" : undefined, className: cn("relative inline-flex", side === "left" && "size-10 rounded-lg border border-border bg-background dark:border-input dark:bg-neutral-800", className), onMouseEnter: () => {
            if (!openOnHover || modeRef.current === "click")
                return;
            clearTimeout(timer.current);
            timer.current = setTimeout(() => openMenu("hover"), 200);
        }, onMouseLeave: () => {
            if (modeRef.current !== "click")
                close();
        }, onBlurCapture: (event) => {
            if (modeRef.current !== "click" && !rootRef.current?.contains(event.relatedTarget))
                close();
        }, children: [_jsx("button", { ref: triggerRef, type: "button", "aria-label": triggerLabel, "aria-haspopup": "menu", "aria-expanded": open, "aria-controls": open ? id : undefined, className: cn("base-button-interaction group/button inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-base font-semibold whitespace-nowrap text-primary outline-none select-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50", side === "left" && "size-full rounded-[inherit] hover:text-primary", triggerClassName), onClick: () => {
                    if (openRef.current && modeRef.current === "click")
                        close();
                    else
                        openMenu("click", true);
                }, onKeyDown: onKeyDown, children: trigger }), _jsx(AnimatePresence, { children: open && (_jsx("div", { className: cn("absolute z-50", side === "left"
                        ? "top-1/2 right-full w-fit min-w-64 max-w-[min(20rem,calc(100vw-4rem))] -translate-y-1/2 pr-2"
                        : cn("top-full w-fit min-w-48 max-w-[min(18rem,calc(100vw-2rem))] pt-2", align === "end" ? "right-0" : "left-0")), children: _jsx(motion.div, { ref: scrollActiveIntoView, initial: reducedMotion ? { opacity: 0 } : side === "left" ? { opacity: 0, scale: 0.97, x: 8 } : { opacity: 0, scale: 0.96, y: -4 }, animate: { opacity: 1, scale: 1, x: 0, y: 0 }, exit: { opacity: 0, scale: side === "left" ? 0.97 : 0.96, ...(side === "left" ? { x: 6 } : { y: -4 }), transition: side === "left" ? springPresets.moderate.exit : springPresets.fast.exit }, transition: side === "left" ? springPresets.moderate : springPresets.fast, style: { transformOrigin: side === "left" ? "center right" : align === "end" ? "top right" : "top left" }, className: "w-max min-w-full max-w-full rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-md", children: _jsx(ScrollArea, { scrollFade: true, overscrollContain: true, className: "h-auto! max-h-[calc(50dvh-0.625rem)] w-max! min-w-full max-w-full [&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:right-[-3px]! [&_[data-slot=scroll-area-scrollbar][data-orientation=vertical]]:w-1! [&_[data-slot=scroll-area-scrollbar]]:m-0.5 [&_[data-slot=scroll-area-thumb]]:bg-foreground/10! [&_[data-slot=scroll-area-viewport]]:max-h-[calc(50dvh-0.625rem)] data-has-overflow-y:[&_[role=menu]]:pr-2", children: _jsxs("div", { ref: listRef, id: id, role: "menu", "aria-label": label, onKeyDown: onKeyDown, ...hover.handlers, className: "relative w-max min-w-full max-w-full", children: [_jsx(FluidHoverHighlight, { hover: hover, className: "rounded-md" }), items.map((item, index) => {
                                        const external = item.external ?? HTTP_URL_RE.test(item.href ?? "");
                                        const itemProps = {
                                            role: "menuitem",
                                            lang: item.lang,
                                            "aria-current": item.ariaCurrent,
                                            "data-active": item.active || undefined,
                                            onPointerMove: () => setFocusedIndex(index),
                                            onFocus: () => {
                                                setFocusedIndex(index);
                                                hover.setActiveIndex(index);
                                            },
                                            onClick: (event) => {
                                                item.onSelect?.(event);
                                                close(true);
                                            },
                                            className: cn("relative flex min-h-8 w-full min-w-0 items-center gap-3 rounded-md px-2.5 py-1.5 text-left text-base focus-visible:outline-none", item.active && "font-bold text-primary"),
                                            children: _jsxs(_Fragment, { children: [item.leading, _jsx("span", { className: cn("min-w-0 flex-1", item.depth === 3 && "pl-4", side === "bottom" && "truncate"), children: item.label }), indicator ? _jsx("span", { className: cn("flex size-4 shrink-0 items-center justify-center", !item.active && "invisible"), "aria-hidden": "true", children: indicator }) : item.trailing, external && _jsx("span", { className: "sr-only", children: "(opens in a new tab)" })] }),
                                        };
                                        return item.href ? (_jsx("a", { ref: itemRefCallbacks[index], href: item.href, target: external ? "_blank" : undefined, rel: external ? "noopener noreferrer" : undefined, ...itemProps }, item.id)) : (_jsx("button", { ref: itemRefCallbacks[index], type: "button", ...itemProps }, item.id));
                                    })] }) }) }) })) })] }));
}
