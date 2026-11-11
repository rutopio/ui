"use client";
import { useRef, useState, useCallback, useEffect, useMemo, useSyncExternalStore, } from "react";
import { useMountEffect } from "./use-mount-effect.js";
/**
 * The rule, as one pure function: an item the pointer is inside wins;
 * otherwise the item whose center is nearest does, so a pointer in a gap, in
 * the padding, or past the last row still lands. `y` and `x` measure one
 * coordinate; `xy` measures the straight line to each center. Ties keep the
 * first item. The hook calls this once per animation frame; the docs page
 * times it.
 */
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
/**
 * Whether an event happened inside the element whose handler hears it.
 * React bubbles events from portalled children (a dropdown opened from a
 * row, a submenu, a tooltip) through their React ancestors, so a list's
 * handlers also hear moves, clicks and focus changes that happened in
 * another layer. The hook's own move and click handlers skip those; a
 * consumer with handlers of its own (focus, keys) can call this too. A bare
 * point with no target (a caller re-picking at a remembered position)
 * counts as the list's own.
 */
export function isEventFromContainer(e) {
    const { currentTarget, target } = e;
    if (!(currentTarget instanceof Node) || !(target instanceof Node))
        return true;
    return currentTarget.contains(target);
}
/** Set on the highlighted item (boolean attribute). */
export const FLUID_HOVER_ACTIVE_ATTRIBUTE = "data-fluid-hover-active";
/** Set on the container: the highlighted index, or absent. */
export const FLUID_HOVER_ACTIVE_INDEX_ATTRIBUTE = "data-fluid-hover-active-index";
const ACTIVATOR_SELECTOR = "a[href], button, [role='menuitem'], [role='menuitemradio'], [role='menuitemcheckbox'], [role='option'], [role='radio'], [role='checkbox'], [role='tab'], [role='link'], [role='button']";
/**
 * The element a routed click should land on. A registered item is usually
 * the interactive row itself; when it is only a box around one (a sidebar
 * row around its button, a card around its link), the first control inside
 * is what a real click on the row would have reached.
 */
function resolveActivator(element) {
    if (element.matches(ACTIVATOR_SELECTOR) || element.hasAttribute("tabindex")) {
        return element;
    }
    return element.querySelector(ACTIVATOR_SELECTOR) ?? element;
}
/**
 * How many frames the coalesced remeasure retries while the registered items
 * still have no layout box. A popup can be in the DOM one frame before it is
 * laid out; retrying beats publishing zeroed rects, and the cap keeps a list
 * that stays hidden for good from spinning frames forever.
 */
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
    // Set when the pointer enters; the pointer's first change of highlight
    // starts the new session, in the same update as the change itself.
    const sessionPendingRef = useRef(false);
    const rafIdRef = useRef(null);
    const remeasureRafIdRef = useRef(null);
    /**
     * Publishes a rect for every registered item. Returns false when the
     * measurement could not be completed (no container, or an item without a
     * layout box) — nothing is published in that case, so the last complete
     * measurement stands instead of being overwritten with zeroes.
     */
    const runMeasurement = useCallback(() => {
        const container = containerRef.current;
        if (!container)
            return false;
        const rects = [];
        let everyItemHasLayout = true;
        itemsRef.current.forEach((element, index) => {
            // An element inside a display:none / not-yet-laid-out popup has no
            // offsetParent and reports every offset as 0. Publishing that would pin
            // overlays to the top of the list, so treat the whole pass as
            // incomplete. A boxless element is the only case: `position: fixed`
            // items also have no offsetParent but do have a size.
            const hasLayoutBox = element.offsetParent !== null ||
                element.offsetWidth > 0 ||
                element.offsetHeight > 0;
            if (!hasLayoutBox) {
                everyItemHasLayout = false;
                return;
            }
            // Use offset* instead of getBoundingClientRect so measurements are
            // unaffected by CSS transforms (e.g. scaleY animation on the parent
            // motion.div). offsetTop/offsetLeft are layout values relative to the
            // offsetParent (the scroll container), matching the coordinate space
            // used by `position: absolute` children. Items nested inside positioned
            // descendants of the container (a sidebar sub-menu's rows live inside a
            // positioned row) accumulate those ancestors' offsets, so every rect
            // lands in the container's own coordinate space; for a flat list the
            // loop never runs and this is exactly the plain offsetTop/offsetLeft.
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
        // Skip the state update when nothing moved (a cheap top/left/width/height
        // compare) so redundant remeasures don't churn re-renders.
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
    /**
     * The hook's single measurement pass: coalesces every trigger (item
     * registration, container resize) into one remeasure on the next frame and
     * is the only place readiness is reported, so `isMeasured` can never turn
     * true while another pass is still queued.
     */
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
        // Readiness drops first: until the pass below settles, the published rects
        // may not describe what is on screen, and an overlay positioned from them
        // would be corrected after mounting — which animates as a slide.
        setIsMeasured(false);
        scheduleMeasurement(measurementAttempts);
    }, [scheduleMeasurement]);
    // Observes the registered items themselves (not just the container): rows
    // that change size in place — e.g. the site-wide size step flipping while a
    // selection background is up — must invalidate the published rects even when
    // the container the effect below captured has since been remounted and the
    // ref points at a different element than the one being observed.
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
            // The mark leaves with the element: a row that only moved to another
            // index (a filtering list re-ordering) must not carry it there.
            previous?.removeAttribute(FLUID_HOVER_ACTIVE_ATTRIBUTE);
            itemsRef.current.delete(index);
            // The highlighted row is gone: nothing should stay lit or receive a
            // routed click until the pointer picks again. Wait for this commit's
            // registrations so a replacement row can retain the same index.
            if (index === activeIndexRef.current) {
                queueMicrotask(() => {
                    if (!itemsRef.current.has(index)) {
                        setActiveIndex((current) => current === index ? null : current);
                    }
                });
            }
        }
        // Coalesce rapid register/unregister calls (e.g. when an AnimatePresence
        // remounts a list of rows) into a single remeasure on the next frame,
        // so consumers don't have to manually call measureItems after the
        // container's children swap.
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
                // The item under the pointer, or none. Items can nest (a sidebar
                // row's sub-rows sit inside it): the innermost one holding the
                // pointer wins.
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
            // Empty space put the highlight out: the next item lit fades it in
            // there, as on entering, instead of sliding from the last one.
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
        // Inside an item: the item owns the click.
        for (const element of itemsRef.current.values()) {
            if (element.contains(target))
                return;
        }
        // A row that unmounted while its own click was still bubbling (a pick
        // whose primitive re-renders the list synchronously, like a "create"
        // row that becomes a real item) already landed; it is not a gap.
        if (!target.isConnected)
            return;
        // Nor is a click from something rendered through a portal (a dropdown
        // opened from a row, a submenu): it bubbles here through React, but it
        // never happened between these rows.
        if (!isEventFromContainer(e))
            return;
        // A control that sits between the rows (a search field at the top of
        // a menu, a footer button) keeps its own click too.
        const control = target.closest?.("input, textarea, select, button, a, summary, [contenteditable], [role='textbox'], [role='searchbox'], [role='button']");
        if (control)
            return;
        // Without nearest nothing is lit between items. The highlight updates a
        // frame late, so one still lit from the item just left must not take
        // a click that landed in the gap.
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
        // A real DOM click on the item, so its own handlers (and the primitive
        // wrapping it, if any) run exactly as if the pointer had been inside.
        resolveActivator(element).click();
    }, [isItemDisabled, gapClick, gapClickMaxDistance, nearest]);
    // Remeasure when the container resizes — a reflow moves items even though
    // the registered set is unchanged, which would otherwise leave itemRects
    // stale. Coalesced through the same rAF as register/unregister. Readiness is
    // deliberately not dropped: the item set is unchanged, so the published rects
    // stay usable, and hiding overlays on every reflow would flicker them.
    useEffect(() => {
        const container = containerRef.current;
        if (!container || typeof ResizeObserver === "undefined")
            return;
        const ro = new ResizeObserver(() => scheduleMeasurement(measurementAttempts));
        ro.observe(container);
        return () => ro.disconnect();
    }, [containerRef, scheduleMeasurement]);
    // Clean up rAF and the item observer on unmount
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
/**
 * Reads one value derived from the highlighted index, re-rendering only when
 * that value changes. The selector must return a primitive:
 *
 *   const isActive = useFluidHoverSelect(ctx?.activeStore, (i) => i === index);
 *
 * A missing store (a row rendered outside a list) reads as nothing lit.
 */
export function useFluidHoverSelect(store, select) {
    return useSyncExternalStore(store?.subscribe ?? subscribeNever, () => select(store ? store.get() : null), () => select(null));
}
/**
 * Registers an item's element with its list for as long as it is mounted.
 * The one way rows join a list: pass the hook's `registerItem` (or the copy
 * a context hands down), the row's index, and its ref. Either may be
 * missing for a row rendered outside a list (a standalone card, an accordion
 * item that is not grouped); then nothing is registered.
 */
export function useRegisterFluidHoverItem(registerItem, index, ref) {
    useEffect(() => {
        if (!registerItem || index === undefined)
            return;
        registerItem(index, ref.current);
        return () => registerItem(index, null);
    }, [index, registerItem, ref]);
}
