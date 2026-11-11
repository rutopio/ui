import { type Dispatch, type RefObject, type SetStateAction } from "react";
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
    gapClick?: boolean | {
        maxDistance?: number;
    };
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
    point: {
        x: number;
        y: number;
    };
    /** Container layout coordinates; unregistered indices are empty. */
    rects: readonly (HoverItemRect | undefined)[];
    /** Viewport coordinates, including transforms. */
    containerRect: {
        left: number;
        top: number;
        width: number;
        height: number;
    };
    scroll: {
        x: number;
        y: number;
    };
    border: {
        x: number;
        y: number;
    };
    /** Untransformed size, used to recover ancestor scale. */
    layoutSize: {
        width: number;
        height: number;
    };
    isDisabled?: (index: number) => boolean;
}
export declare function findNearestHoverItemIndex({ axis, point, rects, containerRect, scroll, border, layoutSize, isDisabled, }: NearestHoverItemOptions): number | null;
/** React portals bubble through the component tree but are outside the container DOM. */
export declare function isEventFromContainer(e: {
    currentTarget?: EventTarget | null;
    target?: EventTarget | null;
}): boolean;
export declare const FLUID_HOVER_ACTIVE_ATTRIBUTE = "data-fluid-hover-active";
export declare const FLUID_HOVER_ACTIVE_INDEX_ATTRIBUTE = "data-fluid-hover-active-index";
export declare function useFluidHover<T extends HTMLElement>(containerRef: RefObject<T | null>, options?: UseFluidHoverOptions): UseFluidHoverResult;
/** Return a stable snapshot from `select`; fresh objects would trigger repeated renders. */
export declare function useFluidHoverSelect<T>(store: FluidHoverActiveStore | null | undefined, select: (activeIndex: number | null) => T): T;
export declare function useRegisterFluidHoverItem(registerItem: ((index: number, element: HTMLElement | null) => void) | undefined, index: number | undefined, ref: RefObject<HTMLElement | null>): void;
