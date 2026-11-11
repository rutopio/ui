"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import { useMountEffect } from "./use-mount-effect.js";

export interface HoverItemRect {
  top: number;
  height: number;
  left: number;
  width: number;
}

export interface UseFluidHoverOptions {
  /** Axis used for nearest-item distance; "xy" measures distance to the center. */
  axis?: "x" | "y" | "xy";
  /** Exclude clipped or disabled rows from hit testing without invalidating layout. */
  isItemDisabled?: (element: HTMLElement) => boolean;
  /** With `nearest`, route gap clicks to the highlight; maxDistance is in CSS pixels. */
  gapClick?: boolean | { maxDistance?: number };
  /** Highlight the nearest item even when the pointer is in empty space. */
  nearest?: boolean;
}

/** Lets rows subscribe to their own active state without rerendering the whole list. */
export interface FluidHoverActiveStore {
  subscribe: (listener: () => void) => () => void;
  get: () => number | null;
}

export interface UseFluidHoverResult {
  activeIndex: number | null;
  setActiveIndex: Dispatch<SetStateAction<number | null>>;
  activeStore: FluidHoverActiveStore;
  itemRects: HoverItemRect[];
  /** Gate overlays until the registered items have usable measurements. */
  isMeasured: boolean;
  /** Changes when a new pointer session first changes the highlight, including after gaps. */
  session: number;
  sessionRef: RefObject<number>;
  handlers: {
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: (e: React.MouseEvent) => void;
  };
  registerItem: (index: number, element: HTMLElement | null) => void;
  /** Invalidate rects after visibility changes; registration and resize are observed automatically. */
  remeasure: () => void;
  /** Measure synchronously during layout animations without hiding the overlay. */
  measureItems: () => void;
}

export interface NearestHoverItemOptions {
  axis: "x" | "y" | "xy";
  /** The pointer, in viewport coordinates. */
  point: { x: number; y: number };
  /** Container layout coordinates; unregistered indices are empty. */
  rects: readonly (HoverItemRect | undefined)[];
  /** Viewport coordinates, including transforms. */
  containerRect: { left: number; top: number; width: number; height: number };
  scroll: { x: number; y: number };
  border: { x: number; y: number };
  /** Untransformed size, used to recover ancestor scale. */
  layoutSize: { width: number; height: number };
  isDisabled?: (index: number) => boolean;
}

export function findNearestHoverItemIndex({
  axis,
  point,
  rects,
  containerRect,
  scroll,
  border,
  layoutSize,
  isDisabled,
}: NearestHoverItemOptions): number | null {
  const scaleX =
    layoutSize.width > 0 ? containerRect.width / layoutSize.width : 1;
  const scaleY =
    layoutSize.height > 0 ? containerRect.height / layoutSize.height : 1;
  let closestIndex: number | null = null;
  let closestDistance = Infinity;
  let containingIndex: number | null = null;

  for (let index = 0; index < rects.length; index++) {
    const r = rects[index];
    if (!r) continue;
    if (isDisabled?.(index)) continue;

    if (axis === "xy") {
      const left = containerRect.left + (border.x + r.left - scroll.x) * scaleX;
      const top = containerRect.top + (border.y + r.top - scroll.y) * scaleY;
      const width = r.width * scaleX;
      const height = r.height * scaleY;
      if (
        point.x >= left &&
        point.x <= left + width &&
        point.y >= top &&
        point.y <= top + height
      ) {
        containingIndex = index;
      }
      const distance = Math.hypot(
        point.x - (left + width / 2),
        point.y - (top + height / 2)
      );
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
      continue;
    }

    const horizontal = axis === "x";
    const mousePos = horizontal ? point.x : point.y;
    const scale = horizontal ? scaleX : scaleY;
    const itemStart =
      (horizontal ? containerRect.left : containerRect.top) +
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
export function isEventFromContainer(e: {
  currentTarget?: EventTarget | null;
  target?: EventTarget | null;
}) {
  const { currentTarget, target } = e;
  if (!(currentTarget instanceof Node) || !(target instanceof Node))
    return true;
  return currentTarget.contains(target);
}

export const FLUID_HOVER_ACTIVE_ATTRIBUTE = "data-fluid-hover-active";
export const FLUID_HOVER_ACTIVE_INDEX_ATTRIBUTE = "data-fluid-hover-active-index";

const ACTIVATOR_SELECTOR =
  "a[href], button, [role='menuitem'], [role='menuitemradio'], [role='menuitemcheckbox'], [role='option'], [role='radio'], [role='checkbox'], [role='tab'], [role='link'], [role='button']";

function resolveActivator(element: HTMLElement): HTMLElement {
  if (element.matches(ACTIVATOR_SELECTOR) || element.hasAttribute("tabindex")) {
    return element;
  }
  return element.querySelector<HTMLElement>(ACTIVATOR_SELECTOR) ?? element;
}

// Retry delayed popup layout, but stop if the popup stays hidden.
const measurementAttempts = 3;

export function useFluidHover<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  options: UseFluidHoverOptions = {}
): UseFluidHoverResult {
  const {
    axis = "y",
    isItemDisabled,
    gapClick = true,
    nearest = false,
  } = options;
  const gapClickMaxDistance =
    typeof gapClick === "object"
      ? (gapClick.maxDistance ?? Infinity)
      : Infinity;
  const itemsRef = useRef(new Map<number, HTMLElement>());
  // The store is authoritative for both pointer handlers and subscribed rows.
  const activeIndexRef = useRef<number | null>(null);
  const listenersRef = useRef(new Set<() => void>());
  const activeStore = useMemo<FluidHoverActiveStore>(
    () => ({
      subscribe: (listener) => {
        listenersRef.current.add(listener);
        return () => {
          listenersRef.current.delete(listener);
        };
      },
      get: () => activeIndexRef.current,
    }),
    []
  );
  const activeIndex = useSyncExternalStore(
    activeStore.subscribe,
    activeStore.get,
    () => null
  );
  const setActiveIndex = useCallback<Dispatch<SetStateAction<number | null>>>(
    (action) => {
      const previous = activeIndexRef.current;
      const next = typeof action === "function" ? action(previous) : action;
      if (next === previous) return;
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
    },
    [containerRef]
  );
  const [itemRects, setItemRects] = useState<HoverItemRect[]>([]);
  const [isMeasured, setIsMeasured] = useState(false);
  const itemRectsRef = useRef<HoverItemRect[]>([]);
  const [session, setSession] = useState(0);
  const sessionRef = useRef(0);
  // Update the session and its first highlight together to avoid animating from a stale row.
  const sessionPendingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const remeasureRafIdRef = useRef<number | null>(null);

  const runMeasurement = useCallback(() => {
    const container = containerRef.current;
    if (!container) return false;
    const rects: HoverItemRect[] = [];
    let everyItemHasLayout = true;
    itemsRef.current.forEach((element, index) => {
      // Hidden elements report zero offsets; fixed-position elements can still have a size.
      const hasLayoutBox =
        element.offsetParent !== null ||
        element.offsetWidth > 0 ||
        element.offsetHeight > 0;
      if (!hasLayoutBox) {
        everyItemHasLayout = false;
        return;
      }
      // Layout offsets ignore transforms. Accumulate positioned ancestors to match the overlay container.
      let top = element.offsetTop;
      let left = element.offsetLeft;
      let ancestor = element.offsetParent as HTMLElement | null;
      while (
        ancestor &&
        ancestor !== container &&
        container.contains(ancestor)
      ) {
        top += ancestor.offsetTop + ancestor.clientTop;
        left += ancestor.offsetLeft + ancestor.clientLeft;
        ancestor = ancestor.offsetParent as HTMLElement | null;
      }
      rects[index] = {
        top,
        height: element.offsetHeight,
        left,
        width: element.offsetWidth,
      };
    });
    if (!everyItemHasLayout) return false;
    const prev = itemRectsRef.current;
    let changed = prev.length !== rects.length;
    for (let i = 0; !changed && i < rects.length; i++) {
      const p = prev[i];
      const r = rects[i];
      if (p === r) continue; // both undefined (sparse slot)
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

  const scheduleMeasurement = useCallback(
    (attempts: number) => {
      const attempt = (attemptsLeft: number) => {
        if (remeasureRafIdRef.current !== null) {
          cancelAnimationFrame(remeasureRafIdRef.current);
        }
        remeasureRafIdRef.current = requestAnimationFrame(() => {
          remeasureRafIdRef.current = null;
          if (runMeasurement()) {
            setIsMeasured(true);
          } else if (attemptsLeft > 1) {
            attempt(attemptsLeft - 1);
          }
        });
      };
      attempt(attempts);
    },
    [runMeasurement]
  );

  const remeasure = useCallback(() => {
    // Hide overlays until corrected rects are ready, so they do not animate from a stale position.
    setIsMeasured(false);
    scheduleMeasurement(measurementAttempts);
  }, [scheduleMeasurement]);

  // Rows can resize without changing the container size.
  const itemRoRef = useRef<ResizeObserver | null>(null);
  const getItemRo = useCallback(() => {
    if (itemRoRef.current === null && typeof ResizeObserver !== "undefined") {
      itemRoRef.current = new ResizeObserver(() =>
        scheduleMeasurement(measurementAttempts)
      );
    }
    return itemRoRef.current;
  }, [scheduleMeasurement]);

  const registerItem = useCallback(
    (index: number, element: HTMLElement | null) => {
      if (element) {
        itemsRef.current.set(index, element);
        getItemRo()?.observe(element);
        if (index === activeIndexRef.current)
          element.setAttribute(FLUID_HOVER_ACTIVE_ATTRIBUTE, "");
      } else {
        const previous = itemsRef.current.get(index);
        if (previous) itemRoRef.current?.unobserve(previous);
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
    },
    [remeasure, getItemRo, setActiveIndex]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isEventFromContainer(e)) return;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const target = e.target as Node;

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const container = containerRef.current;
        if (!container) return;
        let next: number | null;
        if (!nearest) {
          // Nested items take precedence over their containing row.
          next = null;
          let hit: HTMLElement | null = null;
          for (const [index, el] of itemsRef.current) {
            if (!el.contains(target) || isItemDisabled?.(el)) continue;
            if (!hit || hit.contains(el)) {
              hit = el;
              next = index;
            }
          }
        } else
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
        if (next === null) sessionPendingRef.current = true;
        setActiveIndex(next);
      });
    },
    [axis, containerRef, isItemDisabled, nearest, setActiveIndex]
  );

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

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      for (const element of itemsRef.current.values()) {
        if (element.contains(target)) return;
      }
      // A click may unmount its row before bubbling here; do not route it a second time.
      if (!target.isConnected) return;
      if (!isEventFromContainer(e)) return;
      const control = (target as Element).closest?.(
        "input, textarea, select, button, a, summary, [contenteditable], [role='textbox'], [role='searchbox'], [role='button']"
      );
      if (control) return;
      // Pointer updates lag by one frame; a stale highlight must not receive gap clicks.
      if (gapClick === false || !nearest) return;
      const index = activeIndexRef.current;
      if (index === null) return;
      const element = itemsRef.current.get(index);
      if (!element || isItemDisabled?.(element)) return;
      if (gapClickMaxDistance !== Infinity) {
        const r = element.getBoundingClientRect();
        const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
        const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
        if (Math.hypot(dx, dy) > gapClickMaxDistance) return;
      }
      resolveActivator(element).click();
    },
    [isItemDisabled, gapClick, gapClickMaxDistance, nearest]
  );

  // Keep overlays visible during reflow; invalidating readiness here would cause flicker.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() =>
      scheduleMeasurement(measurementAttempts)
    );
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

const subscribeNever = () => () => {};

/** Return a stable snapshot from `select`; fresh objects would trigger repeated renders. */
export function useFluidHoverSelect<T>(
  store: FluidHoverActiveStore | null | undefined,
  select: (activeIndex: number | null) => T
): T {
  return useSyncExternalStore(
    store?.subscribe ?? subscribeNever,
    () => select(store ? store.get() : null),
    () => select(null)
  );
}

export function useRegisterFluidHoverItem(
  registerItem:
    | ((index: number, element: HTMLElement | null) => void)
    | undefined,
  index: number | undefined,
  ref: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    if (!registerItem || index === undefined) return;
    registerItem(index, ref.current);
    return () => registerItem(index, null);
  }, [index, registerItem, ref]);
}
