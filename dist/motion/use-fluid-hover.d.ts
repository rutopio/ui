import { type Dispatch, type RefObject, type SetStateAction } from "react";
export interface HoverItemRect {
    top: number;
    height: number;
    left: number;
    width: number;
}
export interface UseFluidHoverOptions {
    /**
     * With `nearest`, which direction to resolve the nearest item along.
     *   "y"  — vertical lists (default): closest by top/height
     *   "x"  — horizontal strips: closest by left/width
     *   "xy" — 2-D grids: closest card across both rows AND columns,
     *          measured by Euclidean distance to each item's center
     */
    axis?: "x" | "y" | "xy";
    /**
     * Makes an item invisible to hit-testing without unregistering it — for
     * rows that stay mounted while clipped away (a collapsed sub-tree).
     * Unregistering would invalidate every measurement; a skipped item keeps
     * the set stable. Consulted per mouse move, so keep it cheap.
     */
    isItemDisabled?: (element: HTMLElement) => boolean;
    /**
     * With `nearest`, whether a click that lands between items (a gap, the
     * padding, past the last row) is routed to the highlighted item, so what
     * is lit is what a click hits. On by default: in a menu or a list the
     * highlight is a promise about the click. Without `nearest` nothing is lit
     * between items, so there is nothing to route. Pass `false` where empty
     * space should stay
     * inert (rows with destructive actions, generous whitespace), or
     * `{ maxDistance }` to route only clicks within that many pixels of the
     * highlighted item's edge.
     */
    gapClick?: boolean | {
        maxDistance?: number;
    };
    /**
     * Whether empty space lights the nearest item. Off by default: only the
     * item under the pointer lights, and the highlight fades out over empty
     * space (a popup's padding, the unfilled end of a grid row, a label beside
     * a control), gliding again from the next item it lands on. Pass `true` to
     * light the item nearest the pointer wherever it is in the container.
     */
    nearest?: boolean;
}
/**
 * The highlighted index as a store a row can subscribe to. Read it with
 * `useFluidHoverSelect` instead of passing `activeIndex` down a context: a
 * context re-renders every row on every highlight change, a selector
 * re-renders the row the highlight left and the row it reached.
 */
export interface FluidHoverActiveStore {
    subscribe: (listener: () => void) => () => void;
    get: () => number | null;
}
export interface UseFluidHoverResult {
    activeIndex: number | null;
    setActiveIndex: Dispatch<SetStateAction<number | null>>;
    /** `activeIndex` as a stable store, for rows (see `useFluidHoverSelect`). */
    activeStore: FluidHoverActiveStore;
    itemRects: HoverItemRect[];
    /**
     * True once every registered item has been measured and no remeasure is
     * pending, i.e. `itemRects` describes the current item set. Gate absolutely
     * positioned overlays on it: an overlay that mounts against a rect a later
     * pass still corrects animates from the wrong place to the right one, which
     * reads as the highlight sliding in from another row.
     */
    isMeasured: boolean;
    /**
     * Counts pointer entries. It steps when the pointer, having entered the
     * container, first moves the highlight, so the highlight keyed on it fades
     * in at the new row instead of sliding over from where it was last (a row
     * lit from the keyboard, or one still fading out).
     */
    session: number;
    /** The same count as `session`, for code that reads it outside a render. */
    sessionRef: RefObject<number>;
    handlers: {
        /** Picks the item nearest the pointer. Moves that happened in a
         *  portalled child (a row's own dropdown) are ignored. */
        onMouseMove: (e: React.MouseEvent) => void;
        onMouseEnter: () => void;
        onMouseLeave: () => void;
        /**
         * Routes a click that lands between items (a gap, the padding, past the
         * last row) to the highlighted item, so the highlight and the click agree:
         * what is lit is what a click hits. A click inside an item is left to the
         * item, and so is one on a control between items (a search field) or
         * from a portalled child (a row's own dropdown): it never landed between
         * these items. Disabled items (`isItemDisabled`) are never activated.
         */
        onClick: (e: React.MouseEvent) => void;
    };
    registerItem: (index: number, element: HTMLElement | null) => void;
    /**
     * Invalidates the published rects and runs the hook's coalesced measurement
     * pass again, holding `isMeasured` false until it settles. Reach for it when
     * the rects may be wrong and showing an overlay against them would misplace
     * it: a popup that stays mounted between opens keeps its items registered,
     * so nothing else would notice that its rects were taken while it was
     * hidden. Registration, item resize, and container resize already trigger
     * a pass; do not call this on `children` changes.
     */
    remeasure: () => void;
    /**
     * Re-reads the rects synchronously, keeping `isMeasured` as it is. Only for
     * layout that moves the rows under a visible overlay frame by frame (the
     * accordion re-measures inside its height animation). Everything else
     * wants `remeasure`, or nothing.
     */
    measureItems: () => void;
}
export interface NearestHoverItemOptions {
    axis: "x" | "y" | "xy";
    /** The pointer, in viewport coordinates. */
    point: {
        x: number;
        y: number;
    };
    /** Item rects in the container's layout space (sparse: unregistered slots
     *  are undefined). */
    rects: readonly (HoverItemRect | undefined)[];
    /** The container's bounding rect and live scroll / border offsets, which
     *  map layout rects into the pointer's viewport space. */
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
    /** Layout size of the container, so a cumulative ancestor `transform:
     *  scale` (a popup mid scale-in) can be factored out per axis. */
    layoutSize: {
        width: number;
        height: number;
    };
    /** Skips an item without unregistering it. */
    isDisabled?: (index: number) => boolean;
}
/**
 * The rule, as one pure function: an item the pointer is inside wins;
 * otherwise the item whose center is nearest does, so a pointer in a gap, in
 * the padding, or past the last row still lands. `y` and `x` measure one
 * coordinate; `xy` measures the straight line to each center. Ties keep the
 * first item. The hook calls this once per animation frame; the docs page
 * times it.
 */
export declare function findNearestHoverItemIndex({ axis, point, rects, containerRect, scroll, border, layoutSize, isDisabled, }: NearestHoverItemOptions): number | null;
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
export declare function isEventFromContainer(e: {
    currentTarget?: EventTarget | null;
    target?: EventTarget | null;
}): boolean;
/** Set on the highlighted item (boolean attribute). */
export declare const FLUID_HOVER_ACTIVE_ATTRIBUTE = "data-fluid-hover-active";
/** Set on the container: the highlighted index, or absent. */
export declare const FLUID_HOVER_ACTIVE_INDEX_ATTRIBUTE = "data-fluid-hover-active-index";
export declare function useFluidHover<T extends HTMLElement>(containerRef: RefObject<T | null>, options?: UseFluidHoverOptions): UseFluidHoverResult;
/**
 * Reads one value derived from the highlighted index, re-rendering only when
 * that value changes. The selector must return a primitive:
 *
 *   const isActive = useFluidHoverSelect(ctx?.activeStore, (i) => i === index);
 *
 * A missing store (a row rendered outside a list) reads as nothing lit.
 */
export declare function useFluidHoverSelect<T>(store: FluidHoverActiveStore | null | undefined, select: (activeIndex: number | null) => T): T;
/**
 * Registers an item's element with its list for as long as it is mounted.
 * The one way rows join a list: pass the hook's `registerItem` (or the copy
 * a context hands down), the row's index, and its ref. Either may be
 * missing for a row rendered outside a list (a standalone card, an accordion
 * item that is not grouped); then nothing is registered.
 */
export declare function useRegisterFluidHoverItem(registerItem: ((index: number, element: HTMLElement | null) => void) | undefined, index: number | undefined, ref: RefObject<HTMLElement | null>): void;
