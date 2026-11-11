"use client";
import { useRef, useState, useCallback, useEffect, useMemo, useSyncExternalStore, } from "react";
import { useMountEffect } from "./use-mount-effect.js";
export function findNearestHoverItemIndex({ axis, point, rects, containerRect, scroll, border, layoutSize, isDisabled, }) {
    const scaleX = layoutSize.width > 0 ? containerRect.width / layoutSize.width : 1;
    const scaleY = layoutSize.height > 0 ? containerRect.height / layoutSize.height : 1;
    let closestIndex = null;
    let closestDistance = Infinity;
    let containingIndex = null;
    for (let index = 0; index < rects.length; index++) {
        const r = rects[index];
        if (!r)
            continue;
        if (isDisabled?.(index))
            continue;
        if (axis === "xy") {
            const left = containerRect.left + (border.x + r.left - scroll.x) * scaleX;
            const top = containerRect.top + (border.y + r.top - scroll.y) * scaleY;
            const width = r.width * scaleX;
            const height = r.height * scaleY;
            if (point.x >= left &&
                point.x <= left + width &&
                point.y >= top &&
                point.y <= top + height) {
                containingIndex = index;
            }
            const distance = Math.hypot(point.x - (left + width / 2), point.y - (top + height / 2));
            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
            continue;
        }
        const horizontal = axis === "x";
        const mousePos = horizontal ? point.x : point.y;
        const scale = horizontal ? scaleX : scaleY;
        const itemStart = (horizontal ? containerRect.left : containerRect.top) +
            ((horizontal ? border.x : border.y) +
                (horizontal ? r.left : r.top) -
                (horizontal ? scroll.x : scroll.y)) *
                scale;
        const itemSize = (horizontal ? r.width : r.height) * scale;
        if (mousePos >= itemStart && mousePos <= itemStart + itemSize) {
            containingIndex = index;
        }
        const distance = Math.abs(mousePos - (itemStart + itemSize / 2));
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    }
    return containingIndex ?? closestIndex;
}
/** React portals bubble through the component tree but are outside the container DOM. */
export function isEventFromContainer(e) {
    const { currentTarget, target } = e;
    if (!(currentTarget instanceof Node) || !(target instanceof Node))
        return true;
    return currentTarget.contains(target);
}
export const FLUID_HOVER_ACTIVE_ATTRIBUTE = "data-fluid-hover-active";
export const FLUID_HOVER_ACTIVE_INDEX_ATTRIBUTE = "data-fluid-hover-active-index";
const ACTIVATOR_SELECTOR = "a[href], button, [role='menuitem'], [role='menuitemradio'], [role='menuitemcheckbox'], [role='option'], [role='radio'], [role='checkbox'], [role='tab'], [role='link'], [role='button']";
function resolveActivator(element) {
    if (element.matches(ACTIVATOR_SELECTOR) || element.hasAttribute("tabindex")) {
        return element;
    }
    return element.querySelector(ACTIVATOR_SELECTOR) ?? element;
}
// Retry delayed popup layout, but stop if the popup stays hidden.
const measurementAttempts = 3;
export function useFluidHover(containerRef, options = {}) {
    const { axis = "y", isItemDisabled, gapClick = true, nearest = false, } = options;
    const gapClickMaxDistance = typeof gapClick === "object"
        ? (gapClick.maxDistance ?? Infinity)
        : Infinity;
    const itemsRef = useRef(new Map());
    // The store is authoritative for both pointer handlers and subscribed rows.
    const activeIndexRef = useRef(null);
    const listenersRef = useRef(new Set());
    const activeStore = useMemo(() => ({
        subscribe: (listener) => {
            listenersRef.current.add(listener);
            return () => {
                listenersRef.current.delete(listener);
            };
        },
        get: () => activeIndexRef.current,
    }), []);
    const activeIndex = useSyncExternalStore(activeStore.subscribe, activeStore.get, () => null);
    const setActiveIndex = useCallback((action) => {
        const previous = activeIndexRef.current;
        const next = typeof action === "function" ? action(previous) : action;
        if (next === previous)
            return;
        if (previous !== null)
            itemsRef.current.get(previous)?.removeAttribute(FLUID_HOVER_ACTIVE_ATTRIBUTE);
        activeIndexRef.current = next;
        const container = containerRef.current;
        if (next === null)
            container?.removeAttribute(FLUID_HOVER_ACTIVE_INDEX_ATTRIBUTE);
        else {
            container?.setAttribute(FLUID_HOVER_ACTIVE_INDEX_ATTRIBUTE, String(next));
            itemsRef.current.get(next)?.setAttribute(FLUID_HOVER_ACTIVE_ATTRIBUTE, "");
        }
        listenersRef.current.forEach((listener) => {
            listener();
        });
    }, [containerRef]);
    const [itemRects, setItemRects] = useState([]);
    const [isMeasured, setIsMeasured] = useState(false);
    const itemRectsRef = useRef([]);
    const [session, setSession] = useState(0);
    const sessionRef = useRef(0);
    // Update the session and its first highlight together to avoid animating from a stale row.
    const sessionPendingRef = useRef(false);
    const rafIdRef = useRef(null);
    const remeasureRafIdRef = useRef(null);
    const runMeasurement = useCallback(() => {
        const container = containerRef.current;
        if (!container)
            return false;
        const rects = [];
        let everyItemHasLayout = true;
        itemsRef.current.forEach((element, index) => {
            // Hidden elements report zero offsets; fixed-position elements can still have a size.
            const hasLayoutBox = element.offsetParent !== null ||
                element.offsetWidth > 0 ||
                element.offsetHeight > 0;
            if (!hasLayoutBox) {
                everyItemHasLayout = false;
                return;
            }
            // Layout offsets ignore transforms. Accumulate positioned ancestors to match the overlay container.
            let top = element.offsetTop;
            let left = element.offsetLeft;
            let ancestor = element.offsetParent;
            while (ancestor &&
                ancestor !== container &&
                container.contains(ancestor)) {
                top += ancestor.offsetTop + ancestor.clientTop;
                left += ancestor.offsetLeft + ancestor.clientLeft;
                ancestor = ancestor.offsetParent;
            }
            rects[index] = {
                top,
                height: element.offsetHeight,
                left,
                width: element.offsetWidth,
            };
        });
        if (!everyItemHasLayout)
            return false;
        const prev = itemRectsRef.current;
        let changed = prev.length !== rects.length;
        for (let i = 0; !changed && i < rects.length; i++) {
            const p = prev[i];
            const r = rects[i];
            if (p === r)
                continue; // both undefined (sparse slot)
            changed =
                !p ||
                    !r ||
                    p.top !== r.top ||
                    p.left !== r.left ||
                    p.width !== r.width ||
                    p.height !== r.height;
        }
        if (changed) {
            itemRectsRef.current = rects;
            setItemRects(rects);
        }
        return true;
    }, [containerRef]);
    const measureItems = useCallback(() => {
        runMeasurement();
    }, [runMeasurement]);
    const scheduleMeasurement = useCallback((attempts) => {
        const attempt = (attemptsLeft) => {
            if (remeasureRafIdRef.current !== null) {
                cancelAnimationFrame(remeasureRafIdRef.current);
            }
            remeasureRafIdRef.current = requestAnimationFrame(() => {
                remeasureRafIdRef.current = null;
                if (runMeasurement()) {
                    setIsMeasured(true);
                }
                else if (attemptsLeft > 1) {
                    attempt(attemptsLeft - 1);
                }
            });
        };
        attempt(attempts);
    }, [runMeasurement]);
    const remeasure = useCallback(() => {
        // Hide overlays until corrected rects are ready, so they do not animate from a stale position.
        setIsMeasured(false);
        scheduleMeasurement(measurementAttempts);
    }, [scheduleMeasurement]);
    // Rows can resize without changing the container size.
    const itemRoRef = useRef(null);
    const getItemRo = useCallback(() => {
        if (itemRoRef.current === null && typeof ResizeObserver !== "undefined") {
            itemRoRef.current = new ResizeObserver(() => scheduleMeasurement(measurementAttempts));
        }
        return itemRoRef.current;
    }, [scheduleMeasurement]);
    const registerItem = useCallback((index, element) => {
        if (element) {
            itemsRef.current.set(index, element);
            getItemRo()?.observe(element);
            if (index === activeIndexRef.current)
                element.setAttribute(FLUID_HOVER_ACTIVE_ATTRIBUTE, "");
        }
        else {
            const previous = itemsRef.current.get(index);
            if (previous)
                itemRoRef.current?.unobserve(previous);
            // A reused DOM node must not carry its highlight to a different index.
            previous?.removeAttribute(FLUID_HOVER_ACTIVE_ATTRIBUTE);
            itemsRef.current.delete(index);
            // Wait for this commit's registrations before clearing a possibly replaced row.
            if (index === activeIndexRef.current) {
                queueMicrotask(() => {
                    if (!itemsRef.current.has(index)) {
                        setActiveIndex((current) => current === index ? null : current);
                    }
                });
            }
        }
        remeasure();
    }, [remeasure, getItemRo, setActiveIndex]);
    const handleMouseMove = useCallback((e) => {
        if (!isEventFromContainer(e))
            return;
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const target = e.target;
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
        }
        rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;
            const container = containerRef.current;
            if (!container)
                return;
            let next;
            if (!nearest) {
                // Nested items take precedence over their containing row.
                next = null;
                let hit = null;
                for (const [index, el] of itemsRef.current) {
                    if (!el.contains(target) || isItemDisabled?.(el))
                        continue;
                    if (!hit || hit.contains(el)) {
                        hit = el;
                        next = index;
                    }
                }
            }
            else
                next = findNearestHoverItemIndex({
                    axis,
                    point: { x: mouseX, y: mouseY },
                    rects: itemRectsRef.current,
                    containerRect: container.getBoundingClientRect(),
                    scroll: { x: container.scrollLeft, y: container.scrollTop },
                    border: { x: container.clientLeft, y: container.clientTop },
                    layoutSize: {
                        width: container.offsetWidth,
                        height: container.offsetHeight,
                    },
                    isDisabled: isItemDisabled
                        ? (index) => {
                            const el = itemsRef.current.get(index);
                            return !!el && isItemDisabled(el);
                        }
                        : undefined,
                });
            if (sessionPendingRef.current && next !== activeIndexRef.current) {
                sessionPendingRef.current = false;
                sessionRef.current += 1;
                setSession(sessionRef.current);
            }
            // After crossing a gap, fade in at the next row instead of sliding from the old one.
            if (next === null)
                sessionPendingRef.current = true;
            setActiveIndex(next);
        });
    }, [axis, containerRef, isItemDisabled, nearest, setActiveIndex]);
    const handleMouseEnter = useCallback(() => {
        sessionPendingRef.current = true;
    }, []);
    const handleMouseLeave = useCallback(() => {
        if (rafIdRef.current !== null) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }
        setActiveIndex(null);
    }, [setActiveIndex]);
    const handleClick = useCallback((e) => {
        const target = e.target;
        if (!target)
            return;
        for (const element of itemsRef.current.values()) {
            if (element.contains(target))
                return;
        }
        // A click may unmount its row before bubbling here; do not route it a second time.
        if (!target.isConnected)
            return;
        if (!isEventFromContainer(e))
            return;
        const control = target.closest?.("input, textarea, select, button, a, summary, [contenteditable], [role='textbox'], [role='searchbox'], [role='button']");
        if (control)
            return;
        // Pointer updates lag by one frame; a stale highlight must not receive gap clicks.
        if (gapClick === false || !nearest)
            return;
        const index = activeIndexRef.current;
        if (index === null)
            return;
        const element = itemsRef.current.get(index);
        if (!element || isItemDisabled?.(element))
            return;
        if (gapClickMaxDistance !== Infinity) {
            const r = element.getBoundingClientRect();
            const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
            const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
            if (Math.hypot(dx, dy) > gapClickMaxDistance)
                return;
        }
        resolveActivator(element).click();
    }, [isItemDisabled, gapClick, gapClickMaxDistance, nearest]);
    // Keep overlays visible during reflow; invalidating readiness here would cause flicker.
    useEffect(() => {
        const container = containerRef.current;
        if (!container || typeof ResizeObserver === "undefined")
            return;
        const ro = new ResizeObserver(() => scheduleMeasurement(measurementAttempts));
        ro.observe(container);
        return () => ro.disconnect();
    }, [containerRef, scheduleMeasurement]);
    useMountEffect(() => {
        return () => {
            containerRef.current?.removeAttribute(FLUID_HOVER_ACTIVE_INDEX_ATTRIBUTE);
            itemsRef.current.forEach((element) => {
                element.removeAttribute(FLUID_HOVER_ACTIVE_ATTRIBUTE);
            });
            if (rafIdRef.current !== null) {
                cancelAnimationFrame(rafIdRef.current);
            }
            if (remeasureRafIdRef.current !== null) {
                cancelAnimationFrame(remeasureRafIdRef.current);
            }
            itemRoRef.current?.disconnect();
            itemRoRef.current = null;
        };
    });
    return {
        activeIndex,
        setActiveIndex,
        activeStore,
        itemRects,
        isMeasured,
        session,
        sessionRef,
        handlers: {
            onMouseMove: handleMouseMove,
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: handleClick,
        },
        registerItem,
        remeasure,
        measureItems,
    };
}
const subscribeNever = () => () => { };
/** Return a stable snapshot from `select`; fresh objects would trigger repeated renders. */
export function useFluidHoverSelect(store, select) {
    return useSyncExternalStore(store?.subscribe ?? subscribeNever, () => select(store ? store.get() : null), () => select(null));
}
export function useRegisterFluidHoverItem(registerItem, index, ref) {
    useEffect(() => {
        if (!registerItem || index === undefined)
            return;
        registerItem(index, ref.current);
        return () => registerItem(index, null);
    }, [index, registerItem, ref]);
}
